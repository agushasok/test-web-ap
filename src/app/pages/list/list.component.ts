import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  randomNumberKey = 'random_number';
  randomNUmber?: string;

  constructor(
    private readonly telegramService: TelegramService,
    private readonly listService: ListService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.telegramService.tg.MainButton.hide();
    this.telegramService.tg.BackButton.hide();
    this.telegramService.tg.CloudStorage.getItem(
      this.randomNumberKey,
      (err: Error | null, value: string) => {
        if (err != null) {
          this.telegramService.tg.showAlert(JSON.stringify(err))
        }

        this.randomNUmber = value;
        this.cdr.detectChanges();
      }
    )

    this.listItems = this.listService.getList();
  }

  openItem(itemId: number) {
    this.router.navigate(['list', itemId])
  }

  onSave() {
    const rndNum = Math.round(Math.random() * 10).toString()
    this.telegramService.tg.CloudStorage.setItem(
      this.randomNumberKey,
      rndNum,
      (err: Error | null, isStored: boolean) => {
        if (err != null) {
          this.telegramService.tg.showAlert(JSON.stringify(err))
        }

        if (isStored) {
          this.randomNUmber = rndNum;
        }

        this.telegramService.tg.showPopup({
          title: isStored ? 'Stored' : 'Not stored',
          message: isStored ? 'New random number is stored' : 'New random number is not stored',
          buttons: [
            {
              type: 'ok'
            }
          ]
        });
      }
      );
  }
}
