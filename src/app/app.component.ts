import { Component } from '@angular/core';
import { TelegramService } from "./services/telegram.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  constructor(
    private readonly telegramService: TelegramService
  ) {
    this.telegramService.tg.ready();
  }
}
