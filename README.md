# Panel Administrativo de E-Commerce (Inventario)

Dashboard para gestionar el catálogo de productos de una tienda en línea: autenticación simulada, inventario con CRUD completo y confirmaciones con SweetAlert2.

## Descripción funcional

- **Login** (`/login`): ingreso con nombre de usuario y PIN (simulación; cualquier PIN válido). La sesión se guarda en `localStorage`.
- **Rutas protegidas**: sin sesión activa no se accede al panel; redirección automática a login.
- **Inventario** (`/productos`): grid de tarjetas con búsqueda por nombre o categoría.
- **Crear producto** (`/productos/nuevo`): formulario con validación (precio y stock ≥ 0).
- **Editar producto** (`/productos/:id/editar`): actualización de datos vía PUT.
- **Eliminar**: confirmación obligatoria con SweetAlert2 y alerta de éxito al completar.

## Stack tecnológico

| Tecnología | Uso |
|------------|-----|
| React 19 + Vite | Framework y bundler |
| react-router-dom | Enrutamiento y rutas protegidas |
| Hooks (`useState`, `useEffect`) | Estado y ciclo de vida |
| SweetAlert2 | Confirmaciones y alertas |
| Tailwind CSS v4 | Estilos responsivos |
| LocalStorage | Sesión simulada |
| JSON Server | API REST local (`db.json`) |
| Git / GitHub | Control de versiones |

## API (JSON Server)

**Desarrollo local:** `http://localhost:3010/productos` (puertos exclusivos de este proyecto, sin compartir con otros)

Recurso `productos` con campos: `id`, `nombre`, `precio`, `categoria`, `stock`, `imagen`.

Datos iniciales en [`db.json`](./db.json).

### Alternativa: MockAPI (producción / deploy)

Para desplegar el frontend en Vercel/Netlify necesitas una API pública:

1. Crea un proyecto en [mockapi.io](https://mockapi.io).
2. Crea el recurso `productos` con los mismos campos.
3. Importa los datos de `db.json` o créalos manualmente.
4. Copia `.env.example` a `.env` y define:

```env
VITE_API_URL=https://TU_PROYECTO.mockapi.io/productos
```

5. En Vercel/Netlify, agrega la misma variable de entorno `VITE_API_URL`.

## Estructura del proyecto

```
src/
├── components/     # ProductCard, Navbar, ProductForm, ProtectedRoute...
├── layouts/        # DashboardLayout
├── pages/          # Login, Products, New, Edit
└── services/       # api.js, auth.js
```

## Requisitos previos

- Node.js 18+
- npm 9+

## Instalación y ejecución

```bash
git clone https://github.com/TU_USUARIO/ema.prubatecnica.git
cd ema.prubatecnica
npm install
npm run dev
```

Esto levanta **JSON Server** (puerto **3010**) y **Vite** (puerto **5180**) en paralelo. No usa 3001 ni 5173 para evitar choques con otros proyectos en tu PC.

Abre [http://localhost:5180/login](http://localhost:5180/login).

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | API + frontend en desarrollo |
| `npm run api` | Solo JSON Server |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build |

## Flujo de ramas (Git)

| Rama | Propósito |
|------|-----------|
| `main` | Código listo para producción |
| `develop` | Integración de features |
| `feature/*` | Desarrollo por funcionalidad |

Ejemplos de ramas usadas en este repo:

- `feature/auth-system`
- `feature/api-integration`
- `feature/product-inventory`
- `feature/product-forms`

Convención de commits: `feat:`, `fix:`, `style:`, `docs:`.

## Despliegue

### Frontend (Vercel recomendado)

1. Conecta el repositorio en [vercel.com](https://vercel.com).
2. Framework preset: **Vite**.
3. Variable de entorno: `VITE_API_URL` apuntando a tu MockAPI.
4. El archivo `vercel.json` ya configura el fallback SPA.

### Enlaces de entrega (completar al publicar)

- **Repositorio:** `https://github.com/TU_USUARIO/ema.prubatecnica`
- **App desplegada:** `https://TU_APP.vercel.app`

## Autor

Prueba técnica — Desarrollador Frontend Junior.
