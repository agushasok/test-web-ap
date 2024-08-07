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
    private readonly cdr: ChangeDetectorRef,
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
          this.passwordPhase = PasswordPhase.Repeat;
          this.passwordCtrl.setValue('');
          this.cdr.detectChanges();
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
                this.passwordCtrl.setValue('');
                this.cdr.detectChanges();
              }

              this.setBiometry();
            }
          )
        } else {
          this.passwordCtrl.setValue('');
          this.cdr.detectChanges();
        }
      });
  }

  createAgain() {
    this.passwordPhase = PasswordPhase.Create;
    this.createdPassword = '';
    this.passwordCtrl.setValue('');
    this.cdr.detectChanges();
  }

  private setBiometry() {
    const bioManager = this.telegramService.tg.BiometricManager;

    const afterInitCallback = () => {
      if (!bioManager.isBiometricAvailable) {
        this.router.navigate([ '/identification' ]);
        this.cdr.detectChanges();
        return;
      }

      bioManager.requestAccess({ reason: 'Разрешить биометрию' }, () => {
        this.router.navigate([ '/identification' ]);
        this.cdr.detectChanges();
      });

      this.cdr.detectChanges();
    }

    if (bioManager.isInited) {
      afterInitCallback();
    } else {
      bioManager.init(afterInitCallback)
    }
  }
}
