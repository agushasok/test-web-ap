import { Component, OnInit } from '@angular/core';
import { TelegramService } from "./services/telegram.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {
  version = '';

  constructor(
    private readonly telegramService: TelegramService
  ) {
    this.telegramService.tg.ready();
  }

  ngOnInit() {
    this.version = this.telegramService.tg.version;
  }
}
