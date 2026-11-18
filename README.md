# UnaHur Anti-Social Net — FrontEnd

Trabajo Práctico 2 de **Construcción de Interfaces de Usuario** (UNAHUR). Aplicación web de una red social donde se pueden ver publicaciones, comentarlas, registrarse, iniciar sesión y publicar contenido propio con etiquetas e imágenes.

## Funcionalidades

- **Login simulado:** se valida el nickName contra la API y la contraseña fija `123456`. El usuario queda en un contexto global (`useContext`) y en `localStorage`, así la sesión sobrevive al recargar.
- **Registro:** formulario con validación de campos y muestra el mensaje de error que devuelve el servidor (por ejemplo, nickName repetido).
- **Home:** feed de publicaciones recientes con descripción, imágenes, etiquetas y cantidad de comentarios. Incluye filtro por etiquetas y un panel de posts destacados (los más comentados).
- **Detalle de publicación (`/post/:id`):** descripción completa, imágenes, etiquetas, comentarios y formulario para comentar.
- **Perfil (protegido):** datos del usuario, sus publicaciones y botón de cerrar sesión.
- **Crear publicación (protegido):** descripción obligatoria, etiquetas, una o más imágenes por URL (con vista previa) y validaciones.
- **Rutas protegidas:** `/perfil` y `/crear-post` solo se pueden ver con sesión iniciada.
- **Extras de diseño:** modo claro y oscuro, avatar automático, imágenes con respaldo si no cargan y diseño responsive.

## Tecnologías

- React 19 + TypeScript (Vite)
- react-router-dom v7 (rutas y rutas protegidas)
- React Bootstrap + Bootstrap 5 + React Bootstrap Icons
- Context API (sesión) y `fetch` para consumir la API

## API utilizada

Se usa la API provista por la cátedra: <https://github.com/lucasfigarola/backend-api> (Node + Express + Sequelize + SQLite).

- **URL base:** `http://localhost:3001`
- Está definida en una sola constante, `API_URL`, en `src/api/api.ts`.

Particularidades de la API que se tuvieron en cuenta:

- `POST /users` exige también `email`, por eso el registro lo pide.
- `POST /posts` recibe `tagIds` (arreglo de ids de etiquetas).
- `GET /posts` no trae imágenes ni comentarios: se piden aparte por publicación (`/postimages/post/:id` y `/comments/post/:id`).

## Cómo correrlo en local

Requisitos: **Node.js 20.19 o superior** y Git.

### 1. Levantar la API

```bash
git clone https://github.com/lucasfigarola/backend-api
cd backend-api
npm install
node seed.js     # carga usuarios, etiquetas, publicaciones y comentarios de ejemplo
npm start        # queda en http://localhost:3001
```

### 2. Levantar el FrontEnd (en otra terminal)

```bash
git clone https://github.com/Tizi01-source/antisocial-front
cd antisocial-front
npm install
npm run dev      # abrir http://localhost:5173
```

### Usuarios de prueba

Con los datos del `seed.js`: `luna` o `sol`, contraseña `123456`. También se puede crear un usuario nuevo desde **Registro**.

### Otros comandos

```bash
npm run build    # compila TypeScript y genera la versión de producción
npm run lint     # revisa el código con ESLint
```

## Rutas

| Ruta | Descripción | Acceso |
| --- | --- | --- |
| `/` | Home: feed, filtro por tags y destacados | Público |
| `/login` | Inicio de sesión | Público |
| `/register` | Registro | Público |
| `/post/:id` | Detalle y comentarios | Público (para comentar hay que iniciar sesión) |
| `/perfil` | Perfil y publicaciones propias | Protegido |
| `/crear-post` | Crear publicación | Protegido |

## Estructura del proyecto

```text
src/
├── api/          # funciones que consumen la API (fetch)
├── components/   # componentes reutilizables (PostCard, Avatar, Logo, TagFilter...)
├── context/      # AuthContext: usuario logueado y localStorage
├── hooks/        # useTheme: modo claro/oscuro
├── layout/       # Layout con la barra de navegación
├── pages/        # una página por ruta
├── types/        # tipos de TypeScript (User, Post, Tag...)
└── utils/        # funciones auxiliares
```

## Datos del alumno

- **Nombre:** Tiziano Costantini Marquez
- **Carrera:** Licenciatura en Informática — Universidad Nacional de Hurlingham (UNAHUR)
- **Materia:** Construcción de Interfaces de Usuario — TP2 (2026)
- **Comisión:** 1
- **GitHub:** [Tizi01-source](https://github.com/Tizi01-source)