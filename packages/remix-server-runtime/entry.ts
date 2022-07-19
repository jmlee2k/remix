import type {
  DataRouteMatch,
  DataRouteObject,
  Location,
} from "@remix-run/router";

import type { AppState } from "./errors";
import type {
  RouteManifest,
  ServerRouteManifest,
  EntryRoute,
  ServerRoute,
} from "./routes";
import type { RouteData } from "./routeData";
import type { RouteMatch } from "./routeMatching";
import type { RouteModules, EntryRouteModule } from "./routeModules";

export interface EntryContext {
  appState: AppState;
  manifest: AssetsManifest;
  routeData: RouteData;
  actionData?: RouteData;
  routeModules: RouteModules<EntryRouteModule>;
  serverHandoffString?: string;

  // New fields for data router
  // TODO: Can we clean this up a bit when we do the real RRR work
  dataRoutes: DataRouteObject[];
  dataLocation: Location;
  dataMatches: DataRouteMatch[];
  dataErrors?: RouteData;
}

export interface AssetsManifest {
  entry: {
    imports: string[];
    module: string;
  };
  routes: RouteManifest<EntryRoute>;
  url: string;
  version: string;
}

export function createEntryMatches(
  matches: RouteMatch<ServerRoute>[],
  routes: RouteManifest<EntryRoute>
): RouteMatch<EntryRoute>[] {
  return matches.map((match) => ({
    params: match.params,
    pathname: match.pathname,
    route: routes[match.route.id],
  }));
}

export function createEntryRouteModules(
  manifest: ServerRouteManifest
): RouteModules<EntryRouteModule> {
  return Object.keys(manifest).reduce((memo, routeId) => {
    memo[routeId] = manifest[routeId].module;
    return memo;
  }, {} as RouteModules<EntryRouteModule>);
}
