import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  private _FileUploaded$ = new Subject<void>();
  private _ClosePopup$ = new Subject<void>();
  private _Done$ = new Subject<void>();
  // video data 
  videoFiles : any[] = [];//video files to be uploaded
  UploadedVideoFiles : any[] = [];//video files uploaded
  videoFeatures : any[] = [];
  selectedVideoLabels : any[] = [];
  totalPriceVideos : number = 0;
  uploadVideoBtn = false;
  currentComponentVideo = true;
  // Image data 
  imageFiles : any[] = [];//image files to be uploaded
  UploadedImageFiles : any[] = [];//images uploaded
  imageFeatures : any[] = [];
  selectedImageLabels : any[] = [];
  totalPriceImages : number = 0;
  uploadImageBtn = false;
  currentComponentImage = false;

  FileUploaded$(){
    return this._FileUploaded$;
  }

  Uploaded() {
    this._FileUploaded$.next();
  }

  ClosePopup$(){
    return this._ClosePopup$;
  }

  Close() {
    this._ClosePopup$.next();
  }
  Done$(){
    return this._Done$;
  }

  Done() {
    this._Done$.next();
  }

  token!: string | null;
  StoreToken(){
    if(sessionStorage.getItem('Token') === null) {
      this.token = localStorage.getItem('Token')
    }
    else {
      this.token = sessionStorage.getItem('Token');
    }
  }
  constructor(private _HTTP : HttpClient) {
    this.StoreToken();
   }

  uploadURL = environment.API_URL_HEAD + 'image_video_upload';

  UploadFile(file : File, features: string) : Observable<HttpEvent<any>> {
    let formData = new FormData();
    formData.append("file", file, file.name);
    formData.append('features', features);
    formData.append('features_price', '0');
    const req = new HttpRequest('POST', this.uploadURL, formData, {
      reportProgress: true,
      responseType: 'json',
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      }) 
    });

    return this._HTTP.request(req);
  }

  CheckUploadStatus = environment.API_URL_HEAD + 'uploaded_file_details';
  CheckStatus(type : string, duration : string, size : string, price : string){
    this.StoreToken();
    var formData = new FormData();
    formData.append('file_type' , 'video');
    formData.append('video_duration' , '28.266666');
    formData.append('features_price' , '.1');
    formData.append('file_size' , '8065103');
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      }) 
    }
    return this._HTTP.post(this.CheckUploadStatus, formData, opts);
  }
}
