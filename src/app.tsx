import "@unocss/reset/tailwind.css";
import "@fontsource/comic-mono/400.css";
import "@fontsource/comic-mono/700.css";
import "virtual:uno.css";

import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

export default function App() {
  return (
    <Router
      root={(props) => (
        <Suspense>{props.children}</Suspense>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
