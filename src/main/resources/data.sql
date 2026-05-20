-- Fix: Alter the image_url column from VARCHAR(255) to LONGTEXT
-- to support Base64 data URIs stored directly in the database.
ALTER TABLE products MODIFY COLUMN image_url LONGTEXT;

-- === PERFORMANCE: Database indexes for frequently queried columns ===
-- Product lookups by category (used on category pages)
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Product search by name
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- User lookup by email (used on every authenticated request)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Order items by user (used for order history)
CREATE INDEX IF NOT EXISTS idx_order_items_user_id ON order_items(user_id);

-- Order items by status (used for admin filtering)
CREATE INDEX IF NOT EXISTS idx_order_items_status ON order_items(status);

-- Order items by order (used for order details)
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Order items by product (used for product-order joins)
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
