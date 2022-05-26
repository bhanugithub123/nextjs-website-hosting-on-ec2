import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';
import { GlobalResultService } from '../../shared/global-result.service';

@Component({
  selector: 'most-used-video-feature',
  templateUrl: './most-used-video-feature.component.html',
  styleUrls: ['./most-used-video-feature.component.scss']
})
export class MostUsedVideoFeatureComponent implements OnInit {

  total = 0;
  
  FeatureObject = {
    label : '0',
    face : '0',
    person : '0',
    safe : '0',
    logo : '0',
    object : '0',
    shot: '0',
    text: '0',
    speech : '0'
  };
  FeatureObjectPercentage = {
    label : '0',
    face : '0',
    person : '0',
    safe : '0',
    logo : '0',
    object : '0',
    shot: '0',
    text: '0',
    speech : '0'
  };

  constructor(
    private _GlobalResult : GlobalResultService,//reference to global result service
    private _ToggleAlert : ToggleAlertService// reference to toggle alert service
  ) { }

  ngOnInit(): void {
    this.GetFeatureUsage();
  }
  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }

  GetFeatureUsage(){
    this._GlobalResult.GetVideoFeatureUsageDetails().subscribe(
      (res : any) => {
        // save count in local variable
        this.FeatureObject.face = res.message[0].face_detection;
        this.FeatureObject.label = res.message[0].label_detection;
        this.FeatureObject.logo = res.message[0].logo_detection;
        this.FeatureObject.safe = res.message[0].explicit_content_detection;
        this.FeatureObject.object = res.message[0].object_tracking;
        this.FeatureObject.person = res.message[0].person_detection;
        this.FeatureObject.shot = res.message[0].shot_detection;
        this.FeatureObject.speech = res.message[0].speech_transcription;
        this.FeatureObject.text = res.message[0].text_detection;
        //calculate total feature used
        this.total = parseInt(this.FeatureObject.face) + parseInt(this.FeatureObject.label) + parseInt(this.FeatureObject.logo) + parseInt(this.FeatureObject.safe) + parseInt(this.FeatureObject.speech) + parseInt(this.FeatureObject.text) + parseInt(this.FeatureObject.shot) + parseInt(this.FeatureObject.person) + parseInt(this.FeatureObject.object); 
        //calculate percentage of each feature
        setTimeout(() => {
          this.FeatureObjectPercentage.face = Math.floor((parseInt(this.FeatureObject.face) / this.total) * 100).toString();
          this.FeatureObjectPercentage.label = Math.floor((parseInt(this.FeatureObject.label) / this.total) * 100).toString();
          this.FeatureObjectPercentage.logo = Math.floor((parseInt(this.FeatureObject.logo) / this.total) * 100).toString();
          this.FeatureObjectPercentage.safe = Math.floor((parseInt(this.FeatureObject.safe) / this.total) * 100).toString();
          this.FeatureObjectPercentage.object = Math.floor((parseInt(this.FeatureObject.object) / this.total) * 100).toString();
          this.FeatureObjectPercentage.person = Math.floor((parseInt(this.FeatureObject.person) / this.total) * 100).toString();
          this.FeatureObjectPercentage.shot = Math.floor((parseInt(this.FeatureObject.shot) / this.total) * 100).toString();
          this.FeatureObjectPercentage.speech = Math.floor((parseInt(this.FeatureObject.speech) / this.total) * 100).toString();
          this.FeatureObjectPercentage.text = Math.floor((parseInt(this.FeatureObject.text) / this.total) * 100).toString();
        }, 500);
      },
      (err : HttpErrorResponse) => {
        if(err.error.non_field_errors){
          this.ThrowErrorMessage(err.error.non_field_errors[0]);
        }
        else if(err.status === 0){
          this.ThrowErrorMessage("Address Not Reachable.Please Try Again!")
        }
        else if(err.status === 504){
          this.ThrowErrorMessage("Server Not Responding.Please Try Again!")
        }
        else if(err.status === 500){
          this.ThrowErrorMessage("Internal Server Error.Please Try Again!")
        }
        else if(err.status === 400){
          this.ThrowErrorMessage("Bad Request!")
        }
        else{
          this.ThrowErrorMessage("Oops Something Went Wrong. Please Try Again!");
        };
      }
    );
  }

}
