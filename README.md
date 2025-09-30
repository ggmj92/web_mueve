# Mueve Gallery — Guía del Proyecto

## Descripción general

Mueve Gallery es un sitio construido con Next.js 15 (en modo App Router) que presenta la colección de la galería con una experiencia inmersiva. Todas las rutas comparten un `RootLayout` que fija el encabezado y el pie de página, aplica la tipografía Work Sans y sincroniza la temática visual mediante el componente `RouteTheme`. El contenido editorial proviene de Sanity CMS y se consulta en tiempo de renderizado, lo que permite que la página de inicio, las fichas de artistas y el visor de obras muestren datos actualizados sin pasos manuales adicionales.

## Arquitectura del repositorio

- **`src/app`** – Árbol de rutas. Incluye la página de inicio, `/about`, el índice y detalle de artistas (`/artists`, `/artists/[slug]`, `/artists/[slug]/work/[artId]`), además del Sanity Studio embebido en `/studio`.
- **`src/components`** – Componentes cliente como la navegación, los carruseles de portada y artistas, y el visor modal de obras.
- **`src/sanity`** – Configuración del CMS (clientes reutilizables, utilidades de Live Content, generador de URLs de imágenes y esquemas de documentos para slides, artistas, obras, exposiciones y la página About).
- **`public`** – Activos estáticos, incluida la imaginería por defecto y recursos compartidos.
- **Archivos de configuración** – `next.config.mjs`, `sanity.config.js`, `eslint.config.mjs`, `package.json` y otros archivos que controlan el build, linting e integración con Sanity.

## Páginas y flujo de datos clave

- **Página de inicio** (`src/app/page.js`): Consulta los slides principales en Sanity, respeta la duración por slide y renderiza `HeroCarousel` con capas de fondo en fade.
- **Índice de artistas** (`src/app/artists/page.js`): Obtiene slugs y nombres, alinea la lista con la cuadrícula global y deshabilita la revalidación para ver cambios en desarrollo.
- **Detalle de artista** (`src/app/artists/[slug]/page.js`): Une el registro del artista con sus obras relacionadas, normaliza metadatos para `ArtistCarousel` y muestra biografía y un grid de tarjetas de obra.
- **Detalle de obra** (`src/app/artists/[slug]/work/[artId]/page.js`): Reutiliza la consulta de artista, calcula el índice inicial de la obra y monta `ArtworkViewer`, que sincroniza la URL, fija la columna de metadatos y expone navegación manual.
- **Página About** (`src/app/about/page.js`): Ofrece contenido bilingüe con tipografía personalizada que simula una columna editorial.
- **Sanity Studio** (`src/app/studio/[[...tool]]/page.js`): Monta la interfaz de edición directamente dentro del proyecto Next.js.

## Estilos y experiencia de usuario

- Las variables globales en `src/app/globals.css` definen espaciados, anchos de columna y tokens de color; `RouteTheme` alterna clases en el `<body>` como `is-home` para recolorear la navegación por ruta.
- `layout.module.css` mantiene el encabezado y el pie fijos y aplica el espaciado base. Los módulos CSS específicos (transiciones del hero, carruseles a pantalla completa, grillas con metadatos fijos) refinan cada experiencia.

## Gestión de contenido

- `sanity.config.js` configura el Studio, agrega Structure Builder y habilita Vision.
- Los esquemas en `src/sanity/schemaTypes` describen slides, artistas, obras, exposiciones y el contenido de About.
- `src/sanity/env.js` centraliza `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` y `NEXT_PUBLIC_SANITY_API_VERSION`, con valores por defecto para comenzar rápido.

## Herramientas y scripts

- **Scripts npm** (`package.json`):
  - `npm run dev` – Inicia el servidor de desarrollo con Turbopack.
  - `npm run build` – Genera el build de producción.
  - `npm run start` – Levanta el servidor de producción.
  - `npm run lint` – Ejecuta ESLint sobre `.js`, `.jsx` y módulos CSS.
  - `npm run format` – Aplica Prettier a todo el repositorio.
- **Calidad de código** – Husky y lint-staged formatean y lintéan archivos automáticamente antes de cada commit.

## Prerrequisitos

1. Node.js 20 o superior y npm 10 (o pnpm/yarn/bun si lo prefieres).
2. Acceso al proyecto de Sanity con credenciales válidas.
3. Variables de entorno opcionales si necesitas sobreescribir los valores por defecto:
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID="<tu-project-id>"
   NEXT_PUBLIC_SANITY_DATASET="production"
   NEXT_PUBLIC_SANITY_API_VERSION="2025-01-01"
   ```

## Puesta en marcha (paso a paso)

1. **Clonar el repositorio**:
   ```bash
   git clone git@github.com:<tu-usuario>/<tu-repo>.git
   cd <tu-repo>
   ```
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Configurar variables de entorno** (opcional si usas los valores por defecto). Crea `.env.local` y define las variables anteriores si necesitas personalizarlas.
4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   El sitio quedará disponible en [http://localhost:3000](http://localhost:3000).
5. **Ejecutar checks** antes de abrir un PR o entregar trabajo:
   ```bash
   npm run lint
   ```
6. **Build de producción** (para validar antes de desplegar):
   ```bash
   npm run build
   npm run start
   ```

## Flujo de trabajo recomendado

1. **Sincroniza la rama principal**: `git checkout main && git pull origin main`.
2. **Crea una rama descriptiva** para tu trabajo: `git checkout -b feature/<nombre>`.
3. **Construye funcionalidades** siguiendo los patrones existentes (componentes reutilizables, módulos CSS, consultas a Sanity).
4. **Ejecuta `npm run lint`** y resuelve los issues.
5. **Haz commits frecuentes** con mensajes claros (p. ej. `git commit -m "feat: agregar carrusel de ferias"`).
6. **Actualiza la documentación** (incluido este README) cada vez que agregues rutas, esquemas o scripts nuevos.
7. **Sube tu rama** (`git push origin feature/<nombre>`) y abre un Pull Request.
8. **Solicita revisiones** y atiende el feedback antes de fusionar.

## Próximos pasos sugeridos

- Implementar las rutas pendientes (`/ferias`, `/exposiciones`, `/publicaciones`) y sus esquemas en Sanity.
- Integrar `sanityFetch`/`SanityLive` para obtener previsualizaciones en vivo.
- Afinar la experiencia responsive de los carruseles y el visor de obras en dispositivos móviles.
