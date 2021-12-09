import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  public static readonly DEFAULTS = {
    USERLIST_VISIBLE: false,
    CHAT_VISIBLE: false,
  };

  public isUserlistVisible = new BehaviorSubject(UiService.DEFAULTS.USERLIST_VISIBLE);
  public isChatVisible = new BehaviorSubject(UiService.DEFAULTS.CHAT_VISIBLE);
  constructor() { }

  toggleShowUserlist() {
    this.isUserlistVisible.next(!this.isUserlistVisible.getValue());
  }
  
  toggleShowChat() {
    this.isChatVisible.next(!this.isChatVisible.getValue());
  }
}
