# Guía de Despliegue del Frontend

---

Esta guía describe el despliegue actual del frontend del monorepo.

## 1) Preparación

Requisitos:

- Node.js 22+
- pnpm

Desde la raíz del repositorio:

```bash
pnpm install
```

## 2) Variables de entorno

Variables usadas por el frontend:

| Variable       | Requerida | Descripción                      | Ejemplo                     |
| -------------- | --------- | -------------------------------- | --------------------------- |
| `VITE_API_URL` | Sí        | URL base del backend, sin `/api` | `https://api.midominio.com` |

Notas:

- El cliente construye el prefijo final como `${VITE_API_URL}/api`.
- Si `VITE_API_URL` queda vacía, las peticiones apuntarán a rutas relativas `/api`.

## 3) Build de producción

```bash
pnpm --filter frontend build
```

Salida principal:

- `frontend/build/client/`

Validación local del artefacto:

```bash
pnpm --filter frontend preview
```

## 4) Despliegue en Vercel

Estado actual:

- Existe `frontend/vercel.json` con esquema base.
- No contiene reglas custom (rewrites/headers/routes) por ahora.

Pasos recomendados:

1. Crear proyecto apuntando al directorio `frontend`.
2. Configurar variables de entorno (`VITE_API_URL` y opcionales).
3. Usar comando de build: `pnpm --filter frontend build`.
4. Publicar el output generado por la integración de Vercel para React Router.

## 5) Integración con backend

Checklist operativo:

- Habilitar CORS del backend para el dominio del frontend.
- Mantener HTTPS en producción para cookies seguras de sesión.
