import { Component, DestroyRef, OnInit } from '@angular/core';
import { TelegramService } from "./services/telegram.service";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AuthService } from "./services/auth/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly authService: AuthService,
    private readonly destroyRef: DestroyRef
  ) {
    this.telegramService.tg.ready();
  }

  ngOnInit() {
    this.authService.accessToken$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe()
  }
}
