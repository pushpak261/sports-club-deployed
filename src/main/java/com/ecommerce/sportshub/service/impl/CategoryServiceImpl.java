package com.ecommerce.sportshub.service.impl;

import com.ecommerce.sportshub.dto.CategoryDto;
import com.ecommerce.sportshub.dto.Response;
import com.ecommerce.sportshub.entity.Category;
import com.ecommerce.sportshub.exception.NotFoundException;
import com.ecommerce.sportshub.mapper.EntityDtoMapper;
import com.ecommerce.sportshub.repository.CategoryRepo;
import com.ecommerce.sportshub.service.interf.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepo categoryRepo;
    private final EntityDtoMapper entityDtoMapper;


    @Override
    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public Response createCategory(CategoryDto categoryRequest) {
        Category category = new Category();
        category.setName(categoryRequest.getName());
        categoryRepo.save(category);
        return Response.builder()
                .status(200)
                .message("Category created successfully")
                .build();
    }

    @Override
    @Transactional
    @CacheEvict(value = {"categories", "categoryById"}, allEntries = true)
    public Response updateCategory(Long categoryId, CategoryDto categoryRequest) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category Not Found"));
        category.setName(categoryRequest.getName());
        categoryRepo.save(category);
        return Response.builder()
                .status(200)
                .message("category updated successfully")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "categories")
    public Response getAllCategories() {
        List<CategoryDto> categoryDtoList = categoryRepo.findAll().stream()
                .map(entityDtoMapper::mapCategoryToDtoBasic)
                .toList();

        return Response.builder()
                .status(200)
                .categoryList(categoryDtoList)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "categoryById", key = "#categoryId")
    public Response getCategoryById(Long categoryId) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category Not Found"));
        CategoryDto categoryDto = entityDtoMapper.mapCategoryToDtoBasic(category);
        return Response.builder()
                .status(200)
                .category(categoryDto)
                .build();
    }

    @Override
    @Transactional
    @CacheEvict(value = {"categories", "categoryById"}, allEntries = true)
    public Response deleteCategory(Long categoryId) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category Not Found"));
        categoryRepo.delete(category);
        return Response.builder()
                .status(200)
                .message("Category was deleted successfully")
                .build();
    }
}
