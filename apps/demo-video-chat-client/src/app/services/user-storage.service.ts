import { Injectable } from '@angular/core';
import { ServerUser } from '@ngx-webrtc/demo-video-chat-models';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {

  setCurrentUsername(username: string): void {
    window.sessionStorage.setItem('username', username);
  }

  getCurrentUsername(): string | null {
    return window.sessionStorage.getItem('username');
  }

  setCurrentUser(user: ServerUser): void {
    window.sessionStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUser(): ServerUser | null {
    const sessionStorageUser = sessionStorage.getItem('user');
    return sessionStorageUser ? (JSON.parse(sessionStorageUser)as ServerUser) : null;
  }

  removeCurrentUser(): void {
    window.sessionStorage.removeItem('username');
  }

}
