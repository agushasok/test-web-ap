import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {

  tg: any;

  constructor(
  ) {
    this.tg = (document.defaultView as any).Telegram.WebApp;
  }
}
