. # Sistema de Gestión de Horarios de Laboratorios — Villa Asia

**Descripción corta:**
Sistema web full‑stack para consultar y reservar espacios de laboratorio en la sede Villa Asia. Frontend en **React + TypeScript** y backend en **NestJS + TypeORM** con PostgreSQL.

---

## 🚀 Rápido inicio

### Requisitos

- Node.js >= 22
- pnpm
- PostgreSQL (u otro proveedor compatible con la URL de conexión)

### Instalación

```bash
git clone https://github.com/<TU-USUARIO>/proyecto-desarrollo-web.git
cd proyecto-desarrollo-web
pnpm install
```

### Variables de entorno

Copia y completa el ejemplo de variables del backend:

```bash
cp backend/.env.example backend/.env
```

Variables importantes:

- `DATABASE_URL` — URL de conexión a PostgreSQL
- `ACCESS_TOKEN_SECRET` — secreto para firmar JWT

---

## 🧩 Estructura y stack

- Monorepo con **pnpm workspaces**
- Frontend: React 19, TypeScript, React Router, Vite, Tailwind
- Backend: NestJS, TypeORM, PostgreSQL, JWT, Argon2
- Tests: Vitest (frontend), Jest (backend)

---

## � Documentación Directa

Para entender la arquitectura y flujo del proyecto, consulta:

- **Frontend:** [Guía de Inicio](./docs/frontend/README.md) | [Decisiones Técnicas](./docs/frontend/decisiones-tecnicas.md) | [Guía de Despliegue](./docs/frontend/despliegue.md)
- **Backend:** (En construcción en `backend/README.md`)

---

## �🛠️ Desarrollo

Ejecuta en terminales separados:


- Frontend (dev):

```bash
pnpm dev:frontend
# o
pnpm --filter frontend dev
```

- Backend (dev - NestJS):

```bash
pnpm dev:backend
# o
pnpm --filter backend start:dev
```

- URLs por defecto:
  - Frontend: `http://localhost:5173`
  - Backend: `http://localhost:3000`

---

## 🗄️ Migraciones y seed

- Ejecutar migraciones:

```bash
pnpm --filter backend migration:run
```

- Generar migración:

```bash
pnpm --filter backend migration:generate -- <nombre>
```

- Revertir migración:

```bash
pnpm --filter backend migration:revert
```

- Cargar datos de prueba (seed):

```bash
pnpm --filter backend seed
```

> Asegúrate de tener `DATABASE_URL` configurada en `backend/.env` antes de ejecutar migraciones o el seed.

---

## ✅ Tests, lint y build

- Backend:

```bash
pnpm --filter backend test
pnpm --filter backend test:e2e
```

- Frontend:

```bash
pnpm --filter frontend test
```

- Lint & format:

```bash
pnpm --filter backend lint
pnpm --filter frontend lint
pnpm --filter backend format
```

- Build producción:

```bash
pnpm --filter frontend build
pnpm --filter backend build
```

---

## ☁️ Despliegue

Incluye configuraciones para **Vercel**. Ajusta variables de entorno (DATABASE_URL, ACCESS_TOKEN_SECRET, etc.) en la plataforma de despliegue.

---

## 🤝 Contribuir

- Abre un issue para discutir cambios grandes.
- Envía PRs pequeñas y revisables; incluye pruebas cuando sea posible.

## 📄 Licencia

**MIT**
