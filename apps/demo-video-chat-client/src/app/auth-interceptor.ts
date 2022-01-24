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

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  addAuthHeader(req: HttpRequest<any>, user: ServerUser): HttpRequest<any> {
    const token = this.getToken(user);
    return req.clone({
      setHeaders: {
        Authorization: `Basic ${token}`,
      },
    });
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.userStorageServie.getCurrentUser();
    if (user) {
      return next.handle(this.addAuthHeader(req, user));
    }
    return next.handle(req);
  }
}
