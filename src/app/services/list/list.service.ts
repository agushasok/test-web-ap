import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ListItem } from "../../models/list-item.model";

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(
    private readonly http: HttpClient
  ) {
  }

  getList(): Observable<ListItem[]> {
    return this.http.get<ListItem[]>('assets/list-items.json');
  }
}
