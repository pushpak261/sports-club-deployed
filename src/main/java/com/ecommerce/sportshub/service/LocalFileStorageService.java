package com.ecommerce.sportshub.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Local file storage service replacing AWS S3.
 * Saves uploaded product images to a local directory on disk and
 * returns a URL that Spring Boot serves via the /images/** endpoint.
 */
@Service
@Slf4j
public class LocalFileStorageService {

    @Value("${file.upload-dir:uploads/images}")
    private String uploadDir;

    @Value("${APP_BASE_URL:http://localhost:2424}")
    private String appBaseUrl;

    /**
     * Saves the given image to the local upload directory and returns
     * the publicly accessible URL for that image.
     *
     * @param photo the image file uploaded via multipart form
     * @return the HTTP URL at which the image can be accessed
     */
    public String saveImageToLocal(MultipartFile photo) {
        try {
            // Resolve absolute upload directory path and create if missing
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // Generate a unique filename to avoid collisions
            String originalFilename = photo.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            // Copy the uploaded bytes to the target location
            Path targetLocation = uploadPath.resolve(uniqueFilename);
            Files.copy(photo.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            log.info("Image saved locally at: {}", targetLocation);

            // Return the URL Spring Boot will serve this file at
            return appBaseUrl + "/images/" + uniqueFilename;

        } catch (IOException e) {
            log.error("Failed to save image locally", e);
            throw new RuntimeException("Unable to save image locally: " + e.getMessage());
        }
    }
}
