import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageType, ServerMessage } from '@ngx-webrtc/demo-video-chat-models';

export interface MessagesHistoryResponse {
  messages: ServerMessage[];
}

@Injectable({
  providedIn: 'root',
})
export class MessagesService {

  constructor(private http: HttpClient) {}

  public getMessagesHistory(room: string, type?: MessageType, since?: number): Observable<MessagesHistoryResponse> {
    return this.http.get<MessagesHistoryResponse>(
      `/api/history?room=${room}${type ? `&type=${type}` : ''}${since ? `&since=${since}` : ''}`
    );
  }

  public getPrivateMessages(room: string, type?: MessageType, from?: string, since?: number): Observable<MessagesHistoryResponse> {
    return this.http.get<MessagesHistoryResponse>(
      `/api/private-messages?room=${room}${type ? `&type=${type}` : ''}${from ? `&from=${from}` : ''}${since ? `&since=${since}` : ''}`
    );
  }
}
