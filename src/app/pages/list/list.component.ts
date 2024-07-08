import { Component, DestroyRef, OnInit } from '@angular/core';
import { TelegramService } from "../../services/telegram.service";
import { ListService } from "../../services/list/list.service";
import { Observable } from "rxjs";
import { ListItem } from "../../models/list-item.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.less'
})
export class ListComponent implements OnInit {

  listItems!: Observable<ListItem[]>;

  constructor(
    private readonly telegramService: TelegramService,
    private readonly listService: ListService
  ) {
  }

  ngOnInit() {
    this.telegramService.tg.ready();
    this.telegramService.tg.MainButton.show();

    this.listItems = this.listService.getList();
  }
}
