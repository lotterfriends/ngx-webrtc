import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CallService {

  private till: number;
  constructor() { }

  updateTill() {
    this.till = Date.now();
  }

  getTill() {
    return this.till;
  }
}
