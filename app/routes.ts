import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// export default [
//   index("routes/home.tsx"),
//   route("/editor", "routes/editor.tsx"),
//   route("/workspaces", "routes/workspaces.tsx"),
//   route("/sign-in", "routes/auth/sign-in.tsx"),
// ] satisfies RouteConfig;

export default flatRoutes() satisfies RouteConfig;
