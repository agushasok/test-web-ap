import { ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { TelegramService } from "../../services/telegram.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";

enum PasswordPhase {
  Create = 'create',
  Repeat = 'repeat'
}

@Component({
  selector: 'app-password-create',
  templateUrl: './password-create.component.html',
  styleUrl: './password-create.component.less'
})
export class PasswordCreateComponent implements OnInit {

  appPasswordKey = 'app-password';

  passwordCtrl = new FormControl('');
  passwordPhaseEnum = PasswordPhase;
  passwordPhase = PasswordPhase.Create;
  createdPassword = '';

  constructor(
    private readonly telegramService: TelegramService,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef
  ) {
  }

  ngOnInit() {
    this.passwordCtrl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(v => {
        if (v == null || v.length != 4) {
          return;
        }

        if (this.passwordPhase === PasswordPhase.Create) {
          this.createdPassword = v;
          this.passwordCtrl.setValue('');
          this.passwordPhase = PasswordPhase.Repeat;
          return;
        }

        if (v === this.createdPassword) {
          this.telegramService.tg.CloudStorage.setItem(
            this.appPasswordKey,
            v,
            (err: Error | null, isSaved: boolean) => {
              if (err != null || !isSaved) {
                this.createdPassword = '';
                this.passwordPhase = PasswordPhase.Create;
              }

              this.setBiometry();
            }
          )
        }
      });
  }

  createAgain() {
    this.passwordPhase = PasswordPhase.Create;
    this.createdPassword = '';
    this.passwordCtrl.setValue('');
  }

  private setBiometry() {
    const bioManager = this.telegramService.tg.BiometricManager;

    bioManager.init(() => {
      if (!bioManager.isBiometricAvailable) {
        this.router.navigate(['/identification']);
        return;
      }

      bioManager.requestAccess({ reason: 'Разрешить биометрию' }, () => {
        this.router.navigate(['/identification']);
      })
    })
  }
}
