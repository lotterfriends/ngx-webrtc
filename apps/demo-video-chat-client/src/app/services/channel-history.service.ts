import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelHistoryService {

  public history$ = new BehaviorSubject<string[]>(this.history);
  private historyInternal: string[] = [];

  get history(): string[] {
    if (!this.historyInternal) {
      const sessionStorageHistory = sessionStorage.getItem('history');
      if (sessionStorageHistory) {
        this.historyInternal = JSON.parse(sessionStorageHistory) as string[];
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
