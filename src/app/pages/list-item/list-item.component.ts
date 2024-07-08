import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListService } from "../../services/list/list.service";
import { ListItem } from "../../models/list-item.model";
import { Observable, switchMap } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { TelegramService } from "../../services/telegram.service";

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.less'
})
export class ListItemComponent implements OnInit, OnDestroy {

  item$!: Observable<ListItem>;

  constructor(
    private readonly listService: ListService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly telegramService: TelegramService
  ) {
  }

  ngOnInit() {
    this.item$ = this.route.params
      .pipe(
        switchMap(p => this.listService.getItem(+p['id']))
      )

    this.telegramService.tg.BackButton.show();
    this.telegramService.tg.BackButton.onClick(this.onBackClick);
  }

  ngOnDestroy() {
    this.telegramService.tg.BackButton.offClick(this.onBackClick);
  }

  onBackClick = () => {
    this.router.navigate(['list'])
  }
}
