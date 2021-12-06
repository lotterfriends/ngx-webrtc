import express from "express";
import cors from "cors";

import { initSockets } from "./sockets";
import { initRoutes } from "./api";

(() => {
  const app = express();
  app.use(cors());
  app.set("port", process.env['PORT'] || 3333);
  const http = require("http").Server(app);

  initSockets(http);
  initRoutes(app);

  http.listen(app.get("port"), function () {
    console.log(`listening on *:${app.get("port")}`);
  });
})();
