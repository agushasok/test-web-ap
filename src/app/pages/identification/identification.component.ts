import { Component, OnInit } from '@angular/core';
import { TelegramService } from "../../services/telegram.service";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-identification',
  templateUrl: './identification.component.html',
  styleUrl: './identification.component.less'
})
export class IdentificationComponent implements OnInit {

  appPasswordKey = 'app-password';
  appPassword?: string;
  bioManager: any;
  passwordControl = new FormControl('');

  constructor(
    private readonly telegramService: TelegramService,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.bioManager = this.telegramService.tg.BiometricManager;
    this.checkPassword();
  }

  checkPassword() {
    this.telegramService.tg.CloudStorage.getItem(this.appPasswordKey, (err: Error | null, val?: string) => {
      if (err == null) {
        console.log(err);
      }

      if (val == null) {
        this.router.navigate(['password-create'])
      }

      this.appPassword = val;

      this.initIdentification();
    })
  }

  initIdentification() {
    this.bioManager.init(() => {
      if (!this.bioManager.isAccessGranted) {
        return;
      }

      this.bioManager.authenticate(
        { reason: 'Hello!' },
        (isAuthenticated: boolean) => {
          if (isAuthenticated) {
            this.router.navigate([ 'list' ])
          }
        }
      )
    });
  }
}
