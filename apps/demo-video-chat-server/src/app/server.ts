import * as express from "express";
import * as cors from "cors";
import { resolve } from 'path';
import { initSockets } from "./sockets";
import { apiRouter } from "./api";
import { Server } from "http";

// TODO: better oop
export class ChatServer {

  constructor() {
    const app = express();
    app.use(cors());
    app.set("port", process.env['PORT'] || 3333);
    const http = new Server(app);
    initSockets(http);
    
    app.use('/api', apiRouter);
    app.get("/", (_req: express.Request, res: express.Response) => {
      res.sendFile(resolve("./client/index.html"));
    });
    
    http.listen(app.get("port"), () => {
      console.log(`listening on *:${app.get("port")}`);
    });
  }

}
