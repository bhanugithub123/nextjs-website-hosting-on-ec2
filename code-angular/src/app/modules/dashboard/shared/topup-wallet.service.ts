import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TopupWalletService {
  token !: string | null ;
  constructor(private http : HttpClient) { 
    if(sessionStorage.getItem('Token') === null) {
      this.token = localStorage.getItem('Token');
    }
    else {
      this.token = sessionStorage.getItem('Token');
    }
  }

  url = environment.API_URL_HEAD + 'initial_transaction';
  StorageURL = environment.API_URL_HEAD + 'buy_space';
  UserBalance = 0;
  private _refreshNeeded$ = new Subject<void>();
  private UnsubscribeToStoragePlanURL = environment.API_URL_HEAD + 'expire_space';

  refreshNeeded$() {
    return this._refreshNeeded$;
  }

  TopUp(amount : string){
    const data = new FormData();
    data.append('amount', amount);
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this.http.post(this.url, data, opts).pipe(
      tap(
        () => {
          this._refreshNeeded$.next();
        }
      )
    );
  }

  buyStorage(memory : number, amount : number){
    const data = new FormData();
    data.append('space', `${memory}`);
    data.append('amount', `${amount}`);
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this.http.post(this.StorageURL, data, opts).pipe(
      tap(
        () => {
          this._refreshNeeded$.next();
        }
      )
    );
  }
  UnsubscribeToStoragePlan(payload : FormData){
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this.http.post(this.UnsubscribeToStoragePlanURL, payload, opts).pipe(
      tap(
        () => {
          this._refreshNeeded$.next();
        }
      )
    );
  }
}
