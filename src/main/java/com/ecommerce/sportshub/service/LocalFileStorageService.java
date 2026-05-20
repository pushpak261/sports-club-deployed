package com.ecommerce.sportshub.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

/**
 * Image storage service that converts uploaded images to Base64 data URIs.
 * The data URI is stored directly in the database, so images survive
 * container restarts and redeploys (Render free tier has ephemeral storage).
 */
@Service
@Slf4j
public class LocalFileStorageService {

    /**
     * Converts the uploaded image to a Base64 data URI string.
     * This string can be used directly in HTML img src attributes.
     *
     * @param photo the image file uploaded via multipart form
     * @return a data URI string (e.g., "data:image/png;base64,iVBOR...")
     */
    public String saveImageToLocal(MultipartFile photo) {
        try {
            // Determine the MIME type
            String contentType = photo.getContentType();
            if (contentType == null) {
                contentType = "image/jpeg"; // fallback
            }

            // Convert to Base64
            byte[] imageBytes = photo.getBytes();
            String base64 = Base64.getEncoder().encodeToString(imageBytes);

            // Build the data URI
            String dataUri = "data:" + contentType + ";base64," + base64;

            log.info("Image converted to Base64 data URI ({} bytes)", imageBytes.length);

            return dataUri;

        } catch (IOException e) {
            log.error("Failed to convert image to Base64", e);
            throw new RuntimeException("Unable to process image: " + e.getMessage());
        }
    }
}
