import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  private _ToggleDropDownOff$ = new Subject<void>();

  get ToggleDropDown$() {
    return this._ToggleDropDownOff$;
  }
  ToggleDropdownOff(){
    this._ToggleDropDownOff$.next();
  }

  ToggleVideo() {
    this._refreshNeeded$.next();
  }
  ToggleImage() {
    this._refreshNeeded$.next();
  }
}
