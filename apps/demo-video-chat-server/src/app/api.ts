import { Request, Response, Router } from "express";
import { createHmac } from "crypto";
import { MessageType, ServerUser } from "../../../libs/models";

import { UserStorageService } from "./services/user-storage.service";
import { MessageStorageService } from "./services/message-storage.service";


const COTURN_SERVER = process.env['COTURN_SERVER'] as string;
const COTURN_PORT = process.env['COTURN_PORT'] as string;
const COTURN_SESSION_TTL_MINUTES = parseInt(process.env['COTURN_SESSION_TTL_MINUTES'] as string, 10);
const COTURN_SERVER_SECRET = process.env['COTURN_SERVER_SECRET'] as string;


const authenticate = (request: Request): ServerUser | null  => {
  const userService: UserStorageService = UserStorageService.Instance();
  try {
    if (request?.headers?.authorization) {
      const [schema, token] = request?.headers?.authorization.split(' ');
      if (schema && token && schema === 'Basic' && token.length) {
        const tokenContent = Buffer.from(token, 'base64').toString('binary');
        const [username, secret] = tokenContent.split(':');
        if (username && secret) {
          return userService.findUserWithSecretAndName(username, secret);
        }
      }
    }
  } catch(e) {
    return null;
  }
  return null;
}
const getTURNCredentials = (username: string) => {

  const ttlMintues = COTURN_SESSION_TTL_MINUTES;
  const turnSecret = COTURN_SERVER_SECRET;

  let unixTimeStamp = parseInt('' + Date.now()/1000, 10) + ttlMintues * 60;
  let timestampAndUsername = [unixTimeStamp, username].join(':');
  let password;
  const hmac = createHmac('sha1', turnSecret);
  hmac.setEncoding('base64');
  hmac.write(timestampAndUsername);
  hmac.end();
  password = hmac.read();

  return {
      username: username,
      password: password
  };
}

export const apiRouter = Router()
const messageService: MessageStorageService = MessageStorageService.Instance();


apiRouter.get("/history", (request: Request, res: Response) => {
  const user = authenticate(request);
  if (user) {
    const room: string | undefined = request.query['room'] as string | undefined;
    const type: MessageType | undefined = request.query['type'] as MessageType | undefined;
    const sinceParam: string | undefined = request.query['since'] as string | undefined;
    const since = sinceParam ? parseInt(sinceParam, 10) : undefined;

    return res.status(200).json({ messages: messageService.getAllMessagesforRoom(room, type, since) });
  } else {
    return res.status(401).json({message : 'no user token'});
  }
});

apiRouter.get("/private-messages", (request: Request, res: Response) => {
  const user = authenticate(request);
  if (user) {
    const room: string | undefined = request.query['room'] as string | undefined;
    const type: MessageType | undefined = request.query['type'] as MessageType | undefined;
    const from: string | undefined = request.query['from'] as string | undefined;
    const sinceParam: string | undefined = request.query['since'] as string | undefined;
    const since = sinceParam ? parseInt(sinceParam, 10) : undefined;

    return res.status(200).json({ messages: messageService.getPrivateMessages(user.name, room, type, from, since) });
  } else {
    return res.status(401).json({message : 'no user token'});
  }
});

apiRouter.get('/servers', (request: Request, res: Response) => {
  const user = authenticate(request);
  if (user) {

    // Using more than two STUN/TURN servers slows down discovery
    const servers: {urls: string | string[]}[] = [
      { urls: 'stun:stun.l.google.com:19302' },
      // { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
      // { urls: 'stun:stun.services.mozilla.com' },
    ];
    
    // private coturn server
    // https://github.com/coturn/coturn
    if (COTURN_SERVER) {
      const cred = getTURNCredentials(user.name);
      const server = {
        urls: [`turn:${COTURN_SERVER}:${COTURN_PORT}`, `turn:${COTURN_SERVER}:${COTURN_PORT}?transport=tcp`],
        username: cred.username,
        credential: cred.password
      };
      servers.push(server);
    }

    return res.status(200).json(servers);
  } else {
    return res.status(401).json({message : 'no user token'});
  }
});

// apiRouter.get('/debug-messages', (request: Request, res: Response) => {
//   const room: string | undefined = request.query['room'] as string | undefined;
//   const sinceParam: string | undefined = request.query['since'] as string | undefined;
//   const since = sinceParam ? parseInt(sinceParam, 10) : undefined;
//   const messages = messageService.getAllMessages(room, since);
//   return res.status(200).json(messages);
// });
