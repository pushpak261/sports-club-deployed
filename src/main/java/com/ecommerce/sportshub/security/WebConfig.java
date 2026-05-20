package com.ecommerce.sportshub.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC configuration.
 * Forwards unknown paths to index.html for React Router SPA support.
 * (Static image serving removed — images are now stored as Base64 in DB)
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/{spring:\\w+}")
                .setViewName("forward:/index.html");
        registry.addViewController("/**/{spring:[^.]*}")
                .setViewName("forward:/index.html");
    }
}