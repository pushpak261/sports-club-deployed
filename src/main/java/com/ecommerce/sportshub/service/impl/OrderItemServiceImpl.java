package com.ecommerce.sportshub.service.impl;

import com.ecommerce.sportshub.dto.OrderItemDto;
import com.ecommerce.sportshub.dto.OrderRequest;
import com.ecommerce.sportshub.dto.Response;
import com.ecommerce.sportshub.entity.Order;
import com.ecommerce.sportshub.entity.OrderItem;
import com.ecommerce.sportshub.entity.Product;
import com.ecommerce.sportshub.entity.User;
import com.ecommerce.sportshub.enums.OrderStatus;
import com.ecommerce.sportshub.exception.NotFoundException;
import com.ecommerce.sportshub.mapper.EntityDtoMapper;
import com.ecommerce.sportshub.repository.OrderItemRepo;
import com.ecommerce.sportshub.repository.OrderRepo;
import com.ecommerce.sportshub.repository.ProductRepo;
import com.ecommerce.sportshub.service.interf.OrderItemService;
import com.ecommerce.sportshub.service.interf.UserService;
import com.ecommerce.sportshub.specification.OrderItemSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderRepo orderRepo;
    private final OrderItemRepo orderItemRepo;
    private final ProductRepo productRepo;
    private final UserService userService;
    private final EntityDtoMapper entityDtoMapper;


    @Override
    @Transactional
    public Response placeOrder(OrderRequest orderRequest) {
        User user = userService.getLoginUser();

        // N+1 FIX: Batch-fetch ALL products in ONE query instead of N separate queries
        Set<Long> productIds = orderRequest.getItems().stream()
                .map(item -> item.getProductId())
                .collect(Collectors.toSet());

        Map<Long, Product> productMap = productRepo.findAllById(productIds).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        // Validate all products exist
        for (Long id : productIds) {
            if (!productMap.containsKey(id)) {
                throw new NotFoundException("Product Not Found with id: " + id);
            }
        }

        // Build order items using the pre-fetched product map — O(1) lookup per item
        List<OrderItem> orderItems = orderRequest.getItems().stream().map(orderItemRequest -> {
            Product product = productMap.get(orderItemRequest.getProductId());

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(orderItemRequest.getQuantity());
            orderItem.setPrice(product.getPrice().multiply(BigDecimal.valueOf(orderItemRequest.getQuantity())));
            orderItem.setStatus(OrderStatus.PENDING);
            orderItem.setUser(user);
            return orderItem;
        }).toList();

        BigDecimal totalPrice = orderRequest.getTotalPrice() != null && orderRequest.getTotalPrice().compareTo(BigDecimal.ZERO) > 0
                ? orderRequest.getTotalPrice()
                : orderItems.stream().map(OrderItem::getPrice).reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = new Order();
        order.setOrderItemList(orderItems);
        order.setTotalPrice(totalPrice);

        orderItems.forEach(orderItem -> orderItem.setOrder(order));

        orderRepo.save(order);

        return Response.builder()
                .status(200)
                .message("Order was successfully placed")
                .build();
    }

    @Override
    @Transactional
    public Response updateOrderItemStatus(Long orderItemId, String status) {
        OrderItem orderItem = orderItemRepo.findById(orderItemId)
                .orElseThrow(() -> new NotFoundException("Order Item not found"));

        orderItem.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        orderItemRepo.save(orderItem);
        return Response.builder()
                .status(200)
                .message("Order status updated successfully")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Response filterOrderItems(OrderStatus status, LocalDateTime startDate, LocalDateTime endDate, Long itemId, Pageable pageable) {
        Specification<OrderItem> spec = Specification.where(OrderItemSpecification.hasStatus(status))
                .and(OrderItemSpecification.createdBetween(startDate, endDate))
                .and(OrderItemSpecification.hasItemId(itemId));

        Page<OrderItem> orderItemPage = orderItemRepo.findAll(spec, pageable);

        if (orderItemPage.isEmpty()) {
            throw new NotFoundException("No Order Found");
        }
        List<OrderItemDto> orderItemDtos = orderItemPage.getContent().stream()
                .map(entityDtoMapper::mapOrderItemToDtoPlusProductAndUser)
                .toList();

        return Response.builder()
                .status(200)
                .orderItemList(orderItemDtos)
                .totalPage(orderItemPage.getTotalPages())
                .totalElement(orderItemPage.getTotalElements())
                .build();
    }
}
