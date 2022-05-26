import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToggleAlertService } from '../../../shared/toggle-alert.service';
import { UploadFileService } from '../../../shared/upload/upload-file.service';

@Component({
  selector: 'upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.scss']
})
export class UploadVideoComponent implements OnInit {
  
  FeaturesRow1 = [
    {
      label : 'Label detection',
      feature : 'label_detection',
      amount : '$0.10/minute',
      price : 0.1,
      active : false
    },
    {
      label : 'Shot detection',
      feature : 'shot_detection',
      amount : '$0.10/minute',
      price : 0.1,
      active : false
    },
    {
      label : 'Explicit content detection',
      feature : 'explicit_content_detection',
      amount : '$0.10/minute',
      price : 0.1,
      active : false
    },
    {
      label : 'Speech Transcription',
      feature : 'speech_transcription',
      amount : '$0.10/minute',
      price : 0.1,
      active : false
    }
  ]

  FeaturesRow2 = [
    {
      label : 'Object Tracking',
      feature : 'object_tracking',
      amount : '$0.10/minute',
      price : 0.1,
      active : false
    },
    {
      label : 'Text detection',
      feature : 'text_detection',
      amount : '$0.10/minute',
      price : 0.1,
      active : false
    },
    {
      label : 'Logo detection',
      feature : 'logo_detection',
      amount : '$0.10/minute',
      price : 0.1,
      active : false
    }
  ]

  FeaturesRow3 = [
    {
      label : 'Face Detection',
      feature : 'face_detection',
      amount : '$0.10/minute',
      price : 0.1,
      active : false
    },
    {
      label : 'Person Detection',
      feature : 'person_detection',
      amount : '$0.10/minute',
      price : 0.1,
      active : false
    }
  ]
  @Output() switch : EventEmitter<void> = new EventEmitter<void>();
  selectedLabels:any[] = [];
  selectedCount: number = 0;
  total_Price:number = 0;
  totalPrice!: string;
  uploadVideo!: FormGroup;
  file: any[] = [];
  features: string = '';
  fileUploaded = false;
  fileUploading = false;
  uploadProgress : any[] = [{value : 0}];
  uploadError = '';
  error = false;
  uploadBtn = false;

  constructor(
    private _UploadFileService: UploadFileService,//reference to upload service
    private _ToggleAlert : ToggleAlertService//reference to alert service
    ) { }

  ngOnInit(): void {
    window.addEventListener("dragover",function(e){//prevent video from opening in browser when dragged and roped
      e.preventDefault();
    },false);
    window.addEventListener("drop",function(e){
      e.preventDefault();
    },false);
    this.loadData();
    this._UploadFileService.ClosePopup$().subscribe(
      () => {
        this.ClearAll();
        this.file= [];
        this._UploadFileService.selectedVideoLabels=[]
        this.features = '';
        this.uploadBtn = false;
      }
    );
    this._UploadFileService.FileUploaded$().subscribe(
      () => {
        this.ClearAll();
      }
    );
  }

  uploadClicked(){
    let element : HTMLElement | null = document.querySelector('#file');
    element?.click();
  }

  CheckActive(labelArray : any[], feat : any){
    for(let i = 0; i < labelArray.length; i++){
      if(labelArray[i].label === feat){
        labelArray[i].active = true;
        break;
      }
    }
  }

  loadData(){
    let label: any[] = [];
    this._UploadFileService.selectedVideoLabels.forEach(
      (feat : any) =>{
        label.push(feat.label);
      }
    )
    label.forEach(
      (feat : any) => {
        this.CheckActive(this.FeaturesRow1, feat);
        this.CheckActive(this.FeaturesRow2, feat);
        this.CheckActive(this.FeaturesRow3, feat);
      }
    )
    this.total_Price = this._UploadFileService.totalPriceVideos;
    this.totalPrice = this.total_Price.toFixed(1);
    this.file = this._UploadFileService.videoFiles;
    if(this._UploadFileService.videoFiles.length > 0){//if file is to be uploaded
      this.uploadBtn = true;
      this.file = this._UploadFileService.videoFiles;
      for(let i = 0; i < this._UploadFileService.videoFiles.length; i++){
        this.uploadProgress[i] = {value : 0};
      }
    }
    else if(this._UploadFileService.UploadedVideoFiles.length > 0){//if file is uploaded
      this.uploadBtn = false;
      this.fileUploaded = true;
      this.fileUploading = false;
      sessionStorage.setItem('fileUploading', "no");
      this.file = this._UploadFileService.UploadedVideoFiles;
      for(let i = 0; i < this._UploadFileService.UploadedVideoFiles.length; i++){
        this.uploadProgress[i] = {value : 100};
      }
    }    
  }

