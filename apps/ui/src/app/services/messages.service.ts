import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { MessageType } from "../../../../../libs/models/message-type";
import { ServerMessage } from "../../../../../libs/models/server-message";
import { environment } from "src/environments/environment";

export interface MessagesHistoryResponse {
  messages: ServerMessage[];
}

@Injectable({
  providedIn: "root",
})
export class MessagesService {
  private BASE_ENDPOINT: string = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  public getMessagesHistory(room: string, type?: MessageType, since?: number): Observable<MessagesHistoryResponse> {
    return this.http.get<MessagesHistoryResponse>(
      `${this.BASE_ENDPOINT}/history?room=${room}${type ? `&type=${type}`: ''}${since ? `&since=${since}`: ''}`
    );
  }

  public getPrivateMessages(room: string, type?: MessageType, since?: number): Observable<MessagesHistoryResponse> {
    return this.http.get<MessagesHistoryResponse>(
      `${this.BASE_ENDPOINT}/private-messages?room=${room}${type ? `&type=${type}`: ''}${since ? `&since=${since}`: ''}`
    );
  }
}
