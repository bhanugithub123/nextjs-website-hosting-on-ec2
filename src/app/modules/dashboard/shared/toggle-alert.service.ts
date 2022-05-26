import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleAlertService {

  private _ToggleAlert$ = new Subject<any[]>();

  constructor() { }

  ToggleAlert$(msg : string, err: boolean){
    this._ToggleAlert$.next([msg, err]);
  }

  IsAlerted(){
    return this._ToggleAlert$;
  }
}
