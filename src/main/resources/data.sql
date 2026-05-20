-- Fix: Alter the image_url column from VARCHAR(255) to LONGTEXT
-- to support Base64 data URIs stored directly in the database.
-- This is safe to run multiple times (idempotent).
ALTER TABLE products MODIFY COLUMN image_url LONGTEXT;