  AddSelectedToList(active : boolean, feature : any, amount : string, price: number, label : string){
    if(active){
      this._UploadFileService.totalPriceVideos -= price;
      this._UploadFileService.selectedVideoLabels.forEach((element: any, index: any) => {
            if(element.label === label){
              if (index > -1) {
                this._UploadFileService.selectedVideoLabels.splice(index, 1);
              }
            }
          });
    }
    else{
      this._UploadFileService.totalPriceVideos += price;
      this._UploadFileService.selectedVideoLabels.push(
        {
          label : label,
          amount : amount,
          feature : feature,
          price : price
        }
      )    
    }
  }
  StoreSelected(labelArray: any, label : string, amount: string, price: number, feature : any){
    for(let i = 0; i < labelArray.length; i++){
      if(labelArray[i].label === label){
        this.AddSelectedToList(labelArray[i].active, feature, amount, price, label)
        labelArray[i].active = !labelArray[i].active;
        break;
      }
    }
  }
  selected(label : string, amount: string, price: number, feature : any, row:number){
    if(row === 1){
      this.StoreSelected(this.FeaturesRow1, label, amount, price, feature);
    }
    if(row === 2){
      this.StoreSelected(this.FeaturesRow2, label, amount, price, feature);
    }
    if(row === 3){
      this.StoreSelected(this.FeaturesRow3, label, amount, price, feature);
    }    
    this.selectedCount = this._UploadFileService.selectedVideoLabels.length;
    this.totalPrice = this._UploadFileService.totalPriceVideos.toFixed(1);
    this.total_Price = this._UploadFileService.totalPriceVideos;
  }
  // select all labels
  PushSelectedVideoLabels(label: any, amount : any, feature: any,price : number){
    this._UploadFileService.selectedVideoLabels.push(
      {
        label : label,
        amount : amount,
        feature : feature,
        price : price
      }
    );
  }
  SelectAll() {
    //clear list
    this._UploadFileService.selectedVideoLabels.splice(0,this._UploadFileService.selectedVideoLabels.length);
    this._UploadFileService.totalPriceVideos = 0;
    let price = 0;
    //select labels1 items
    this.FeaturesRow1.forEach(
      e => {
        this.PushSelectedVideoLabels(e.label, e.amount, e.feature, e.price);
        price += e.price;
        e.active = true;
      }
    )
    //select labels2 items
    this.FeaturesRow2.forEach(
      e => {
        this.PushSelectedVideoLabels(e.label, e.amount, e.feature, e.price);
        price += e.price;
        e.active = true;
      }
    )
    //select labels3 items
    this.FeaturesRow3.forEach(
      e => {
        this.PushSelectedVideoLabels(e.label, e.amount, e.feature, e.price);
        price += e.price;
        e.active = true;
      }
    )
    this.total_Price = price;
    this._UploadFileService.totalPriceVideos = price;
    this.selectedCount = this._UploadFileService.selectedVideoLabels.length;
    this.totalPrice = this._UploadFileService.totalPriceVideos.toFixed(1);
  }
  //clear all selections
  ClearAllLabels(labelArray : any[]){
    for(let i = 0; i < labelArray.length; i++){
      labelArray[i].active = false;
    }
  }
  ClearAll() {
    this._UploadFileService.selectedVideoLabels.splice(0,this._UploadFileService.selectedVideoLabels.length);
    this.ClearAllLabels(this.FeaturesRow1);
    this.ClearAllLabels(this.FeaturesRow2);
    this.ClearAllLabels(this.FeaturesRow3);
    this.selectedCount = this._UploadFileService.selectedVideoLabels.length;
    this._UploadFileService.totalPriceVideos = 0;
    this.total_Price = 0;
    this.totalPrice = this._UploadFileService.totalPriceVideos.toFixed(1);
  }

