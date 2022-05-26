import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloseSearchService {

  private _CloseSearch$ = new BehaviorSubject<boolean>(false);

  CloseSearch$(){
    this._CloseSearch$.next(true);
  }

  openSearch(){
    this._CloseSearch$.next(false);
  }

  close() {
    return this._CloseSearch$;
  }

  constructor() { }
}
