import { User } from "./user";


export interface ServerUser extends User {
  id: string;
  secret: string;
}
