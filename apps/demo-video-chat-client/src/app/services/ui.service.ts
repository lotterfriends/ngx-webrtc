import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum ViewMode {
  Grid = 'grid',
  Presenting = 'presenting',
  Talking = 'talking'
}

@Injectable({
  providedIn: 'root'
})
export class UiService {

  public static readonly DEFAULTS = {
    USERLIST_VISIBLE: false,
    CHAT_VISIBLE: false,
    VIDEO_SETTINGS_DIALOG_VISIBLE: false,
    VIEW_MODE: ViewMode.Grid
  };

  public isUserlistVisible$ = new BehaviorSubject(UiService.DEFAULTS.USERLIST_VISIBLE);
  public isChatVisible$ = new BehaviorSubject(UiService.DEFAULTS.CHAT_VISIBLE);
  public isVideoSettingsDialogVisible$ = new BehaviorSubject(UiService.DEFAULTS.VIDEO_SETTINGS_DIALOG_VISIBLE);
  public viewMode$ = new BehaviorSubject<ViewMode>(UiService.DEFAULTS.VIEW_MODE);

  toggleShowUserlist(): void {
    this.isUserlistVisible$.next(!this.isUserlistVisible$.getValue());
  }

  toggleShowChat(): void{
    this.isChatVisible$.next(!this.isChatVisible$.getValue());
  }

  toggleShowVideoSettingsDialog(): void {
    this.isVideoSettingsDialogVisible$.next(!this.isVideoSettingsDialogVisible$.getValue());
  }

  hideVideoSettingsDialog(): void {
    this.isVideoSettingsDialogVisible$.next(false);
  }

  showVideoSettingsDialog(): void {
    this.isVideoSettingsDialogVisible$.next(true);
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode$.next(mode);
  }

}
