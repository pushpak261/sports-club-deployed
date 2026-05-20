package com.ecommerce.sportshub.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Caffeine in-process cache configuration.
 * No external service needed (unlike Redis) — perfect for free tier.
 *
 * Cache names:
 * - "categories" — rarely change, read on every page load
 * - "products"   — read-heavy, paginated lists
 * - "productById" — individual product detail pages
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(
                "categories", "products", "productById", "categoryById"
        );
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(200)                    // Max 200 entries per cache
                .expireAfterWrite(10, TimeUnit.MINUTES) // Refresh every 10 min
                .recordStats()                        // Enable hit/miss stats
        );
        return cacheManager;
    }
}
