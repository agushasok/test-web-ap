import { Component, DestroyRef, OnInit } from '@angular/core';
import { TelegramService } from "./services/telegram.service";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef
  ) {
    this.telegramService.tg.ready();
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(p => {
        if (p['path'] != null) {
          this.router.navigate([p['path']])
        }
      })
  }
}
