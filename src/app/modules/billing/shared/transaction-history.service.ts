import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionHistoryService {

  token !: string | null;

  transactionHistoryDateRangeURL = environment.API_URL_HEAD + 'payment_history_date_range';
  transactionHistoryURL = environment.API_URL_HEAD + 'payment_history';
  AvailableBalanceURL = environment.API_URL_HEAD + 'available_balance';

  storeToken(){
    if(sessionStorage.getItem('Token') === null) {
      this.token = localStorage.getItem('Token')
    }
    else {
      this.token = sessionStorage.getItem('Token');
    }
  }

  constructor(private _HTTP : HttpClient) { 
    this.storeToken();
  }

  LoadTransactionHistoryDateFilter(from : string, to: string){
    this.storeToken();
    const opts = {
      params : new HttpParams({
        fromString: 'From='+from+'&to='+to
      }),
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.get(this.transactionHistoryDateRangeURL, opts);
  }

  LoadTransactionHistory(){
    this.storeToken();
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.get(this.transactionHistoryURL, opts);
  }

  LoadAvailableBalance(){
    this.storeToken();
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.get(this.AvailableBalanceURL, opts);
  }
}
