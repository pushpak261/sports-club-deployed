package com.ecommerce.sportshub.repository;

import com.ecommerce.sportshub.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepo extends JpaRepository<Product, Long> {

    List<Product> findByCategoryId(Long categoryId);

    /**
     * Case-insensitive search using LOWER() — more efficient than default Spring Data
     * LIKE which is case-sensitive on some MySQL collations.
     */
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Product> searchByNameOrDescription(@Param("search") String searchValue);
}
