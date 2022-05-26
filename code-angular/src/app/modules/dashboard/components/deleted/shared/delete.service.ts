import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeleteService {

  token : any;
  constructor(private _HTTP: HttpClient) {

    if(sessionStorage.getItem('Token') === null) {
      this.token = localStorage.getItem('Token')
    }
    else {
      this.token = sessionStorage.getItem('Token');
    }
   }

  DeleteURL = environment.API_URL_HEAD + 'deleted_videos';

  LoadDeletedVideos() {

    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }

    return this._HTTP.post(this.DeleteURL, '', opts);
  }

  loadDeletedImagesURL = environment.API_URL_HEAD + 'deleted_images';
  loadDeletedImages(){
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }

    return this._HTTP.post(this.loadDeletedImagesURL, '', opts);
  }
}
