import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelHistoryService {

  public history$ = new BehaviorSubject<string[]>(this.history);
  private historyInternal: string[] = [];
  constructor() { }

  get history(): string[] {
    if (!this.historyInternal) {
      if (sessionStorage.getItem('history')) {
        this.historyInternal = JSON.parse(sessionStorage.getItem('history')) as string[];
      } else {
        this.historyInternal = [];
      }
    }
    return this.historyInternal;
  }

  addChannelToHistory(entry: string): string[] {
    if (!this.history.includes(entry)) {
      this.history.push(entry);
      sessionStorage.setItem('history', JSON.stringify(this.history));
      this.history$.next(this.history);
    }
    return this.history;
  }

  getHistory(): string[] {
    return this.history;
  }

}
