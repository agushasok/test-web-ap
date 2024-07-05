import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {

  tg: any;

  constructor(
  ) {
    this.tg = (window as any).Telegram.WebApp;
  }
}
