import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserResultService {
  token !: string | null;

  private GetUserListURL = environment.API_URL_HEAD + "get_users";
  private GetUserDetailsURL = environment.API_URL_HEAD + "account_details";
  private BlockUserURL = environment.API_URL_HEAD + "block_unblock_user";
  private GetVideoFeaturesDetailsURL = environment.API_URL_HEAD + "get_video_features";
  private GetImageFeaturesDetailsURL = environment.API_URL_HEAD + "get_image_features";
  private _refereshNeeded$ = new Subject<void>();
  private _SearchString$ = new Subject<string>();
  CurrentPageNumber = 1;

  onSearchInput(input : string){
    this._SearchString$.next(input);
  }

  get SearchString$(){
    return this._SearchString$;
  }

  get refereshNeeded$(){
    return this._refereshNeeded$;
  }

  constructor(private _HTTP : HttpClient) { 
    if(sessionStorage.getItem('Token') === null) {
      this.token = localStorage.getItem('Token')
    }
    else {
      this.token = sessionStorage.getItem('Token');
    }
  }

  //get user list
  GetUsers(){
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.post(this.GetUserListURL,null, opts); 
  }

  //get user details
  GetUserDetails(id : number){
    const opts = {
      params : new HttpParams({
        fromString : `user_id=${id}`
      }),
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.get(this.GetUserDetailsURL, opts); 
  }

  //block user
  BlockUser(id : number, status : boolean){
    const formdata = new FormData;
    formdata.append('user_id', JSON.stringify(id));
    formdata.append('status', JSON.stringify(status));

    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.post(this.BlockUserURL,formdata, opts).pipe(
      tap(
        () => {
          this._refereshNeeded$.next();
        }
      )
    ); 
  }

  GetVideoFeaturesDetails(id : number, fromdate : string, todate : string){
    const opts = {
      params : new HttpParams({
        fromString : `user_id=${id}&From=${fromdate}&to=${todate}`
      }),
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.get(this.GetVideoFeaturesDetailsURL, opts); 
  }

  GetImageFeaturesDetails(id : number, fromdate : string, todate : string){
    const opts = {
      params : new HttpParams({
        fromString : `user_id=${id}&From=${fromdate}&to=${todate}`
      }),
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.get(this.GetImageFeaturesDetailsURL, opts); 
  }

}
