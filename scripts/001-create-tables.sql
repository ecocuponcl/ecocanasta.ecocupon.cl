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

-- Create product specs table
CREATE TABLE IF NOT EXISTS product_specs (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  spec_name TEXT NOT NULL,
  spec_value TEXT NOT NULL
);

-- Create knasta_prices table (comparison prices)
CREATE TABLE IF NOT EXISTS knasta_prices (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  url TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE knasta_prices ENABLE ROW LEVEL SECURITY;

-- Public read policies (everyone can read)
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Anyone can read product_specs" ON product_specs FOR SELECT USING (true);
CREATE POLICY "Anyone can read knasta_prices" ON knasta_prices FOR SELECT USING (true);

-- Authenticated write policies
CREATE POLICY "Authenticated users can insert categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update categories" ON categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete categories" ON categories FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert products" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update products" ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete products" ON products FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert product_specs" ON product_specs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update product_specs" ON product_specs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete product_specs" ON product_specs FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert knasta_prices" ON knasta_prices FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update knasta_prices" ON knasta_prices FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete knasta_prices" ON knasta_prices FOR DELETE TO authenticated USING (true);

-- Seed categories
INSERT INTO categories (id, name, slug, description, image) VALUES
  ('technology', 'Tecnologia', 'technology', 'Productos tecnologicos y electronicos', '/placeholder.svg?height=400&width=600'),
  ('fashion', 'Moda', 'fashion', 'Ropa, calzado y accesorios', '/placeholder.svg?height=400&width=600'),
  ('home', 'Hogar', 'home', 'Productos para el hogar y decoracion', '/placeholder.svg?height=400&width=600'),
  ('books', 'Libros', 'books', 'Libros y material de lectura', '/placeholder.svg?height=400&width=600'),
  ('office', 'Oficina', 'office', 'Articulos de oficina y papeleria', '/placeholder.svg?height=400&width=600')
ON CONFLICT (id) DO NOTHING;

-- Seed products
INSERT INTO products (id, name, description, price, image, category_id) VALUES
  ('skechers-edgeride', 'Zapatilla Urbana Skechers Edgeride Mujer', 'Zapatillas urbanas comodas y ligeras para uso diario.', 39990, '/placeholder.svg?height=400&width=400', 'fashion'),
  ('blackie-books', 'Blackie Books - Blackwater', 'Libro Blackie Books - Blackwater / Parte V: La Fortuna', 12836, '/placeholder.svg?height=400&width=400', 'books'),
  ('bic-cristal', 'Lapiz Pasta Negro Bic Cristal', 'Lapiz Pasta Negro Bic Cristal Punta Media 50 Unidades', 22990, '/placeholder.svg?height=400&width=400', 'office'),
  ('maui-poleron', 'Poleron Surf Maui And Sons', 'Poleron Surf And Skate Company Crew Azul Maui And Sons', 19590, '/placeholder.svg?height=400&width=400', 'fashion'),
  ('hp-laserjet', 'Impresora HP LaserJet Pro', 'Impresora HP LaserJet Pro M404dw, 38ppm, 4800x600dpi', 198400, '/placeholder.svg?height=400&width=400', 'technology'),
  ('latam-base-cama', 'Base cama europea Latam Home', 'Base cama europea 1.5 plazas Zen rosa', 116990, '/placeholder.svg?height=400&width=400', 'home'),
  ('samsung-s23', 'Samsung Galaxy S23', 'Smartphone Samsung Galaxy S23 con 8GB RAM y 256GB almacenamiento', 899990, '/placeholder.svg?height=400&width=400', 'technology'),
  ('macbook-air', 'MacBook Air M2', 'Laptop Apple MacBook Air con chip M2, 8GB RAM y 256GB SSD', 1099990, '/placeholder.svg?height=400&width=400', 'technology'),
  ('sony-wh1000xm5', 'Sony WH-1000XM5', 'Audifonos inalambricos con cancelacion de ruido Sony WH-1000XM5', 349990, '/placeholder.svg?height=400&width=400', 'technology'),
  ('nike-air-max', 'Nike Air Max 90', 'Zapatillas Nike Air Max 90 para hombre, diseno clasico y comodo', 129990, '/placeholder.svg?height=400&width=400', 'fashion'),
  ('dyson-v11', 'Dyson V11 Absolute', 'Aspiradora inalambrica Dyson V11 Absolute con tecnologia de succion potente', 699990, '/placeholder.svg?height=400&width=400', 'home'),
  ('nespresso-vertuo', 'Nespresso Vertuo Next', 'Cafetera Nespresso Vertuo Next con sistema de capsulas', 149990, '/placeholder.svg?height=400&width=400', 'home')
ON CONFLICT (id) DO NOTHING;

-- Seed knasta_prices (comparison prices)
INSERT INTO knasta_prices (product_id, price, url) VALUES
  ('skechers-edgeride', 34990, 'https://knasta.cl/producto/zapatilla-urbana-skechers-edgeride-mujer'),
  ('blackie-books', 10528, 'https://knasta.cl/producto/blackie-books-blackwater'),
  ('bic-cristal', 13990, 'https://knasta.cl/producto/lapiz-pasta-negro-bic-cristal'),
  ('maui-poleron', 15990, 'https://knasta.cl/producto/poleron-surf-maui-and-sons'),
  ('hp-laserjet', 138500, 'https://knasta.cl/producto/impresora-hp-laserjet-pro'),
  ('latam-base-cama', 74990, 'https://knasta.cl/producto/base-cama-europea-latam-home'),
  ('samsung-s23', 799990, 'https://knasta.cl/producto/samsung-galaxy-s23'),
  ('macbook-air', 999990, 'https://knasta.cl/producto/macbook-air-m2'),
  ('sony-wh1000xm5', 299990, 'https://knasta.cl/producto/sony-wh-1000xm5'),
  ('nike-air-max', 99990, 'https://knasta.cl/producto/nike-air-max-90'),
  ('dyson-v11', 599990, 'https://knasta.cl/producto/dyson-v11-absolute'),
  ('nespresso-vertuo', 129990, 'https://knasta.cl/producto/nespresso-vertuo-next')
ON CONFLICT (product_id) DO NOTHING;

-- Seed product specs
INSERT INTO product_specs (product_id, spec_name, spec_value) VALUES
  ('hp-laserjet', 'Marca', 'HP'),
  ('hp-laserjet', 'Modelo', 'LaserJet Pro M404dw'),
  ('hp-laserjet', 'Velocidad', '38ppm'),
  ('hp-laserjet', 'Resolucion', '4800x600dpi'),
  ('samsung-s23', 'Pantalla', '6.1 pulgadas AMOLED'),
  ('samsung-s23', 'RAM', '8GB'),
  ('samsung-s23', 'Almacenamiento', '256GB'),
  ('macbook-air', 'Chip', 'Apple M2'),
  ('macbook-air', 'RAM', '8GB'),
  ('macbook-air', 'SSD', '256GB'),
  ('sony-wh1000xm5', 'Tipo', 'Over-ear'),
  ('sony-wh1000xm5', 'Cancelacion de ruido', 'Si');
