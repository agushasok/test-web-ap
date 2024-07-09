import { Component, DestroyRef, OnInit } from '@angular/core';
import { TelegramService } from "../../services/telegram.service";
import { ListService } from "../../services/list/list.service";
import { Observable } from "rxjs";
import { ListItem } from "../../models/list-item.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.less'
})
export class ListComponent implements OnInit {

  listItems!: Observable<ListItem[]>;

  constructor(
    private readonly telegramService: TelegramService,
    private readonly listService: ListService,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.telegramService.tg.MainButton.hide();
    this.telegramService.tg.BackButton.hide();

    this.listItems = this.listService.getList();
  }

  openItem(itemId: number) {
    this.router.navigate(['list', itemId])
  }
}
