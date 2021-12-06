import { Express, Request, Response } from "express";
import * as path from "path";
import { MessageType, ServerUser } from "../../../libs/models";

import { UserStorageService } from "./services/user-storage.service";
import { MessageStorageService } from "./services/message-storage.service";

const authenticate = (request: Request): ServerUser | null  => {
  const userService: UserStorageService = UserStorageService.Instance();
  if (request?.headers?.authorization) {
    const headerArr = request?.headers?.authorization.split(' ');
    if (headerArr.length === 2 && headerArr[0] === 'Basic') {
      const token: string = request?.headers?.authorization.split(' ')[1] as string;
      const tokenContent = Buffer.from(token, 'base64').toString('ascii');
      const [username, secret] = tokenContent.split(':');
      if (username && secret) {
        return userService.findUserWithSecretAndName(username, secret);
      }
    }
  }
  return null;
}

export const initRoutes = (app: Express) => {
  const messageService: MessageStorageService = MessageStorageService.Instance();
  // 


  app.get("/", (_req: Request, res: Response) => {
    res.sendFile(path.resolve("./client/index.html"));
  });

  app.get("/history", (request: Request, res: Response) => {
    const user = authenticate(request);
    if (user) {
      const room: string | undefined = request.query['room'] as string | undefined;
      const type: MessageType | undefined = request.query['type'] as MessageType | undefined;
      const tillParam: string | undefined = request.query['till'] as string | undefined;
      const till = tillParam ? parseInt(tillParam, 10) : undefined;
  
      return res.status(200).json({ messages: messageService.getAllMessagesforRoom(room, type, till) });
    } else {
      return res.status(401).json({message : 'no user token'});
    }
  });

  app.get("/private-messages", (request: Request, res: Response) => {
    const user = authenticate(request);
    if (user) {
      const room: string | undefined = request.query['room'] as string | undefined;
      const type: MessageType | undefined = request.query['type'] as MessageType | undefined;
      const tillParam: string | undefined = request.query['till'] as string | undefined;
      const till = tillParam ? parseInt(tillParam, 10) : undefined;

      return res.status(200).json({ messages: messageService.getPrivateMessages(user.name, room, type, till) });
    } else {
      return res.status(401).json({message : 'no user token'});
    }
  });
};
