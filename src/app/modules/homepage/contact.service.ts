import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private _HTTP : HttpClient
  ) { }

  private contactURL = environment.API_URL_HEAD + 'contact_us';

  ContactTeam(formdata : FormData){
    return this._HTTP.post(this.contactURL, formdata);
  }
}
