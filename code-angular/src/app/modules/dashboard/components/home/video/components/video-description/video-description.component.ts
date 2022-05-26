import { HttpErrorResponse } from '@angular/common/http';
import {  Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';
import { VideosService } from 'src/app/modules/dashboard/shared/video/videos.service';
import { RouteService } from '../../../shared/route.service';


@Component({
  selector: 'app-video-description',
  templateUrl: './video-description.component.html',
  styleUrls: ['./video-description.component.scss']
})
export class VideoDescriptionComponent implements OnInit {
  
  loadComponent: string = '';//store current active child component title
  even = false; 
  responseFeatures: any = [];//store response features
  objects: any[] = [];//store objects response
  labels: any;//store labels response
  texts : any;//stores text response
  speechs : any;//store speech response
  logos : any;//stores logos
  person : any;// store person
  shots : any;//store shots 
  explicit : any;//store explicit response
  faces : any[] = [];// stores face response
  facesData : any[] =[];//stores face data
  featuresSet = false;// bool to check if a feature is set
  timeStamp: any[] = [];// store timestamp
  timeStampCollective: any[] = [];//do the respective calculation and store timestamps
  showSpinner = false;//bool for spinner
  VideoData!:any;//store video related data
  Display = {'display': 'none'};//store ng style objects for modal
  showModal = false;//boolean to display modal
  EnableFeature = '';//stores feature that is to be enables
  availableFeatures: any[] = [];//store features that the user has opted when uploading the file
  notavailableFeatures: any[] = [];//store feautre that the user didnot opt when uploading the file
  isSample = false;//video is sample
  noleft = true; //toogle nav left arrow color
  noright = false;//toggle nav rigth arrow color
  timelineVideos : any[] = [];//store timeline videos
  videoLoaded = false;
  features = [
    {
      label : 'Label Detections',
      count : 0,
      active : false,
      feat : 'label_detection',
      processed : false,
      price : 0.1
    },
    {
      label : 'Shot Detections',
      count : 0,
      active : false,
      feat : "shot_detection",
      processed : false,
      price : 0.1
    },
    {
      label : 'Explicit Contents',
      count : 0,
      active : false,
      feat : "explicit_content_detection",
      processed : false,
      price : 0.1
    },
    {
      label : 'Speech Transcription',
      count : 0,
      active : false,
      feat : "speech_transcription",
      processed : false,
      price : 0.1
    },
    {
      label : 'Object Tracking',
      count : 0,
      active : false,
      feat : "object_tracking",
      processed : false,
      price : 0.1
    },
    {
      label : 'Text Detections',
      count : 0,
      active : false,
      feat : "text_detection",
      processed : false,
      price : 0.1
    },
    {
      label : 'Logo Detections',
      count : 0,
      active : false,
      feat : "logo_detection",
      processed : false,
      price : 0.1
    },
    {
      label : 'Face Detections',
      count : 0,
      active : false,
      feat : "face_detection",
      processed : false,
      price : 0.1
    },
    {
      label : 'Person Detections',
      count : 0,
      active : false,
      feat : "person_detection",
      processed : false,
      price : 0.1
    }
  ]
  @ViewChild('nav', {read: DragScrollComponent}) ds!: DragScrollComponent;
  
  constructor(
    private _VideoServices : VideosService,//reference to video service
    private _ToggleAlert: ToggleAlertService,// reference to alert service
    private _Router: Router
  ) { }

  VideoLoaded(){
    this.videoLoaded = true;
  }
  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }

  ngOnInit(): void {
    if(localStorage.getItem('isSample') === "true"){
      this.isSample = true;
    }
    this.showSpinner = true;
    this.loadVideoResponse();
    this._VideoServices.FeatureAdded$().subscribe(
      () => {
        this.AddVideoResponse();
      }
    );
  }
  SwitchFeature(name : any){
    for(let i = 0; i < 9; i++) {
      this.features[i].active = false;
    }
    for(let i = 0; i < 9; i++) {
      if(name === this.features[i].label){
        this.features[i].active = !this.features[i].active
      }
    }
    this.loadComponent = name;
    let index = -1;
      for(let i = 0; i < this.availableFeatures.length; i++){
        if(this.availableFeatures[i].label === this.loadComponent){
          index = i;
          break;
        }
      }   
      
      if(index > 0){
        this.ds.moveTo(index - 1);
      }
    this.setBoundingBox();
  }
  SwitchLabel(feat : string){
    this.SwitchFeature(feat);
  }
  
  scrollToRight() {
    this.ds.moveRight();
  }
  scrollToLeft() {
    this.ds.moveLeft();
  }
  indexChanged(ev : any){
    if(ev > 4){
      this.noright = true;
    }
    else if(ev === 0){
      this.noleft = true;
    }
    else{
      this.noleft = false;
      this.noright = false;
    }
  }

  setAvailableFeatureFromSelectedFeatures(selectedFeatures : string[]){
    this.features.forEach(
      (f : any) => {
        if(selectedFeatures.includes(f.feat)) {
          this.availableFeatures.push(f);
        }
        else{
          this.notavailableFeatures.push(f)
        }
      }
    );
    this.loadComponent = this.availableFeatures[0].label;
    this.availableFeatures[0].active = true;
    this.setBoundingBox();
  }
  addAvailableFeatureFromSelectedFeatures(selectedFeatures : string[]){
    const len = selectedFeatures.length;
    let flag = false;
    for(let i = 0; i < len; i++){
      this.availableFeatures.forEach(
        (f : any) => {
          if(selectedFeatures[len - 1] === f.feat){
            flag = true;
          }
        }
      );
      if(!flag){
        this.features.forEach(
          (f : any) => {
            if(selectedFeatures[len - 1] === f.feat) {
              this.availableFeatures.push(f);
            }
          }
        );
        this.notavailableFeatures.forEach(
          (f : any, i : number) => {
            if(selectedFeatures[len - 1] === f.feat){
              this.notavailableFeatures.splice(i, 1);
            }
          }
        );
      }
    }
  }
  
  setAvailableFeature() {
    this.features.forEach(
      (f:any) => {
        if(f.count > 0 || f.count === null){
          this.availableFeatures.push(f);
        }
        else{
          this.notavailableFeatures.push(f)
        }
      }
    );
    this.loadComponent = this.availableFeatures[0].label;
    this.availableFeatures[0].active = true;
    this.setBoundingBox();
  }
  
  sort(list : any){//sort data based on time
    const len = list.length;
    for (let i = 0; i < len-1; i++) {
      for (let j = 0; j < len-i-1; j++) {
        if (list[j].time > list[j+1].time) 
          { 
            const temp = list[j]; 
            list[j] = list[j+1]; 
            list[j+1] = temp; 
          } 
      }      
    }
  }

  faceData : any[] = [];
  detectPersons(data : any) {
    if(data.video_data.person_detection.length > 0) {
      if(data.video_data.person_detection[0].message){
        this.features.forEach(
          (f:any) => {
            if(f.label === 'Person Detections'){//if no content detected
              f.count = null;
              f.processed = true;
            }
          }
        );
      }
      else{
        this.person = data.video_data.person_detection;
        this.features.forEach(
          (f:any) => {
            if(f.label === 'Person Detections'){
              if(this.person[0].tracks.length === 1){//if single track
                f.count = 1;
                f.processed = true;
              }
              else{//if multiple tracks
                  this.person[0].tracks.forEach(
                    (tracks : any)=> {
                      tracks.timestamped_objects.forEach(
                        (data : any) => {
                          this.timeStamp.push({
                            time: data.time_offset,
                            bounding_poly: data.normalized_bounding_box
                          });
                        }
                      );
                    }
                  );
                  this.sort(this.timeStamp);
                  const len = this.timeStamp.length;
                  for(let i = 0; i < len - 1; i++ ){
                    var temp = [];
                    while(this.timeStamp[i].time === this.timeStamp[i+1].time){
                      temp.push(this.timeStamp[i]);
                      i++;
                      if(i === len - 2 || i === len - 1) {
                        break;
                      }
                    }
                    temp.push(this.timeStamp[i]);
                    this.timeStampCollective.push(temp);
                    if(i === len - 2){
                      temp = [];
                      temp.push(this.timeStamp[i + 1]);
                      this.timeStampCollective.push(temp);
                    }
                }
                let maxInnerLength = this.timeStampCollective[0].length;
                for(let i = 1; i < this.timeStampCollective.length; i++){
                  if(this.timeStampCollective[i].length > maxInnerLength){
                    maxInnerLength = this.timeStampCollective[i].length;
                  }
                }
                f.count = maxInnerLength;
                f.processed = true;
              }
            }
          }
        );
      }
    }
  }
  detectLogo(data : any){
    if(data.video_data.logo_detection.length > 0) {
      if(data.video_data.logo_detection[0].message){
        this.features.forEach(
          (f:any) => {
            if(f.label === 'Logo Detections'){//if no content detected
              f.count = null;
              f.processed = true;
            }
          }
        );
      }
      else{
        this.logos = data.video_data.logo_detection;
        this.features.forEach(
          (f:any) => {
            if(f.label === 'Logo Detections'){
              f.count = this.logos.length;
              f.processed = true;
            }
          }
        );
      }
    }
  }
  detectSpeech(data : any){
    if(data.video_data.speech_transcription === null){
      this.features.forEach(
        (f:any) => {
          if(f.label === 'Speech Transcription'){//if no content detected
            f.count = null;
            f.processed = true;
          }
        }
      );
    }
    else if(data.video_data.speech_transcription.length > 0) {
      this.speechs = data.video_data.speech_transcription;
      this.features.forEach(
        (f:any) => {
          if(f.label === 'Speech Transcription'){
            f.count = this.speechs.length;
            f.processed = true;
          }
        }
      );
    }
  }
  detectText(data : any){
    if(data.video_data.text_detection.length > 0) {
      if(data.video_data.text_detection[0].message){
        this.features.forEach(
          (f:any) => {
            if(f.label === 'Text Detections'){// if no content is detected
              f.count = null;
              f.processed = true;
            }
          }
        );
      }
      else{
        this.texts = data.video_data.text_detection;
        this.features.forEach(
          (f:any) => {
            if(f.label === 'Text Detections'){
              f.count = this.texts.length;
              f.processed = true;
            }
          }
        );
      }
    }
  }
  detectObjects(data: any){
    if(data.video_data.object_tracking.length > 0) {
      if(data.video_data.object_tracking[0].message){
        this.features.forEach(
          (f:any) => {
            if(f.label === 'Object Tracking'){//if no content detected
              f.count = null;
              f.processed = true;
            }
          }
        );
      }
      else{
        this.objects = data.video_data.object_tracking;
        this.features.forEach(
          (f:any) => {
            if(f.label === 'Object Tracking'){
              f.count = this.objects.length;
              f.processed = true;
            }
          }
        );
      }
    }
  }
  detectLabels(data : any){
    if(data.video_data.label_detection.length > 0) {
      if(data.video_data.label_detection[0].message){
        this.features.forEach(
          (f:any) => {
            if(f.label === 'Label Detections'){//if no content detected
              f.count = null;
              f.processed = true;
            }
          }
        );
      }
      else{
        this.labels = data.video_data.label_detection[0];
        this.features.forEach(
          (f:any) => {
            if(f.label === 'Label Detections'){
              f.count = data.video_data.label_detection[0].segment_label_annotations.length;
              f.processed = true;
            }
          }
        );
      }
    }
  }
  detectShots(data : any){
    if(data.video_data.shot_detection.length > 0) {
      if(data.video_data.shot_detection[0].message){
        this.features.forEach(
          (f:any) => {
            if(f.label === 'Shot Detections'){//if no content detected
              f.count = null;
              f.processed = true;
            }
          }
        );
      }
      else{
        this.shots = data.video_data.shot_detection;
        this.features.forEach(
          (f:any) => {
            if(f.label === 'Shot Detections'){
              f.count = this.shots.length;
              f.processed = true;
            }
          }
        );
      }
    }
  }
  detectExplicitContents(data : any){
    if(data.video_data.explicit_content_detection.length > 0) {
      if(data.video_data.explicit_content_detection[0].message){
        this.features.forEach(
          (f:any) => {
            if(f.label === 'Explicit Contents'){//if no content detected
              f.count = null;
              f.processed = true;
            }
          }
        );
      }
      else{
        this.explicit = data.video_data.explicit_content_detection;
        this.features.forEach(
          (f:any) => {
            if(f.label === 'Explicit Contents'){
              f.count = this.explicit.length;
              f.processed = true;
            }
          }
        );
      }
    }
  }
  detectFaces(data : any){
    if(data.video_data.face_detection.length > 0) {
      if(data.video_data.face_detection[0].message){
        this.features.forEach(
          (f:any) => {
            if(f.label === 'Face Detections'){//if no content detected
              f.count = null;
              f.processed = true;
            }
          }
        );
      }
      else{
        this.faces = data.video_data.face_detection;
        data.video_data.face_detection.forEach((tracks : any) => {
          tracks.tracks[0].timestamped_objects.forEach(
            (obj : any) => {
              //store attributes
              if(obj.attributes){
                obj.attributes.forEach(
                  (attr : any) => {
                    this.facesData.push(
                      {
                        name : attr.name,
                        confidence : Math.round(attr.confidence * 100).toString() + '%',
                        time : obj.time_offset,
                        time_diff : tracks.tracks[0]['end_time'] - tracks.tracks[0]['start_time'],
                        end_time : tracks.tracks[0]['end_time'],
                        start_time: tracks.tracks[0]['start_time'],
                        active : false,
                        confidence_value : Math.round(attr.confidence * 100)
                      }
                    );
                  }
                )
              }
          });
        });
        this.features.forEach(
          (f:any) => {
            if(f.label === 'Face Detections'){
              this.timeStamp = [];
              this.timeStampCollective = [];
              if(this.faces.length === 1){
                f.count = 1;
                f.processed = true;
              }
              else{
                this.faces.forEach(
                  (tracks : any)=> {
                    tracks.tracks[0].timestamped_objects.forEach(
                      (data : any) => {
                        this.timeStamp.push({
                          time: data.time_offset,
                          bounding_poly: data.normalized_bounding_box[0]
                        });
                      }
                    );
                  }
                );
                this.sort(this.timeStamp);
                const len = this.timeStamp.length;
                for(let i = 0; i < len - 1; i++ ){
                  var temp = [];
                  while(this.timeStamp[i].time === this.timeStamp[i+1].time){
                    temp.push(this.timeStamp[i]);
                    i++;
                    if(i === len - 2 || i === len - 1) {
                      break;
                    }
                  }
                  temp.push(this.timeStamp[i]);
                  this.timeStampCollective.push(temp);
                  if(i === len - 2){
                    temp = [];
                    temp.push(this.timeStamp[i + 1]);
                    this.timeStampCollective.push(temp)
                  }
                }
                let maxInnerLength = this.timeStampCollective[0].length;
                for(let i = 1; i < this.timeStampCollective.length; i++){
                  if(this.timeStampCollective[i].length > maxInnerLength){
                    maxInnerLength = this.timeStampCollective[i].length;
                  }
                }
                f.count = maxInnerLength;
                f.processed = true;
              }
            }
          }
        );
      }
    }
  }
  ProcessVideoResponse(data : any){
    //Person
    this.detectPersons(data);
    //Logo
    this.detectLogo(data);
    //speech
    this.detectSpeech(data);
    //text
    this.detectText(data);
    //objects
    this.detectObjects(data);
    // labels
    this.detectLabels(data);
    // shots
    this.detectShots(data);
    // Explicit Content
    this.detectExplicitContents(data);
    // Face
    this.detectFaces(data);
  }
  checkErr(err : HttpErrorResponse){
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
    }
  }
  AddVideoResponse(){
    this._VideoServices.GetVideoInfo(localStorage.getItem('OpenVideoID')).subscribe(
      (data : any) => {
        this.addAvailableFeatureFromSelectedFeatures(data.video_data.selected_features);
        this.ProcessVideoResponse(data);
                
      },
      (err : HttpErrorResponse) => {
        this.checkErr(err);
      }
    );
  }
  loadVideoResponse() {
    if(this.isSample){
      this._VideoServices.GetSampleVideoResponse(localStorage.getItem('OpenVideoID')).subscribe(
        (data : any) => {
          this.showSpinner = false;
          this.loadVideo();
          this.ProcessVideoResponse(data);
          this.featuresSet = true;
          this.setAvailableFeature();        
        },
        (err : HttpErrorResponse) => {
          this.checkErr(err);
          this.showSpinner = false;
        }
      );
    }
    else{
      this._VideoServices.GetVideoInfo(localStorage.getItem('OpenVideoID')).subscribe(
        (data : any) => {
          this.showSpinner = false;
          this.loadVideo();
          this.ProcessVideoResponse(data);
          this.featuresSet = true;
          this.setAvailableFeatureFromSelectedFeatures(data.video_data.selected_features);        
        },
        (err : HttpErrorResponse) => {
          this.checkErr(err);
          this.showSpinner = false;
        }
      );
    }
  }
  
  StoreTimelineVideos(video : any, isSample : boolean, isCurrent : boolean) {
    this.timelineVideos.push({
      thumbnail_video : video.thumbnail_video,
      status : video.status,
      name : video.name,
      original_name : video.original_name,
      id : video.id,
      isSample : isSample,
      isCurrent : isCurrent
    });
  }

  loadVideo() {
    this._VideoServices.GetVideo().subscribe(
      (data: any) => {
        data.video_data.forEach(
          (v:any)=>{
            v.videos.forEach((element:any) => {
              if(`${element.id}` === `${localStorage.getItem('OpenVideoID')}`){
                this.StoreTimelineVideos(element, false, true);
              }
              else{
                this.StoreTimelineVideos(element, false, false);
              }
              
            });
            
          }
        );
        data.sample_video_data.forEach(
          (v:any)=>{
            if(`${v.id}` === `${localStorage.getItem('OpenVideoID')}`){
              this.StoreTimelineVideos(v, true, true);
            }
            else{
              this.StoreTimelineVideos(v, true, false);
            }       
          }
        );
      },
      (err : HttpErrorResponse)=> {
        this.checkErr(err);
      }
    );
  }

  setBoundingBox(){
    for(let i = 0; i< this.availableFeatures.length;i++){
      if(this.loadComponent === 'Person Detections'){
        this.VideoData = this.person;
        break;     
      }
      if(this.loadComponent === 'Logo Detections'){
        this.VideoData = this.logos;
        break;     
      }
      if(this.loadComponent === 'Face Detections'){
        this.VideoData = this.faces;
        break;     
      }
      if(this.loadComponent === 'Object Tracking'){
        this.VideoData = this.objects;
        break;     
      }
      if(this.loadComponent === 'Text Detections'){
        this.VideoData = this.texts;
        break;     
      }
    }    
  }
  
  Enable(Feature : any){
    this.EnableFeature = Feature;
    if(!this.showModal){
      this.Display = {'display': 'block'};
    }
    else{
      this.Display = {'display': 'none'};
    }
    this.showModal = !this.showModal;
  }

  Discard() {
    if(!this.showModal){
      this.Display = {'display': 'block'};
    }
    else{
      this.Display = {'display': 'none'};
    }
    this.showModal = !this.showModal;
  }
  AddFeature(feature : any){
    let enableFeature = '';
    switch (feature) {
      case 'Shot Detections':
        enableFeature = 'shot_detection';
        break;
      case 'Label Detections':
        enableFeature = 'label_detection';
        break;
      case 'Speech Transcription':
        enableFeature = 'speech_transcription';
        break;
      case 'Explicit Contents':
        enableFeature = 'explicit_content_detection';
        break;
      case 'Object Tracking':
        enableFeature = 'object_tracking';
        break;
      case 'Text Detections':
        enableFeature = 'text_detection';
        break;
      case 'Logo Detections':
        enableFeature = 'logo_detection';
        break;
      case 'Person Detections':
        enableFeature = 'person_detection';
        break;
      case 'Face Detections':
        enableFeature = 'face_detection';
        break;
    }
    const id = localStorage.getItem('OpenVideoID');
    if(enableFeature.length > 0){
      this._VideoServices.AddFeature(id, enableFeature).subscribe(//call api method to add feature to video
        (res :any)=>{
          if(res['success']){
            this.ThrowSuccessMessage("Feature Enabled");
            this.Display = {'display': 'none'};
          }
        },
        (err : HttpErrorResponse)=> {
         this.checkErr(err);
        }
      );
    }

  }

  ShowDeleteModal = false;
  deleting = false;
  DeleteBtn = false;
  ShowDeleteBtn(){
    this.DeleteBtn = true;
  }
  HideDeleteBtn(){
    this.DeleteBtn = false;
  }
  ToggleDeleteModal(){
    this.ShowDeleteModal = !this.ShowDeleteModal;
  }
  DeleteVideo(){
    this.deleting = true;
    this._VideoServices.DeleteVideo(localStorage.getItem('OpenVideoID')).subscribe(
      (res : any) => {
        if(res['success']){
          this.ThrowSuccessMessage("Video Deleted Successfully!");
          this.deleting = false;
          this.SwitchVideo();
        }
      },
      (err : HttpErrorResponse) => {
        this.deleting = false;
        this.checkErr(err);
      }
    );
  }
  RouteToDetails(){
    this._Router.navigate([`/home/videoDetails/${localStorage.getItem('OpenVideoID')}`]);
    this._Router.routeReuseStrategy.shouldReuseRoute = function () { //important reload function
      return false;
    };
  }
  SwitchVideo(){
    const len = this.timelineVideos.length;
    for(let i = 0; i < len; i++){
      if(this.timelineVideos[i].isCurrent){

        if(this.timelineVideos[i + 1].isSample){
          localStorage.setItem('isSample', 'true')
        }
        else{
          localStorage.setItem('isSample', 'false')
        }
        const name = this.timelineVideos[i+1].name.split('/')[this.timelineVideos[i+1].name.split('/').length - 1]
        localStorage.setItem('OpenVideoID', `${this.timelineVideos[i+1].id}`);
        localStorage.setItem('OpenVideoTitle',`${name}`);
        this.RouteToDetails();
        break;
      }
    }
  }
}
