import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  public static getRandom(size: number): string {
    return `${Math.round(Math.random() * parseInt(`1${(1e15 + 0 + '').slice(-size)}`, 10))}`;
  }

}