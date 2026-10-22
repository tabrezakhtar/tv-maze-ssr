import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("shows/:showId", "routes/show-details.tsx"),
] satisfies RouteConfig;
