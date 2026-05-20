package com.ecommerce.sportshub.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS configuration.
 * Allows requests from the React dev server (localhost:3000),
 * the production build served by Spring Boot (localhost:2424),
 * and the deployed frontend (via FRONTEND_URL env var).
 */
@Configuration
public class CorsConfig {

    @Value("${FRONTEND_URL:http://localhost:3000}")
    private String frontendUrl;

    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns(
                                "http://localhost:3000",   // React dev server
                                "http://localhost:2424",   // Spring Boot serving built frontend
                                frontendUrl                // Deployed frontend (Netlify etc.)
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .exposedHeaders("Authorization", "Content-Disposition");
            }
        };
    }
}
