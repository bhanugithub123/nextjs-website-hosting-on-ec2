import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalResultService {

  token !: string | null;

  private GetStatusDetailsURL = environment.API_URL_HEAD + "status_details";
  private GetTotalEarnedAmountURL = environment.API_URL_HEAD + "total_amount";
  private GetMostFeatureUsedImagesURL = environment.API_URL_HEAD + "image_analysis_features";
  private GetMostFeatureUsedVideosURL = environment.API_URL_HEAD + "video_analysis_features";
  private GetProfitPriceURL = environment.API_URL_HEAD + "feature_amount";
  private GetChartInfoURL = environment.API_URL_HEAD + 'profit_loss_graph';
  constructor(private _HTTP : HttpClient) { 
    if(sessionStorage.getItem('Token') === null) {
      this.token = localStorage.getItem('Token')
    }
    else {
      this.token = sessionStorage.getItem('Token');
    }
  }

  GetStatusDetails(){
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.post(this.GetStatusDetailsURL,null, opts); 
  }

  GetEarningDetails(){
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.get(this.GetTotalEarnedAmountURL, opts); 
  }

  GetImageFeatureUsageDetails(){
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.get(this.GetMostFeatureUsedImagesURL, opts); 
  }

  GetVideoFeatureUsageDetails(){
    const opts = {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.get(this.GetMostFeatureUsedVideosURL, opts); 
  }

  GetProfitPrice(feature : string, file_type : string){
    const opts = {
      params : new HttpParams({
        fromString : `feature=${feature}&file_type=${file_type}`
      }),
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.get(this.GetProfitPriceURL, opts); 
  }
  GetChartInfo(year : string, month : string){
    const opts = {
      params : new HttpParams({
        fromString : `year=${year}&month=${month}`
      }),
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + this.token
      })
    }
    return this._HTTP.get(this.GetChartInfoURL, opts); 
  }


}
