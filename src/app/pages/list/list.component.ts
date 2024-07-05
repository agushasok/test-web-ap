import { Component, OnInit } from '@angular/core';
import { TelegramService } from "../../services/telegram.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.less'
})
export class ListComponent implements OnInit {
  tgCtx: any;

  constructor(
    private readonly telegramService: TelegramService
  ) {}

  ngOnInit() {
    this.telegramService.tg.ready();
    setTimeout(() => {
      this.tgCtx = this.telegramService.tg;
      this.telegramService.tg.MainButton.show();
      this.telegramService.tg.SettingsButton.hide();
    }, 0);
  }
}
