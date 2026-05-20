package com.ecommerce.sportshub.service.impl;

import com.ecommerce.sportshub.dto.ProductDto;
import com.ecommerce.sportshub.dto.Response;
import com.ecommerce.sportshub.entity.Category;
import com.ecommerce.sportshub.entity.Product;
import com.ecommerce.sportshub.exception.NotFoundException;
import com.ecommerce.sportshub.mapper.EntityDtoMapper;
import com.ecommerce.sportshub.repository.CategoryRepo;
import com.ecommerce.sportshub.repository.ProductRepo;
import com.ecommerce.sportshub.service.LocalFileStorageService;
import com.ecommerce.sportshub.service.interf.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepo productRepo;
    private final CategoryRepo categoryRepo;
    private final EntityDtoMapper entityDtoMapper;
    private final LocalFileStorageService localFileStorageService;


    @Override
    @Transactional
    @CacheEvict(value = {"products", "productById"}, allEntries = true)
    public Response createProduct(Long categoryId, MultipartFile image, String name, String description, BigDecimal price) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category not found"));
        String productImageUrl = localFileStorageService.saveImageToLocal(image);

        Product product = new Product();
        product.setCategory(category);
        product.setPrice(price);
        product.setName(name);
        product.setDescription(description);
        product.setImageUrl(productImageUrl);

        productRepo.save(product);
        return Response.builder()
                .status(200)
                .message("Product successfully created")
                .build();
    }

    @Override
    @Transactional
    @CacheEvict(value = {"products", "productById"}, allEntries = true)
    public Response updateProduct(Long productId, Long categoryId, MultipartFile image, String name, String description, BigDecimal price) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product Not Found"));

        Category category = null;
        String productImageUrl = null;

        if (categoryId != null) {
            category = categoryRepo.findById(categoryId)
                    .orElseThrow(() -> new NotFoundException("Category not found"));
        }
        if (image != null && !image.isEmpty()) {
            productImageUrl = localFileStorageService.saveImageToLocal(image);
        }

        if (category != null) product.setCategory(category);
        if (name != null) product.setName(name);
        if (price != null) product.setPrice(price);
        if (description != null) product.setDescription(description);
        if (productImageUrl != null) product.setImageUrl(productImageUrl);

        productRepo.save(product);
        return Response.builder()
                .status(200)
                .message("Product updated successfully")
                .build();
    }

    @Override
    @Transactional
    @CacheEvict(value = {"products", "productById"}, allEntries = true)
    public Response deleteProduct(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product Not Found"));
        productRepo.delete(product);

        return Response.builder()
                .status(200)
                .message("Product deleted successfully")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "productById", key = "#productId")
    public Response getProductById(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product Not Found"));
        ProductDto productDto = entityDtoMapper.mapProductToDtoBasic(product);

        return Response.builder()
                .status(200)
                .product(productDto)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "products")
    public Response getAllProducts() {
        List<ProductDto> productList = productRepo.findAll(Sort.by(Sort.Direction.DESC, "id")).stream()
                .map(entityDtoMapper::mapProductToDtoBasic)
                .toList();

        return Response.builder()
                .status(200)
                .productList(productList)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Response getProductsByCategory(Long categoryId) {
        List<Product> products = productRepo.findByCategoryId(categoryId);
        if (products.isEmpty()) {
            throw new NotFoundException("No Products found for this category");
        }
        List<ProductDto> productDtoList = products.stream()
                .map(entityDtoMapper::mapProductToDtoBasic)
                .toList();

        return Response.builder()
                .status(200)
                .productList(productDtoList)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Response searchProduct(String searchValue) {
        List<Product> products = productRepo.searchByNameOrDescription(searchValue);

        if (products.isEmpty()) {
            throw new NotFoundException("No Products Found");
        }
        List<ProductDto> productDtoList = products.stream()
                .map(entityDtoMapper::mapProductToDtoBasic)
                .toList();

        return Response.builder()
                .status(200)
                .productList(productDtoList)
                .build();
    }
}
