import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CallService {

  public muteMe = new EventEmitter<void>();
  private till: number;
  constructor() { }

  updateTill() {
    this.till = Date.now();
  }

  getTill() {
    return this.till;
  }
}
