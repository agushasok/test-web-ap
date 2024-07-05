import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class TelegramService {

  tg: any;

  constructor(
    @Inject(DOCUMENT) private document: any
  ) {
    this.tg = document.defaultView.Telegram.WebApp;
  }
}
