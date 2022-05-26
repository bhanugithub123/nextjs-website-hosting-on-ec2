import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class VideosService {
  private deleteVideoURL = environment.API_URL_HEAD + 'delete_video';
  token!: any;
  private _FileDeleted$ = new Subject<void>();
  private _FeatureAdded$ = new Subject<void>();
  private getVideosURL = environment.API_URL_HEAD + 'get_videos';
  private GetVideoInfoURL = environment.API_URL_HEAD + 'video_response';
  private addFeatureURL = environment.API_URL_HEAD + 'add_video_feature';
  private SampleVideoResponseURL = environment.API_URL_HEAD + 'sample_video';
  videoData : any [] = []; //stores all the video data until page is reloaded
  sampleVideoData : any [] = []; //stores all the sample video data until page is reloaded
  private _VideoJumpTime$ = new Subject<string>();
  public _RefreshNeeded$ = new Subject<void>();
  public _SelectAll$ = new Subject<void>();
  fileIds = new Set();
  private _fileSelected$ = new Subject<void>();
  private _filesSelectable$ = new Subject<boolean>();
  public _UnselectAll$ = new Subject<void>();

  get SelectAll$(){
    return this._SelectAll$;
  }
  get Selectable$(){
    return this._filesSelectable$;
  }
  get UnselectAll$(){
    return this._UnselectAll$;
  }
  get FileSelected$(){
    return this._fileSelected$;
  }
  FileSelected(){
    this._fileSelected$.next();
  }
  FileSelectable(status: boolean){
    this._filesSelectable$.next(status);
  }
  get RefreshNeeded$(){
    return this._RefreshNeeded$;
  }
  getVideoTime$(){
    return this._VideoJumpTime$;
  }
  

  JumpVideo(time : string){
    this._VideoJumpTime$.next(time);
  }
  
  FileDeleted$(){
    return this._FileDeleted$;
  }

  FeatureAdded$(){
    return this._FeatureAdded$;
  }

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

  GetVideo() {
    this.storeToken();
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.post(this.getVideosURL,null, opts);
  }

  GetVideoInfo(id : any) {
    let formData = new FormData();
    formData.append('video_id', `${id}`);

    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }

    return this._HTTP.post(this.GetVideoInfoURL, formData, opts);
  }
  VideoDeleted(){
    this._FileDeleted$.next();
  }
  // delete video api call
  DeleteVideo(id: any) {
    let formData = new FormData();
    formData.append('video_id', `${id}`);
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.post(this.deleteVideoURL, formData, opts);
  }

  AddFeature(id:any, feature : string){
    let payload = new FormData();
    payload.append('video_id', id);
    payload.append('video_feature', feature);
    payload.append('feature_price', '0');
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.post(this.addFeatureURL, payload, opts).pipe(
      tap(
        () => {
          this._FeatureAdded$.next();
        }
      )
    );
  }
  GetSampleVideoResponse(id: string | null){
    const payload = new FormData();
    payload.append('video_id', `${id}`);
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.post(this.SampleVideoResponseURL, payload, opts);
  }

  LoadVideo(){
    if(`${localStorage.getItem('isSample')}` === 'true'){
      return this._HTTP.get(environment.API_URL_HEAD + 'render_sample_video', {
        params: new HttpParams({
              fromString : `path=${localStorage.getItem("OpenVideoTitle")}`
        }),
        headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.token}`,
        
        }),
        responseType : 'blob'
      });
    }
    else{
      if(localStorage.getItem('User_id')){
        return this._HTTP.get(environment.API_URL_HEAD +'render_videos', {
          params: new HttpParams({
                fromString : `path=${localStorage.getItem("OpenVideoTitle")}&user_id=${localStorage.getItem('User_id')}`
          }),
          headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`,
          
          }),
          responseType : 'blob'
        });
      }
      else{
        return this._HTTP.get(environment.API_URL_HEAD +'render_videos', {
          params: new HttpParams({
                fromString : `path=${localStorage.getItem("OpenVideoTitle")}&user_id=${sessionStorage.getItem('User_id')}`
          }),
          headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`,
          
          }),
          responseType : 'blob'
        });
      }
    }
  }

  downloadXLS_URL = environment.API_URL_HEAD + 'video_excel';

  DownloadXLS(id : string, file_type : string) {
    return this._HTTP.get(this.downloadXLS_URL, {
      params: new HttpParams({
        fromString : `file_id=${id}&file_type=` + file_type
      }),
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      }),
      responseType : 'blob'
    });
  }

  downloadPDF_URL = environment.API_URL_HEAD + 'video_pdf';

  DownloadPDF(id : string, file_type : string) {
    return this._HTTP.get(this.downloadPDF_URL, {
      params: new HttpParams({
        fromString : `video_id=${id}&video_type=` + file_type
      }),
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      }),
      responseType : 'blob'
    });
  }
  downloadJSON_URL = environment.API_URL_HEAD + 'file_json';

  DownloadJSON(id : string, file_type : string) {
    return this._HTTP.get(this.downloadJSON_URL, {
      params: new HttpParams({
        fromString : `file_id=${id}&file_type=` + file_type
      }),
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      }),
      responseType : 'blob'
    });
  }
}

