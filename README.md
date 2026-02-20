# EcoCupon - Cupones y Ofertas

Plataforma de cupones y ofertas de e-commerce que permite a los usuarios encontrar productos con descuento comparando precios en tiempo real.

## 🚀 Tecnologías

- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Supabase** - Backend como servicio (PostgreSQL, Auth, Storage)
- **shadcn/ui** - Componentes de UI basados en Radix UI
- **Tailwind CSS** - Estilos utilitarios
- **Vercel** - Plataforma de deployment

## 📋 Requisitos Previos

- Node.js 20.x, 22.x o 24.x
- pnpm (recomendado) o npm
- Cuenta en Supabase

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd ecocanasta.ecocupon.cl
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus credenciales de Supabase:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:

```env
# Supabase (públicas - se exponen al cliente)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Supabase (privadas - solo servidor)
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
SUPABASE_JWT_SECRET=tu-jwt-secret
```

### 4. Configurar base de datos en Supabase

Ejecuta el siguiente SQL en el editor de SQL de Supabase para crear las tablas:

```sql
-- Tabla de categorías
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT,
  description TEXT,
  category_id BIGINT REFERENCES categories(id),
  shop TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de precios de Knasta
CREATE TABLE knasta_prices (
  id BIGSERIAL PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  url TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id)
);

-- Tabla de perfiles de usuario
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT DEFAULT 'user',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de especificaciones de productos
CREATE TABLE product_specs (
  id BIGSERIAL PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE knasta_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specs ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para categorías y productos
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON knasta_prices FOR SELECT USING (true);
CREATE POLICY "Public read access" ON product_specs FOR SELECT USING (true);

-- Política para perfiles (cada usuario ve su propio perfil)
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- Trigger para crear perfil automáticamente al registrar usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5. Iniciar servidor de desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
.
├── app/                      # App Router (Next.js 15)
│   ├── admin/                # Panel de administración
│   ├── auth/                 # Autenticación (login, sign-up, callback)
│   ├── category/[slug]/      # Páginas de categoría
│   ├── product/[id]/         # Detalle de producto
│   ├── globals.css           # Estilos globales
│   ├── layout.tsx            # Layout root
│   ├── page.tsx              # Página de inicio
│   ├── sitemap.ts            # Generador de sitemap
│   └── robots.ts             # Generador de robots.txt
├── components/
│   ├── admin/                # Componentes del panel admin
│   ├── ui/                   # Componentes shadcn/ui
│   ├── site-header.tsx       # Header del sitio
│   ├── site-footer.tsx       # Footer del sitio
│   └── product-coupon.tsx    # Componente de cupón
├── hooks/                    # Custom React hooks
├── lib/
│   ├── supabase/             # Clientes de Supabase (client, server, middleware)
│   ├── database.types.ts     # Tipos de TypeScript generados
│   └── utils.ts              # Utilidades
├── public/                   # Archivos estáticos
├── .env.example              # Variables de entorno de ejemplo
├── next.config.mjs           # Configuración de Next.js
├── tailwind.config.ts        # Configuración de Tailwind
└── tsconfig.json             # Configuración de TypeScript
```

## 🎯 Características

- ✅ Catálogo de productos con comparación de precios
- ✅ Sistema de cupones con códigos promocionales
- ✅ Compartir ofertas por WhatsApp
- ✅ Panel de administración para gestionar productos y categorías
- ✅ Autenticación de usuarios con Supabase Auth
- ✅ SEO optimizado con sitemap y robots.txt dinámicos
- ✅ Diseño responsive mobile-first
- ✅ Tema oscuro/claro

## 📝 Scripts Disponibles

```bash
pnpm dev          # Iniciar servidor de desarrollo
pnpm build        # Compilar para producción
pnpm start        # Iniciar servidor de producción
pnpm lint         # Ejecutar linter
```

## 🔐 Variables de Entorno

| Variable | Descripción | Tipo |
|----------|-------------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | Pública |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase | Pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo servidor) | Privada |
| `SUPABASE_JWT_SECRET` | Secreto JWT para autenticación | Privada |

## 🚀 Deployment en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Deploy automático en cada push a la rama principal

## 📄 Políticas

- [Política de Dependencias](./DEPENDENCY_POLICY.md)
- [Política de Seguridad](./SECURITY.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Soporte

Para soporte, abre un issue en el repositorio o contacta al equipo de desarrollo.
