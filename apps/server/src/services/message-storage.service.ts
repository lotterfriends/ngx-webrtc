import { Message } from "../../../../libs/models/message";
import { MessageType } from "../../../../libs/models/message-type";
import { ServerMessage } from "../../../../libs/models/server-message";

export class MessageStorageService {
  private static instance: MessageStorageService;
  private messagesDB: ServerMessage[] = [];
  private messageIndex = 0;
  private constructor() {}

  public static Instance(): MessageStorageService {
    if (!this.instance) {
      this.instance = new MessageStorageService();
    }

    return this.instance;
  }

  public storeMessage(message: Message): ServerMessage {
    const serverMessage = {
      id: `${this.messageIndex++}`,
      ...message
    }
    this.messagesDB.push(serverMessage);
    return serverMessage;
  }

  public getAllMessages(room?: string, since?: number): ServerMessage[] {
    let messages = this.messagesDB;
    if (room) {
      messages = messages.filter(e => e.room === room);
    }
    if (since) {
      messages = messages.filter(e => e.time > since);
    }
    return messages;
  }

  public getAllPublicMessages(): ServerMessage[] {
    return this.messagesDB.filter(e => typeof e.for  === 'undefined');
  }
  
  public getAllMessagesforRoom(room?: string, type?: MessageType, since?: number): ServerMessage[] {
    if (!room) {
      return this.getAllPublicMessages();
    }
    let messages = this.messagesDB.filter(e => e.room === room && typeof e.for === 'undefined');
    if (type) {
      messages = messages.filter(e => e.type === type);
    }
    if (since) {
      messages = messages.filter(e => e.time > since);
    }
    return messages;
  }

  public getPrivateMessages(username: string, room?: string, type?: MessageType, from?: string, since?: number): ServerMessage[] {
    if (!room) {
      return this.messagesDB.filter(e => typeof e.for  === username);
    }
    let messages = this.messagesDB.filter(e => e.room === room && e.for === username);
    if (type) {
      messages = messages.filter(e => e.type === type);
    }
    if (from) {
      messages = messages.filter(e => e.author === from);
    }
    if (since) {
      messages = messages.filter(e => e.time > since);
    }
    return messages;
  }

}
