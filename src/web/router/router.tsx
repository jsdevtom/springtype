import { st } from "../../core";
import { customElement } from "../customelement";
import { TAG_NAME } from "../customelement/custom-element-manager";
import { tsx } from "../vdom";
import { ILocationChangeDecision, IRoutes } from "./interface/irouter";
import { RouterOutlet } from "./router-outlet";

export const ROUTE_NOT_FOUND = "*404*";
export const ROUTE_BASE = "";

if (!st.router) {
  customElement("router-no-custom-element-found", () => (
    <div>{`No custom element found for rendering this route. Please specify a route for: ${document.location.hash.replace("#", "")} or: ${ROUTE_NOT_FOUND}`}</div>
  ));

  st.router = {
    TOKENIZED_ROUTES: {},
    ROUTE_MAP: {},
    CURRENT_PARAMS: {},
    CURRENT_PATH: "",
    CURRENT_DECISION: undefined,

    // might be unset until someone puts a <router-outlet>
    ROUTER_OUTLET: undefined,

    setParams: (params: any): void => {
      st.router.CURRENT_PARAMS = params;
    },

    getParams: (): any => {
      return st.router.CURRENT_PARAMS;
    },

    getPath: (): string => {
      return st.router.CURRENT_PATH;
    },

    refresh: () => {
      st.router.ROUTER_OUTLET.refresh();
    },

    registerRoutes: async (routes: IRoutes) => {
      for (let route in routes) {
        st.router.TOKENIZED_ROUTES[route] = st.router.tokenizeRoute(route, true);
      }
      st.router.ROUTE_MAP = {
        ...st.router.ROUTE_MAP,
        ...routes,
      };
    },

    tokenizeRoute: (route: string, registration: boolean = false): Array<string> => {
      const tokenizedRoute = route.split("/");

      if (registration && route[0] === "/") {
        tokenizedRoute[0] = "#";
      }

      if (tokenizedRoute[0] !== "#") {
        tokenizedRoute.unshift("#");
      }
      return tokenizedRoute;
    },

    match: (realRoute: string): ILocationChangeDecision | null => {
      const tokenizedRoute = st.router.tokenizeRoute(realRoute);

      const params: {
        [key: string]: string;
      } = {};

      for (let route in st.router.TOKENIZED_ROUTES) {
        const tokenizedRouteCandidate = st.router.TOKENIZED_ROUTES[route];

        let routeMatches = true;

        for (let i = 0; i < tokenizedRouteCandidate.length; i++) {
          const token = tokenizedRouteCandidate[i];

          if (token.startsWith(":")) {
            params[token.replace(":", "")] = tokenizedRoute[i];
          } else {
            if (token !== tokenizedRoute[i]) {
              routeMatches = false;
              break; // stop looping further, path doesn't match
            }
          }
        }

        if (routeMatches) {
          return {
            params,
            tagName: st.router.ROUTE_MAP[route][TAG_NAME],
            route,
          } as ILocationChangeDecision;
        }
      }

      if (st.router.ROUTE_MAP[ROUTE_NOT_FOUND]) {
        return {
          route: ROUTE_NOT_FOUND,
          tagName: st.router.ROUTE_MAP[ROUTE_NOT_FOUND][TAG_NAME],
          params: params,
        } as ILocationChangeDecision;
      } else {
        return {
          route: ROUTE_NOT_FOUND,
          tagName: "router-no-custom-element-found",
          params: {},
        } as ILocationChangeDecision;
      }
    },

    decideOnLocationChange: async (hash: string): Promise<void> => {
      const decision = (st.router.CURRENT_DECISION = st.router.match(hash));

      if (decision) {
        // set active route params
        st.router.setParams(decision.params);

        let isAllowedToPresent = true;

        if (decision.guard && typeof decision.guard == "function") {
          isAllowedToPresent = await decision.guard(decision);
        }

        if (isAllowedToPresent) {
          if (!st.router.ROUTER_OUTLET) {
            st.warn("No <router-outlet> was found. Please call: st.dom.setRoot('router-outlet') somewhere.");
          }
          st.router.ROUTER_OUTLET.present(decision);
        }
      } else {
        throw new Error(`No route registered for hash url: '${hash}'. Add this route to an @WebModule({ route: { ... } })!`);
      }
    },

    disable: (): void => {
      // numb callback
      window.onpopstate = () => {};
    },

    onLocationChange: async (): Promise<void> => {
      await st.router.decideOnLocationChange(window.location.hash);
    },

    enable: async (): Promise<void> => {
      // register callback
      window.onpopstate = async () => {
        await st.router.onLocationChange();
      };

      await st.router.onLocationChange();
    },

    registerRouterOutlet: (routerOutlet: RouterOutlet) => {
      st.router.ROUTER_OUTLET = routerOutlet;
    },

    navigate: (pathOrCustomElement: string, params?: any) => {
      let route = pathOrCustomElement;

      for (let param in params) {
        if (params.hasOwnProperty(param)) {
          route = route.replace(":" + param, params[param]);
        }
      }
      st.router.CURRENT_PATH = "#" + route;
      window.location.href = st.router.CURRENT_PATH;
    },
  };
}
