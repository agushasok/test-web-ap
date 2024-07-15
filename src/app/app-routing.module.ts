import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from "./pages/list/list.component";
import { ListItemComponent } from "./pages/list-item/list-item.component";
import { FeedbackComponent } from "./pages/feedback/feedback.component";
import { AuthComponent } from "./pages/auth/auth.component";

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'list', component: ListComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'list/:id', component: ListItemComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: '**', redirectTo: 'list' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
