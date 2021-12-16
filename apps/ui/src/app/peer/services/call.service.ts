import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CallService {

  private since: number;
  constructor() { }

  updateSince() {
    this.since = Date.now();
    sessionStorage.setItem('since', '' +this.since);
  }

  getSince() {
    if (!this.since && sessionStorage.getItem('since')) {
      this.since = parseInt(sessionStorage.getItem('since'), 10);
    }
    return this.since;
  }


}
