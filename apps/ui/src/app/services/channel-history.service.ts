import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelHistoryService {

  public history$ = new BehaviorSubject<string[]>(this.history);
  private _history: string[] = [];
  constructor() { }

  get history(): string[] {
    if (!this._history) {
      if (sessionStorage.getItem('history')) {
        this._history = JSON.parse(sessionStorage.getItem('history')) as string[];
      } else {
        this._history = [];
      }
    }
    return this._history;
  }

  addChannelToHistory(entry: string): string[] {
    if (!this.history.includes(entry)) {
      this.history.push(entry)
      sessionStorage.setItem('history', JSON.stringify(this.history));
      this.history$.next(this.history);
    }
    return this.history;
  }

  getHistory(): string[] {
    return this.history;
  }

}
