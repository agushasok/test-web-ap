import { Component, Input } from '@angular/core';
import { ListItem } from "../../models/list-item.model";

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.less'
})
export class ListItemComponent {
  @Input({ required: true }) listItem!: ListItem;
}
