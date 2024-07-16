import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './pages/list/list.component';
import { ListItemComponent } from './pages/list-item/list-item.component';
import { HttpClientModule } from "@angular/common/http";
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { ReactiveFormsModule } from "@angular/forms";
import { AuthComponent } from './pages/auth/auth.component';
import { IdentificationComponent } from './pages/identification/identification.component';
import { PasswordFormComponent } from './pages/password-form/password-form.component';
import { PasswordCreateComponent } from './pages/password-create/password-create.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ListItemComponent,
    FeedbackComponent,
    AuthComponent,
    IdentificationComponent,
    PasswordFormComponent,
    PasswordCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
