import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  private _refreshNeeded$ = new Subject<void>();
  public _Discarded$ = new Subject<void>();
  public _EnableSave$ = new Subject<boolean>();
  private _hideUpload$ = new Subject<void>();
  private _showUpload$ = new Subject<void>();
  token!: any;
  //upload image url
  upload_Image_Url = environment.API_URL_HEAD + 'image_upload';
  //remove image url
  remove_Image_Url = environment.API_URL_HEAD + 'image_remove';
  //get image url
  image_Url = environment.API_URL_HEAD + 'image_upload';
  changePasswordURL = environment.API_URL_HEAD + 'change_password';
  profile_image_url = '';
  get refreshNeeded$() {
    return this._refreshNeeded$;
  }
  get Discarded$() {
    return this._Discarded$;
  }
  get hideUpload$() {
    return this._hideUpload$;
  }
  get EnableSave$() {
    return this._EnableSave$;
  }

  setHideUpload$() {
    localStorage.setItem('showUpload', 'false');
    this._hideUpload$.next();
  }

  get showUpload$() {
    return this._showUpload$;
  }

  setShowUpload$() {
    localStorage.setItem('showUpload', 'true');
    this._showUpload$.next();
  }

  constructor(private http : HttpClient) { 
    if(sessionStorage.getItem('Token') === null) {
      this.token = localStorage.getItem('Token');
    }
    else {
      this.token = sessionStorage.getItem('Token');
    }
  }

  //upload image api call method
  Upload_Image(file : File) {
    const picData = new FormData();
    picData.append('image', file, file.name);
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }

    return this.http.post(this.upload_Image_Url, picData, opts).pipe(
      tap(
        () => {
          this.refreshNeeded$.next();
        }
      )
    );
  }

  //remove image api call method
  Remove_Image() {
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }

    return this.http.get(this.remove_Image_Url, opts).pipe(
      tap(
        () => {
          this.refreshNeeded$.next();
        }
      )
    );
  }

  //api method call
  Get_Image() {
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }

    return this.http.get(this.image_Url, opts);
  }

  ChangePassword(passwordData : any){
    let PasswordData = new FormData;
    PasswordData.append('old_password', passwordData.oldpassword);
    PasswordData.append('confirm_password', passwordData.confirmpassword);
    PasswordData.append('new_password', passwordData.newpassword);

    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }

    return this.http.post(this.changePasswordURL, PasswordData, opts);
  }
}
