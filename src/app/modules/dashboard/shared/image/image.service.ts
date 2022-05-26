import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  token!: any;
  private _FileDeleted$ = new Subject<void>();
  private _FeatureAdded$ = new Subject<void>();
  private AddFeatureURL = environment.API_URL_HEAD + 'add_image_feature';
  private GetImagesURL = environment.API_URL_HEAD + 'get_images';
  private GetImageResponseURL = environment.API_URL_HEAD + 'image_response';
  private GetImageURL = environment.API_URL_HEAD + 'render_image';
  private SampleImageResponseURL = environment.API_URL_HEAD + 'sample_image';
  private DeleteImageURL = environment.API_URL_HEAD + 'delete_image';
  ImageData : any [] = []; //stores all the image data until page is reloaded
  sampleImageData : any [] = []; //stores all the image data until page is reloaded
  private _fileSelected$ = new Subject<void>();
  public _SelectAll$ = new Subject<void>();
  public _UnselectAll$ = new Subject<void>();
  private _filesSelectable$ = new Subject<boolean>();

  get Selectable$(){
    return this._filesSelectable$;
  }
  get SelectAll$(){
    return this._SelectAll$;
  }
  SelectAll(){
    this._SelectAll$.next();
  }
  get UnselectAll$(){
    return this._UnselectAll$;
  }
  FileDeleted$(){
    return this._FileDeleted$;
  }
  FileSelectable(status: boolean){
    this._filesSelectable$.next(status);
  }
  FeatureAdded$(){
    return this._FeatureAdded$;
  }
  get FileSelected$(){
    return this._fileSelected$;
  }
  FileSelected(){
    this._fileSelected$.next();
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
  fileIds = new Set();
  GetImages() {
    this.storeToken();
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.post(this.GetImagesURL,null, opts);
  }

  GetImageInfo(id : string | null) {
    const payload = new FormData();
    payload.append('image_id', `${id}`);
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.post(this.GetImageResponseURL, payload, opts);
  }
  
  GetImage(path : string | null){
    const opts = {
      params: new HttpParams({
        fromString: 'path=' + `${path?.split('=')[1]}`
      }),
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.get(this.GetImageURL, opts);
  }
  ImageDeleted(){
    this._FileDeleted$.next();
  }
  DeleteImage(id : string){
    let formData = new FormData();
    formData.append('image_id', `${id}`);

    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }

    return this._HTTP.post(this.DeleteImageURL, formData, opts);
  }

  
  AddFeature(id:any, feature : string, price : string){
    let payload = new FormData();
    payload.append('image_id', id);
    payload.append('image_feature', feature);
    payload.append('feature_price', price);
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }

    return this._HTTP.post(this.AddFeatureURL, payload, opts).pipe(
      tap(
        () => {
          this._FeatureAdded$.next();
        }
      )
    );
  }

  GetSampleImageResponse(id: string | null){
    const payload = new FormData();
    payload.append('image_id', `${id}`);
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.post(this.SampleImageResponseURL, payload, opts);
  }

  //store other images
  OtherImagesCardList: any = [];

  downloadXLS_URL = environment.API_URL_HEAD + 'image_excel';

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

  downloadPDF_URL = environment.API_URL_HEAD + 'image_pdf';

  DownloadPDF(id : string, file_type : string) {
    return this._HTTP.get(this.downloadPDF_URL, {
      params: new HttpParams({
        fromString : `image_id=${id}&image_type=` + file_type
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
