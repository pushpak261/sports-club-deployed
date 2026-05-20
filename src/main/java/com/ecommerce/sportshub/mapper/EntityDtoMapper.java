package com.ecommerce.sportshub.mapper;

import com.ecommerce.sportshub.dto.*;
import com.ecommerce.sportshub.entity.*;
import org.springframework.stereotype.Component;

/**
 * Centralized entity-to-DTO mapper.
 * Uses .toList() (Java 21) for immutable, faster list creation.
 * Null-safe: checks all relationships before traversing.
 */
@Component
public class EntityDtoMapper {

    /** Map User entity to basic DTO (no relations loaded) */
    public UserDto mapUserToDtoBasic(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRole().name());
        userDto.setName(user.getName());
        return userDto;
    }

    /** Map Address entity to DTO */
    public AddressDto mapAddressToDtoBasic(Address address) {
        AddressDto addressDto = new AddressDto();
        addressDto.setId(address.getId());
        addressDto.setCity(address.getCity());
        addressDto.setStreet(address.getStreet());
        addressDto.setState(address.getState());
        addressDto.setCountry(address.getCountry());
        addressDto.setZipCode(address.getZipCode());
        return addressDto;
    }

    /** Map Category entity to DTO */
    public CategoryDto mapCategoryToDtoBasic(Category category) {
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(category.getId());
        categoryDto.setName(category.getName());
        return categoryDto;
    }

    /** Map OrderItem entity to basic DTO (no product/user loaded) */
    public OrderItemDto mapOrderItemToDtoBasic(OrderItem orderItem) {
        OrderItemDto orderItemDto = new OrderItemDto();
        orderItemDto.setId(orderItem.getId());
        orderItemDto.setQuantity(orderItem.getQuantity());
        orderItemDto.setPrice(orderItem.getPrice());
        orderItemDto.setStatus(orderItem.getStatus().name());
        orderItemDto.setCreatedAt(orderItem.getCreatedAt());
        return orderItemDto;
    }

    /** Map Product entity to DTO */
    public ProductDto mapProductToDtoBasic(Product product) {
        ProductDto productDto = new ProductDto();
        productDto.setId(product.getId());
        productDto.setName(product.getName());
        productDto.setDescription(product.getDescription());
        productDto.setPrice(product.getPrice());
        productDto.setImageUrl(product.getImageUrl());
        return productDto;
    }

    /** Map User with Address (2 entities → 1 DTO) */
    public UserDto mapUserToDtoPlusAddress(User user) {
        UserDto userDto = mapUserToDtoBasic(user);
        if (user.getAddress() != null) {
            userDto.setAddress(mapAddressToDtoBasic(user.getAddress()));
        }
        return userDto;
    }

    /** Map OrderItem with Product (2 entities → 1 DTO) */
    public OrderItemDto mapOrderItemToDtoPlusProduct(OrderItem orderItem) {
        OrderItemDto orderItemDto = mapOrderItemToDtoBasic(orderItem);
        if (orderItem.getProduct() != null) {
            orderItemDto.setProduct(mapProductToDtoBasic(orderItem.getProduct()));
        }
        return orderItemDto;
    }

    /** Map OrderItem with Product + User (3 entities → 1 DTO) */
    public OrderItemDto mapOrderItemToDtoPlusProductAndUser(OrderItem orderItem) {
        OrderItemDto orderItemDto = mapOrderItemToDtoPlusProduct(orderItem);
        if (orderItem.getUser() != null) {
            orderItemDto.setUser(mapUserToDtoPlusAddress(orderItem.getUser()));
        }
        return orderItemDto;
    }

    /** Map User with Address + full Order History (N entities → 1 DTO) */
    public UserDto mapUserToDtoPlusAddressAndOrderHistory(User user) {
        UserDto userDto = mapUserToDtoPlusAddress(user);
        if (user.getOrderItemList() != null && !user.getOrderItemList().isEmpty()) {
            userDto.setOrderItemList(user.getOrderItemList().stream()
                    .map(this::mapOrderItemToDtoPlusProduct)
                    .toList());
        }
        return userDto;
    }
}
