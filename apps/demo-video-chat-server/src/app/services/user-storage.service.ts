import { ServerUser, User } from "@ngx-webrtc/demo-video-chat-models";

export class UserStorageService {
  private static instance: UserStorageService;
  private usersDB: ServerUser[] = [];
  private userIndex = 0;
  private constructor() {}
  private secretLength = 16;

  public static Instance(): UserStorageService {
    if (!this.instance) {
      this.instance = new UserStorageService();
    }

    return this.instance;
  }

  public usernameTaken(username: string): boolean {
    return this.usersDB.length > 0 && this.usersDB.findIndex(e => e.name === username) > -1;
  }

  public storeUser(user: User): ServerUser {
    const serverUser = {
      id: `${this.userIndex++}`,
      secret: `${Math.round(Math.random() * parseInt(`1${(1e15 + 0 + '').slice(-this.secretLength)}`, 10))}`,
      ...user
    }
    this.usersDB.push(serverUser);
    return serverUser;
  }

  public getAllUsers(): ServerUser[] {
    return this.usersDB;
  }

  public updateUser(secret: string, socketId: string) {
    const index = this.usersDB.findIndex(e => e.secret === secret);
    if (index > -1) {
      (this.usersDB[index] as ServerUser).socketId = socketId;
    }
    return this.usersDB[index] as ServerUser;
  }

  findUserWithSecretAndName(username: string, secret: string): ServerUser | null {
    const index = this.usersDB.findIndex(e => e.secret === secret && e.name === username);
    if (index > -1) {
      return this.usersDB[index] as ServerUser;
    }
    return null;
  }
  
  findUserWithName(username: string): ServerUser | null {
    const index = this.usersDB.findIndex(e => e.name === username);
    if (index > -1) {
      return this.usersDB[index] as ServerUser;
    }
    return null;
  }
  
}
