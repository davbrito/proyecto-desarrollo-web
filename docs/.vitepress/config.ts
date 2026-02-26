import { defineConfig } from "vitepress";

const githubUrl = process.env.GITHUB_REPOSITORY
  ? `https://github.com/${process.env.GITHUB_REPOSITORY}`
  : "#";

const vitepressBase = process.env.VITEPRESS_BASE ?? "/";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Sistema Laboratorio UNEG",
  description: "Gestión de Reservas de Laboratorios",
  base: vitepressBase,

  srcDir: ".",
  themeConfig: {
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "Buscar",
            buttonAriaLabel: "Buscar",
          },
          modal: {
            noResultsText: "No se encontraron resultados",
            resetButtonTitle: "Limpiar búsqueda",
            backButtonTitle: "Cerrar búsqueda",
            displayDetails: "Mostrar detalles",
            footer: {
              navigateText: "Navegar",
              selectText: "Seleccionar",
              closeText: "Cerrar",
            },
          },
        },
      },
    },
    nav: [
      { text: "Inicio", link: "/" },
      { text: "Frontend", link: "/frontend/" },
      { text: "Backend", link: "/backend/" },
    ],

    sidebar: {
      "/frontend/": [
        {
          text: "Frontend",
          items: [
            { text: "Inicio", link: "/frontend/" },
            {
              text: "Decisiones técnicas",
              link: "/frontend/decisiones-tecnicas",
            },
            { text: "Despliegue", link: "/frontend/despliegue" },
          ],
        },
      ],
      "/backend/": [
        {
          text: "Backend",
          items: [
            { text: "Inicio", link: "/backend/" },
            { text: "Architectura", link: "/backend/arquitectura" },
            {
              text: "Decisiones técnicas",
              link: "/backend/decisiones-tecnicas",
            },
            { text: "Despliegue", link: "/backend/despliegue" },
            { text: "API Reference", link: "/backend/api" },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: githubUrl }],
  },
});
