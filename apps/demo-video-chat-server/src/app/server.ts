import * as express from "express";
import * as cors from "cors";
import { initSockets } from "./sockets";
import { apiRouter } from "./api";

// TODO: better oop
export class ChatServer {

  constructor() {
    const app = express();
    app.use(cors());
    app.set("port", process.env['PORT'] || 3333);
    app.use('/api', apiRouter);
    app.use('/', express.static(__dirname + '/client'));
    app.all('*', function(req, res, next) {
      if (req.url.startsWith('/api')) {
        return next();
      }
      res.sendFile('client/index.html', { root: __dirname });
    });
    
    const server = app.listen(app.get("port"), () => {
      console.log(`listening on *:${app.get("port")}`);
    });
    initSockets(server);
  }

}
