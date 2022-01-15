import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http: HttpClient) {}

  public getServers(): Observable<{urls: string | string[]}[]> {
    return this.http.get<{urls: string | string[]}[]>(
      `/api/servers`
    );
  }
}
