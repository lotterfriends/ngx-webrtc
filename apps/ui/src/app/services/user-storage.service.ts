import { Injectable } from '@angular/core';
import { ServerUser } from '../../../../../libs/models/server-user';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  constructor() {}

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
    return window.sessionStorage.getItem('user') ? (JSON.parse(window.sessionStorage.getItem('user'))as ServerUser) : null;
  }

  removeCurrentUser(): void {
    window.sessionStorage.removeItem('username');
  }

}
