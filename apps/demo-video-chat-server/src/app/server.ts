import express, { Request, Response } from "express";
import cors from "cors";
import { resolve } from 'path';
import { initSockets } from "./sockets";
import { apiRouter } from "./api";

(() => {
  const app = express();
  app.use(cors());
  app.set("port", process.env['PORT'] || 3333);
  const http = require("http").Server(app);
  initSockets(http);

  app.use('/api', apiRouter);
  app.get("/", (_req: Request, res: Response) => {
    res.sendFile(resolve("./client/index.html"));
  });

  http.listen(app.get("port"), () => {
    console.log(`listening on *:${app.get("port")}`);
  });
})();
