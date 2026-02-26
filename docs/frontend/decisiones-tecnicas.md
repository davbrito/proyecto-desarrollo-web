# Decisiones Técnicas del Frontend

---

Este documento resume decisiones de arquitectura implementadas actualmente en la app.

## Enrutamiento con React Router 7

**Decisión:** usar configuración central de rutas en `frontend/src/routes.ts` con layouts anidados para separar áreas públicas y privadas.

**Motivación:**

- Estructura explícita del flujo de navegación.
- Reutilización de layouts por contexto (auth vs zona privada).
- Mejor mantenimiento al crecer módulos funcionales.

## Cliente HTTP con ky y prefijo de API

**Decisión:** centralizar llamadas HTTP en `frontend/src/lib/api.ts` usando `ky.create`.

**Motivación:**

- Un único punto para `credentials: include`, headers y manejo de errores.
- Prefijo de API consistente con `API_PREFIX = ${VITE_API_URL}/api`.

## Sesión y autenticación

**Decisión:** modelo híbrido con access token en memoria y refresh token en cookie httpOnly.

Implementación en `frontend/src/lib/auth.ts` y `frontend/src/lib/api.ts`:

- Access token vive en estado de cliente (no persistido).
- Metadatos de usuario sí se persisten (`zustand/persist`).
- Ante `401`, el cliente intenta `POST auth/refresh` y reintenta la solicitud original.

**Motivación:** reducir exposición de tokens frente a XSS y mantener UX de sesión continua.

## Estado remoto con TanStack Query

**Decisión:** usar TanStack Query para datos de servidor y cacheado.

**Motivación:**

- Control robusto de estados `loading/error/success`.
- Invalidación y refetch predecibles.
- Menor lógica manual de sincronización en componentes.

## Estado local/global con Zustand

**Decisión:** usar Zustand para estado de sesión y utilidades globales ligeras.

**Motivación:**

- Menos boilerplate que Redux.
- API simple y mantenible para dominios acotados.

## Contrato de tipos compartido

**Decisión:** consumir esquemas y tipos desde `@uneg-lab/api-types`.

**Motivación:**

- Contrato frontend-backend único.
- Validación alineada con backend (Zod).
- Detección temprana de cambios incompatibles en build/typecheck.

## Formularios y validación

**Decisión:** React Hook Form + `zodResolver`.

**Motivación:**

- Facilidad en el manejo de formularios.
- Mensajes de validación tipados y consistentes con el schema.

## Interfaz de Usuario con shadcn/ui y Tailwind CSS

**Decisión:** adoptar `shadcn/ui` junto con `Tailwind CSS 4` para la construcción de la interfaz.

**Motivación:**

- **Agilidad en el desarrollo:** Permite integrar componentes complejos (diálogos, tablas, calendari rápidamente sin sacrificar la personalización.
- **Control Total:** A diferencia de las librerías de componentes tradicionales, `shadcn` copia el código fuente al proyecto, facilitando modificaciones específicas sin lidiar con abstracciones de terceros.
- **Accesibilidad:** Los componentes están basados en **Radix UI**, garantizando el cumplimiento de estándares de accesibilidad (WAI-ARIA).
- **Consistencia:** Tailwind asegura un sistema de diseño coherente basado en utilidades y variables CSS compartidas.
