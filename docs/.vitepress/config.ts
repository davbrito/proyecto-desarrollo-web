import { defineConfig } from "vitepress";

const githubUrl = process.env.VERCEL
  ? `https://github.com/${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
  : "#";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Sistema Laboratorio UNEG",
  description: "Gestión de Reservas de Laboratorios",

  srcDir: ".",
  themeConfig: {
    nav: [
      { text: "Inicio", link: "/" },
      { text: "Frontend", link: "/frontend/" },
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
    },

    socialLinks: [{ icon: "github", link: githubUrl }],
  },
});
