import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IceServer } from 'ngx-webrtc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http: HttpClient) {}

  public getServers(): Observable<IceServer[]> {
    return this.http.get<IceServer[]>(
      `/api/servers`
    );
  }
}
