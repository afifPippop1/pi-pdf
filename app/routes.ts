import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/editor", "routes/editor.tsx"),
  route("/workspaces", "routes/workspaces.tsx"),
] satisfies RouteConfig;
