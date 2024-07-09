import { Component, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { TelegramService } from "../../services/telegram.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.less'
})
export class FeedbackComponent implements OnInit, OnDestroy {

  feedbackControl = new FormControl('', Validators.required);

  constructor(
    private readonly telegramService: TelegramService,
    private readonly destroyRef: DestroyRef
  ) {
  }

  ngOnInit() {
    this.telegramService.tg.MainButton.setText('Отправить сообщение');
    this.telegramService.tg.MainButton.show();
    this.telegramService.tg.MainButton.onClick(this.sendData);

    this.feedbackControl.statusChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(s => {
        if (s === 'VALID') {
          this.telegramService.tg.MainButton.enable();
        } else {
          this.telegramService.tg.MainButton.disable();
        }
      })
  }

  sendData = () => {
    this.telegramService.tg.sendData(JSON.stringify({ feedback: this.feedbackControl.value }));
  }

  ngOnDestroy() {
    this.telegramService.tg.mainButton.offClick(this.sendData);
  }
}
