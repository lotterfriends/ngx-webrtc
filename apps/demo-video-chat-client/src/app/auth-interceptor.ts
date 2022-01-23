import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerUser } from '@ngx-webrtc/demo-video-chat-models';
import { UserStorageService } from './services/user-storage.service';

// Do not use in production, this is just a demo
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private userStorageServie: UserStorageService
    ) {
  }

  getToken(user: ServerUser): string {
    return btoa([user.name, user.secret].join(':'));
  }

  addAuthHeader(req: HttpRequest<any>, user: ServerUser): HttpRequest<any> {
    const token = this.getToken(user);
    return req.clone({
      setHeaders: {
        Authorization: `Basic ${token}`,
      },
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.userStorageServie.getCurrentUser();
    if (user) {
      return next.handle(this.addAuthHeader(req, user));
    }
    return next.handle(req);
  }
}
