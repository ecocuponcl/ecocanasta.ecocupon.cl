-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image TEXT,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_specs table
CREATE TABLE IF NOT EXISTS product_specs (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL
);

-- Create knasta_prices table
CREATE TABLE IF NOT EXISTS knasta_prices (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  url TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert categories
INSERT INTO categories (id, name, slug, description, image)
VALUES
  ('technology', 'Tecnologia', 'technology', 'Productos tecnologicos y electronicos', '/placeholder.svg?height=400&width=600'),
  ('fashion', 'Moda', 'fashion', 'Ropa, calzado y accesorios', '/placeholder.svg?height=400&width=600'),
  ('home', 'Hogar', 'home', 'Productos para el hogar y decoracion', '/placeholder.svg?height=400&width=600'),
  ('books', 'Libros', 'books', 'Libros y material de lectura', '/placeholder.svg?height=400&width=600'),
  ('office', 'Oficina', 'office', 'Articulos de oficina y papeleria', '/placeholder.svg?height=400&width=600')
ON CONFLICT (id) DO NOTHING;

-- Insert products
INSERT INTO products (id, name, description, price, image, category_id)
VALUES
  ('skechers-edgeride', 'Zapatilla Urbana Skechers Edgeride Mujer', 'Zapatillas urbanas comodas y ligeras para uso diario.', 39990, '/placeholder.svg?height=400&width=400', 'fashion'),
  ('blackie-books', 'Blackie Books - Blackwater', 'Libro Blackie Books - Blackwater / Parte V: La Fortuna', 12836, '/placeholder.svg?height=400&width=400', 'books'),
  ('bic-cristal', 'Lapiz Pasta Negro Bic Cristal', 'Lapiz Pasta Negro Bic Cristal Punta Media 50 Unidades', 22990, '/placeholder.svg?height=400&width=400', 'office'),
  ('maui-poleron', 'Poleron Surf Maui And Sons', 'Poleron Surf And Skate Company Crew Azul Maui And Sons', 19590, '/placeholder.svg?height=400&width=400', 'fashion'),
  ('hp-laserjet', 'Impresora HP LaserJet Pro', 'Impresora HP LaserJet Pro M404dw (W1A56A), 38ppm, 4800x600dpi', 198400, '/placeholder.svg?height=400&width=400', 'technology'),
  ('latam-base-cama', 'Base cama europea Latam Home', 'Base cama europea 1.5 plazas Zen rosa', 116990, '/placeholder.svg?height=400&width=400', 'home'),
  ('samsung-s23', 'Samsung Galaxy S23', 'Smartphone Samsung Galaxy S23 con 8GB RAM y 256GB almacenamiento', 899990, '/placeholder.svg?height=400&width=400', 'technology'),
  ('iphone-14', 'iPhone 14 Pro', 'Apple iPhone 14 Pro con chip A16 Bionic y camara de 48MP', 1299990, '/placeholder.svg?height=400&width=400', 'technology'),
  ('macbook-air', 'MacBook Air M2', 'Laptop Apple MacBook Air con chip M2, 8GB RAM y 256GB SSD', 1099990, '/placeholder.svg?height=400&width=400', 'technology'),
  ('sony-wh1000xm5', 'Sony WH-1000XM5', 'Audifonos inalambricos con cancelacion de ruido Sony WH-1000XM5', 349990, '/placeholder.svg?height=400&width=400', 'technology'),
  ('lg-oled-tv', 'LG OLED TV 55 pulgadas', 'Smart TV LG OLED 55 pulgadas 4K UHD con webOS', 899990, '/placeholder.svg?height=400&width=400', 'technology'),
  ('nike-air-max', 'Nike Air Max 90', 'Zapatillas Nike Air Max 90 para hombre, diseno clasico y comodo', 129990, '/placeholder.svg?height=400&width=400', 'fashion'),
  ('adidas-ultraboost', 'Adidas Ultraboost 22', 'Zapatillas de running Adidas Ultraboost 22 con tecnologia Boost', 149990, '/placeholder.svg?height=400&width=400', 'fashion'),
  ('levis-501', 'Levis 501 Original', 'Jeans Levis 501 Original Fit para hombre', 69990, '/placeholder.svg?height=400&width=400', 'fashion'),
  ('north-face-jacket', 'The North Face Resolve 2', 'Chaqueta impermeable The North Face Resolve 2 para hombre', 89990, '/placeholder.svg?height=400&width=400', 'fashion'),
  ('ray-ban-aviator', 'Ray-Ban Aviator Classic', 'Gafas de sol Ray-Ban Aviator Classic con lentes polarizados', 159990, '/placeholder.svg?height=400&width=400', 'fashion'),
  ('dyson-v11', 'Dyson V11 Absolute', 'Aspiradora inalambrica Dyson V11 Absolute con tecnologia de succion potente', 699990, '/placeholder.svg?height=400&width=400', 'home'),
  ('nespresso-vertuo', 'Nespresso Vertuo Next', 'Cafetera Nespresso Vertuo Next con sistema de capsulas', 149990, '/placeholder.svg?height=400&width=400', 'home'),
  ('kitchenaid-mixer', 'KitchenAid Stand Mixer', 'Batidora de pie KitchenAid Artisan Series 5 Quart', 499990, '/placeholder.svg?height=400&width=400', 'home'),
  ('philips-air-fryer', 'Philips Airfryer XXL', 'Freidora de aire Philips Airfryer XXL con tecnologia Twin TurboStar', 249990, '/placeholder.svg?height=400&width=400', 'home')
ON CONFLICT (id) DO NOTHING;

-- Insert knasta prices
INSERT INTO knasta_prices (product_id, price, url, last_updated)
VALUES
  ('skechers-edgeride', 34990, 'https://knasta.cl/producto/zapatilla-urbana-skechers-edgeride-mujer', NOW()),
  ('blackie-books', 10528, 'https://knasta.cl/producto/blackie-books-blackwater', NOW()),
  ('bic-cristal', 13990, 'https://knasta.cl/producto/lapiz-pasta-negro-bic-cristal', NOW()),
  ('maui-poleron', 15990, 'https://knasta.cl/producto/poleron-surf-maui-and-sons', NOW()),
  ('hp-laserjet', 138500, 'https://knasta.cl/producto/impresora-hp-laserjet-pro', NOW()),
  ('latam-base-cama', 74990, 'https://knasta.cl/producto/base-cama-europea-latam-home', NOW()),
  ('samsung-s23', 799990, 'https://knasta.cl/producto/samsung-galaxy-s23', NOW()),
  ('iphone-14', 1199990, 'https://knasta.cl/producto/iphone-14-pro', NOW()),
  ('macbook-air', 999990, 'https://knasta.cl/producto/macbook-air-m2', NOW()),
  ('sony-wh1000xm5', 299990, 'https://knasta.cl/producto/sony-wh-1000xm5', NOW()),
  ('lg-oled-tv', 799990, 'https://knasta.cl/producto/lg-oled-tv-55', NOW()),
  ('nike-air-max', 99990, 'https://knasta.cl/producto/nike-air-max-90', NOW()),
  ('adidas-ultraboost', 129990, 'https://knasta.cl/producto/adidas-ultraboost-22', NOW()),
  ('levis-501', 59990, 'https://knasta.cl/producto/levis-501-original', NOW()),
  ('north-face-jacket', 79990, 'https://knasta.cl/producto/the-north-face-resolve-2', NOW()),
  ('ray-ban-aviator', 139990, 'https://knasta.cl/producto/ray-ban-aviator-classic', NOW()),
  ('dyson-v11', 599990, 'https://knasta.cl/producto/dyson-v11-absolute', NOW()),
  ('nespresso-vertuo', 129990, 'https://knasta.cl/producto/nespresso-vertuo-next', NOW()),
  ('kitchenaid-mixer', 449990, 'https://knasta.cl/producto/kitchenaid-stand-mixer', NOW()),
  ('philips-air-fryer', 199990, 'https://knasta.cl/producto/philips-airfryer-xxl', NOW())
ON CONFLICT (product_id) DO UPDATE SET
  price = EXCLUDED.price,
  url = EXCLUDED.url,
  last_updated = EXCLUDED.last_updated;

-- Insert product specs
INSERT INTO product_specs (product_id, name, value)
VALUES
  ('skechers-edgeride', 'Tipo', 'Zapatilla Urbana'),
  ('skechers-edgeride', 'Genero', 'Mujer'),
  ('skechers-edgeride', 'Marca', 'Skechers'),
  ('hp-laserjet', 'Marca', 'HP'),
  ('hp-laserjet', 'Modelo', 'LaserJet Pro M404dw'),
  ('hp-laserjet', 'Velocidad', '38ppm'),
  ('hp-laserjet', 'Resolucion', '4800x600dpi'),
  ('latam-base-cama', 'Tamano', '1.5 plazas'),
  ('latam-base-cama', 'Color', 'Rosa'),
  ('latam-base-cama', 'Modelo', 'Zen'),
  ('bic-cristal', 'Marca', 'Bic'),
  ('bic-cristal', 'Color', 'Negro'),
  ('bic-cristal', 'Cantidad', '50 unidades');
