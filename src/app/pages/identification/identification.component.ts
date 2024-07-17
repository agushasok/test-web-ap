import { Component, DestroyRef, OnInit } from '@angular/core';
import { TelegramService } from "../../services/telegram.service";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-identification',
  templateUrl: './identification.component.html',
  styleUrl: './identification.component.less'
})
export class IdentificationComponent implements OnInit {

  appPasswordKey = 'app-password';
  bioManager: any;
  passwordControl = new FormControl('');

  constructor(
    private readonly telegramService: TelegramService,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef
  ) {
  }

  ngOnInit() {
    this.bioManager = this.telegramService.tg.BiometricManager;
    this.checkPassword();
  }

  checkPassword() {
    this.telegramService.tg.CloudStorage.getItem(this.appPasswordKey, (err: Error | null, val?: string) => {
      if (err != null) {
        console.log(err);
      }

      if (val == null || val === '') {
        this.router.navigate(['/password-create'])
      }

      this.passwordControl.valueChanges
        .pipe(
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(v => {
          if (v == null || v.length != 4) {
            return;
          }

          if (v === val) {
            this.router.navigate(['/list'])
          } else {
            this.passwordControl.setValue('');
          }
        })

      this.initIdentification();
    })
  }

  initIdentification() {
    this.bioManager.init(() => {
      if (!this.bioManager.isBiometricAvailable || !this.bioManager.isAccessGranted) {
        return;
      }

      this.bioManager.authenticate(
        { reason: 'Hello!' },
        (isAuthenticated: boolean) => {
          if (isAuthenticated) {
            this.router.navigate([ '/list' ])
          }
        }
      )
    });
  }

  resetPassword() {
    this.router.navigate([ '/password-create' ])
  }
}
