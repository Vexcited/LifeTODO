import "@unocss/reset/tailwind.css";
import "@fontsource/comic-mono/400.css";
import "@fontsource/comic-mono/700.css";
import "virtual:uno.css";

import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { createEffect, type FlowComponent, on, onMount, Suspense } from "solid-js";
import auth from "./stores/auth";

const Layout: FlowComponent = (props) => {
  createEffect(on(() => auth.token, () => auth.checkToken()));
  return props.children;
}

export default function App() {
  return (
    <Router
      root={(props) => (
        <Layout>
          <Suspense>
            {props.children}
          </Suspense>
        </Layout>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
