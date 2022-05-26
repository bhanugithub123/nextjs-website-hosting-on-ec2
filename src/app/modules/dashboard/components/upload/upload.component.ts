import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadFileService } from '../../shared/upload/upload-file.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  ImageCompBool = false;//store true if image upload component active
  VideoCompBool = true;//stores true if video upload component active
  constructor(private _UploadFileService : UploadFileService, private _Router : Router) { 
   
  }

  ngOnInit(): void {
    if(this._Router.url.includes('image')){
      this.SwitchToImage();
    }
  }
  //change component to image 
  SwitchToImage(){
    if(this.VideoCompBool){
      this.VideoCompBool = false;
      this.ImageCompBool = true;
      this.imageIcon = true;
      this.videoIcon = false;
    }
    
  }
  ImageUploaded(){
    this._UploadFileService.currentComponentImage = true;
    this._UploadFileService.currentComponentVideo = false;
  }
  // change component to video
  SwitchToVideo() {
    if(this.ImageCompBool) {
      this.VideoCompBool = true;
      this.ImageCompBool = false;
      this.videoIcon = true;
      this.imageIcon = false;
    }
    
  }
  VideoUploaded(){
    this._UploadFileService.currentComponentImage = false;
    this._UploadFileService.currentComponentVideo = true;
  }
  videoIcon = true;
  ToggleVideoIcon(){
    if(!this.VideoCompBool){
      this.videoIcon = !this.videoIcon;
    }
  }
  imageIcon = false;
  ToggleImageIcon(){
    if(!this.ImageCompBool){
      this.imageIcon = !this.imageIcon;
    }
  }

}
