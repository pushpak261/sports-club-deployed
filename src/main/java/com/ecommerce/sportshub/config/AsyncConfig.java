package com.ecommerce.sportshub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Async configuration with a custom ThreadPoolTaskExecutor.
 * Enables @Async for non-blocking long-running operations
 * (e.g., image processing, email sending, heavy computations).
 */
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);       // Min threads (Render free tier has limited CPU)
        executor.setMaxPoolSize(4);        // Max threads
        executor.setQueueCapacity(50);     // Queue before rejecting
        executor.setThreadNamePrefix("Async-");
        executor.initialize();
        return executor;
    }
}
