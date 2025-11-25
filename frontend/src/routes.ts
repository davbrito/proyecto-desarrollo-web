import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  route("login", "./routes/login.tsx"),
  route("register", "./routes/register.tsx"),

  layout("./routes/private/layout.tsx", [index("./routes/private/index.tsx")]),
] satisfies RouteConfig;
