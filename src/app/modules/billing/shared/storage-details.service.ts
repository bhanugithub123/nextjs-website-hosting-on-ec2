import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageDetailsService {

  token !: string | null;

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
  private GetStorageDetailsURL = environment.API_URL_HEAD + 'available_memory';
  private GetStorageDetailsListURL = environment.API_URL_HEAD + 'file_storage_details';
  private GetActiveStoragePlansURL = environment.API_URL_HEAD + 'get_memory_plans';

  LoadStorageDetails(){
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.get(this.GetStorageDetailsURL, opts);
  }
  

  LoadStorageDetailsList(){
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.get(this.GetStorageDetailsListURL, opts);
  }
  GetActiveStoragePlans(){
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.get(this.GetActiveStoragePlansURL, opts);
  }
  
}
