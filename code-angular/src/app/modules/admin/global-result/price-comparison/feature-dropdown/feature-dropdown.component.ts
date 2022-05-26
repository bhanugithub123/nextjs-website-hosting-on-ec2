import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';
import { GlobalResultService } from '../../../shared/global-result.service';

@Component({
  selector: 'feature-dropdown',
  templateUrl: './feature-dropdown.component.html',
  styleUrls: ['./feature-dropdown.component.scss']
})
export class FeatureDropdownComponent implements OnInit {

  constructor(
    private _GlobalResultService : GlobalResultService,//reference to global result service
    private _ToggleAlert : ToggleAlertService
  ) { }

  ngOnInit(): void {
  }

  selectedFeature = '';
  currentFeature = '';
  file_type = '';
  ai4u_amount = -1;
  google_amount = -1;

  features = [
    {
      label : 'Label detection(Video)',
      feature : 'label_detection',
      active : false,
      file_type : 'video'
    },
    {
      label : 'Shot detection(Video)',
      feature : 'shot_detection',
      active : false,
      file_type : 'video'
    },
    {
      label : 'Explicit content detection(Video)',
      feature : 'explicit_content_detection',
      active : false,
      file_type : 'video'
    },
    {
      label : 'Speech Transcription(Video)',
      feature : 'speech_transcription',
      active : false,
      file_type : 'video'
    },
    {
      label : 'Object Tracking(Video)',
      feature : 'object_tracking',
      active : false,
      file_type : 'video'
    },
    {
      label : 'Text detection(Video)',
      feature : 'text_detection',
      active : false,
      file_type : 'video'
    },
    {
      label : 'Logo detection(Video)',
      feature : 'logo_detection',
      active : false,
      file_type : 'video'
    },
    {
      label : 'Face Detection(Video)',
      feature : 'face_detection',
      active : false,
      file_type : 'video'
    },
    {
      label : 'Person Detection(Video)',
      feature : 'person_detection',
      active : false,
      file_type : 'video'
    },
    {
      label : 'Label detection(Image)',
      feature : 'label_detection',
      active : false,
      file_type : 'image'
    },
    {
      label : 'Web detection(Image)',
      feature : 'web_detection',
      active : false,
      file_type : 'image'
    },
    {
      label : 'Safe Search detection(Image)',
      feature : 'safe_search_detection',
      active : false,
      file_type : 'image'
    },
    {
      label : 'Land Detection(Image)',
      feature : 'landmark_detection',
      active : false,
      file_type : 'image'
    },
    {
      label : 'Object Localization(Image)',
      feature : 'object_localization',
      active : false,
      file_type : 'image'
    },
    {
      label : 'Text detection(Image)',
      feature : 'text_detection',
      active : false,
      file_type : 'image'
    },
    {
      label : 'Logo detection(Image)',
      feature : 'logo_detection',
      active : false,
      file_type : 'image'
    },
    {
      label : 'Face Detection(Image)',
      feature : 'facial_detection',
      active : false,
      file_type : 'image'
    },
    {
      label : 'Image Properties(Image)',
      feature : 'image_properties',
      active : false,
      file_type : 'image'
    }
  ]

  OnChange(event : any){
    let flag = true;
    for(let i = 0; i < this.features.length; i++){
      if(this.features[i].feature === event.target.value){
        this.currentFeature = this.features[i].label;
        this.selectedFeature = this.features[i].feature;
        this.file_type = this.features[i].file_type;
        this.LoadProfits();
        flag = false;
        break;
      }
    }
    if(flag){
      this.selectedFeature = '';
      this.file_type = '';
      this.google_amount = -1;
      this.ai4u_amount = -1;
      this.currentFeature = '';
    }
  }

  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }

  LoadProfits(){
    this._GlobalResultService.GetProfitPrice(this.selectedFeature, this.file_type).subscribe(
      (res : any) => {
        if(res.success){
          this.ai4u_amount = res.ai4u_amount;
          this.google_amount = res.google_amount;
        }        
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
