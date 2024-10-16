// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="color-scheme" content="dark light" />
          {assets}
        </head>
        <body class="bg-[#09090b] text-[#fafafa] font-sans font-400">
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
