package com.ecommerce.sportshub.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

/**
 * Web MVC configuration.
 * - Serves locally uploaded product images at /images/**
 * - Forwards unknown paths to index.html for React Router SPA support
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:uploads/images}")
    private String uploadDir;

    /**
     * Maps GET /images/** to the local upload directory so that product
     * image URLs returned by the API are directly servable by Spring Boot.
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Resolve the absolute path of the upload directory
        String absoluteUploadPath = Paths.get(uploadDir).toAbsolutePath().normalize().toString();

        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + absoluteUploadPath + "/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/{spring:\\w+}")
                .setViewName("forward:/index.html");
        registry.addViewController("/**/{spring:[^.]*}")
                .setViewName("forward:/index.html");
    }
}