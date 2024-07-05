import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from "./pages/list/list.component";
import { ListItemComponent } from "./pages/list-item/list-item.component";

const routes: Routes = [
  { path: 'list', component: ListComponent, pathMatch: 'full' },
  { path: 'list/:id', component: ListItemComponent },
  { path: '**', redirectTo: 'list' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
