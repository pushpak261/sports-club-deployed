package com.ecommerce.sportshub.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Product entity with Hibernate second-level cache enabled.
 * Products are read frequently and mutated rarely — ideal for L2 cache.
 */
@Data
@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_products_category_id", columnList = "category_id"),
    @Index(name = "idx_products_name", columnList = "name")
})
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "created_at")
    private final LocalDateTime createdAt = LocalDateTime.now();

}
