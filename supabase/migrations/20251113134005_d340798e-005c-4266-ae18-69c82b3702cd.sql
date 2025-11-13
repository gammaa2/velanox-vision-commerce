-- Update all product image paths to use public folder
UPDATE products 
SET images = ARRAY[REPLACE(images[1], '/src/assets/products/', '/products/')];