  onDragOver(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }
  numberOfFiles = 0;
  onChange(event :any, drop : boolean) { 
    if(!this.fileUploading){//uploads only when file is not being uploaded
      this.features = '';
      if(this.fileUploaded){
        this.file= [];
        this._UploadFileService.videoFiles = [];
        this._UploadFileService.UploadedVideoFiles = [];
        this.fileUploaded = false;
        this.numberOfFiles = 0;
      }      
      if(drop){
        if (event.dataTransfer.items[0].kind === 'file') {
          event.dataTransfer.items.forEach((file :any, i : number) => {
            this.uploadProgress[this.numberOfFiles] = {value : 0};
            this.numberOfFiles++;
            //calculate video duration
            var video = document.createElement('video');
            video.preload = 'metadata';
            let duration = 0;
            video.onloadedmetadata = function() {
              window.URL.revokeObjectURL(video.src);
              duration = video.duration;
            }
            video.src = URL.createObjectURL(file);
            const file1 = event.dataTransfer.items[i].getAsFile();
            setTimeout(() => {
              if(file1.type.includes('video')) { 
                this._UploadFileService.videoFiles.push({
                  file : file1,
                  size : file1.size,
                  duration : duration,
                  thumbnail : '/assets/icons/Icon awesome-video-sm.svg'
                });
              }
              else{
                this.ThrowErrorMessage("Please upload a valid file");
              }
            }, 1000);
          });
        }
      }
      else{
        Object.keys(event.target.files).forEach(
          (key :any, i : number) => {
            const file1 = event.target.files[key];
            this.uploadProgress[this.numberOfFiles] = {value : 0};
            this.numberOfFiles++;
            //calculate video duration
            var video = document.createElement('video');
            video.preload = 'metadata';
            let duration = 0;
            video.onloadedmetadata = function() {
              window.URL.revokeObjectURL(video.src);
              duration = video.duration;
            }
            video.src = URL.createObjectURL(file1);
            setTimeout(() => {
              if (file1.type.includes('video')) {// store video files in service variable
                this._UploadFileService.videoFiles.push({
                  file : file1,
                  size : file1.size,
                  duration : duration,
                  thumbnail : '/assets/icons/Icon awesome-video-sm.svg'
                }); 
              }
              else{
                this.ThrowErrorMessage("Please upload a valid file");
              }
            }, 1000);
          }
        );
        setTimeout(() => {
          if(this._UploadFileService.videoFiles.length > 0){
            this.file = this._UploadFileService.videoFiles;
            this._UploadFileService.uploadVideoBtn = true;
            this.uploadBtn = true;
          }   
        }, 1500);
        
      }
    }
  } 
  DeleteFile(index: number){
    this._UploadFileService.videoFiles.splice(index, 1);
    this.numberOfFiles--;
    if(this.file.length === 0){
      this.uploadBtn = false;
    }
  }
  ThrowErrorMessage(msg: string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }
  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  CheckError(err : HttpErrorResponse){
    if(err.error.non_field_errors){
      if(err.error.non_field_errors[0] === "[ErrorDetail(string='Please add more amount in your account', code='invalid')]"){
        this.ThrowErrorMessage('You have insufficient balance');
      }
      else{
        this.ThrowErrorMessage(err.error.non_field_errors);
      }
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
  UploadFile(i : number){
    const promise1 = new Promise((resolve, reject) => {
  
    this._UploadFileService.CheckStatus('video', this.file[i].duration, this.file[i].size, this.totalPrice).subscribe(
      () => {
        this._UploadFileService.UploadFile(this.file[i].file, this.features).subscribe(
          (res : any) => {
            if (res.type === HttpEventType.UploadProgress) {
              this.uploadProgress[i].value = Math.round(100 * res.loaded / res.total);
            } else if (res instanceof HttpResponse) {
              this.switch.emit();
              resolve('Video uploaded successfully');
            }
          },
          (err : HttpErrorResponse) => {
            this.fileUploading = false;
            sessionStorage.setItem('fileUploading', "no");
            reject(err);
          }); 
      }, (err : HttpErrorResponse) => {
        this.file= [];
        this._UploadFileService.selectedVideoLabels=[]
        this._UploadFileService.videoFiles=[]
        this.features = '';
        this.ClearAll();
        this.uploadBtn = false;
        this.fileUploading = false;
        sessionStorage.setItem('fileUploading', "no");
        reject(err);
      }
    );   
    });
    promise1.then((res : any)=>{
      this._UploadFileService.Uploaded();
      this.ThrowSuccessMessage(res);
      i++;
      if(i < this.file.length){
        this.UploadFile(i);
      }
      else if(i === this.file.length){
        this._UploadFileService.UploadedVideoFiles = this._UploadFileService.videoFiles;
        this._UploadFileService.videoFiles = [];
        this._UploadFileService.videoFeatures = [];
        this._UploadFileService.selectedVideoLabels = [];
        this._UploadFileService.totalPriceVideos = 0;
        this.fileUploaded = true;
        this.fileUploading = false;
        sessionStorage.setItem('fileUploading', "no");
      }
    },
    (rej : HttpErrorResponse)=>{
      this.CheckError(rej);
      i++;
      if(i < this.file.length){
        this.UploadFile(i);
      }
    },
    );
  }
  upload(){
    if(this._UploadFileService.selectedVideoLabels.length > 0) {
      this.fileUploading=true;
      sessionStorage.setItem('fileUploading', "uploading");
      this.uploadBtn = false;
      this._UploadFileService.selectedVideoLabels.forEach(
        (key : any, idx : number) => {
          if(idx === this._UploadFileService.selectedVideoLabels.length - 1){
            this.features += key.feature ;
          }
          else{
            this.features += key.feature + ',';
          }
        }
      );      
      let i = 0;
      this.UploadFile(i);
    }
    else {
      this.ThrowErrorMessage("Please select atleast one feature");
    }    
  }
  CloseModal(){
    this._UploadFileService.Done();
  }
}
