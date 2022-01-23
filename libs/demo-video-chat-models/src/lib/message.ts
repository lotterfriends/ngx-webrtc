import { MessageType } from "./message-type";


export interface Message {
  type: MessageType;
  author: string;
  message: string;
  time: number;
  room: string;
  for?: string;
}
