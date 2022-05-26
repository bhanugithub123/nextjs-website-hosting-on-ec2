import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToggleAlertService } from '../../../shared/toggle-alert.service';
import { UploadFileService } from '../../../shared/upload/upload-file.service';

@Component({
  selector: 'upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {
  @Output('switch') switch : EventEmitter<void> = new EventEmitter<void>();
  selectedLabels:any[] = [];
  selectedCount: number = 0;
  total_Price: number = 0;
  totalPrice!: string;
  uploadImage!: FormGroup;
  file: any[] = [];
  fileThumbnails : any[] = [];
  features: string = '';
  uploadError = '';
  error = false;
  fileUpload ={status: '', message: '', filePath: ''};
  fileUploaded = false;
  fileUploading = false;
  uploadProgress : any[] = [];
  uploadBtn = false;
  message = false;
  uploadMessage = '';
  labels1 = [
    {
      label : 'Label detection',
      feature : 'label_detection',
      amount : '$0.10/minute',
      price : 0.1,
      active : false
    },
    {
      label : 'Web detection',
      feature : 'web_detection',
      amount : '$0.10/minute',
      price : 0.1,
      active : false
    },
    {
      label : 'Safe Search detection',
      feature : 'safe_search_detection',
      amount : '$0.10/minute',
      price : 0.1,
      active : false
    },
    {
      label : 'Land Detection',
      feature : 'landmark_detection',
      amount : '$0.10/minute',
      price : 0.1,
      active : false
    }
  ]
  labels2 = [
    {
      label : 'Object Localization',
      feature : 'object_localization',
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
  labels3 = [
    {
      label : 'Face Detection',
      feature : 'facial_detection',
      amount : '$0.10/minute',
      price : 0.1,
      active : false
    },
    {
      label : 'Image Properties',
      feature : 'image_properties',
      amount : '$0.10/minute',
      price : 0.1,
      active : false
    }
  ]
  
  constructor(private _UploadFileService : UploadFileService, private _ToggleAlert : ToggleAlertService) { }

  ngOnInit(): void {
    window.addEventListener("dragover",function(e){//prevent image from opening in browser when dragged and roped
      e.preventDefault();
    },false);
    window.addEventListener("drop",function(e){
      e.preventDefault();
    },false);

    this.loadData();
    this._UploadFileService.ClosePopup$().subscribe(
      () => {
        this.ClearAll();
        this.file = [];
        this._UploadFileService.selectedImageLabels=[];
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
    this._UploadFileService.selectedImageLabels.forEach(
      (feat : any) =>{
        label.push(feat.label);
      }
    )
    label.forEach(
      (feat : any) => {
        this.CheckActive(this.labels1, feat);
        this.CheckActive(this.labels2, feat);
        this.CheckActive(this.labels3, feat);
      }
    )
    this.total_Price = this._UploadFileService.totalPriceImages;
    this.totalPrice = this.total_Price.toFixed(1);
    if(this._UploadFileService.imageFiles.length > 0){
      this.uploadBtn = true;
      this.file = this._UploadFileService.imageFiles;
      for(let i = 0; i < this._UploadFileService.imageFiles.length; i++){
        this.uploadProgress[i] = {value : 0};
      }
    }
    else if(this._UploadFileService.UploadedImageFiles.length > 0){
      this.uploadBtn = false;
      this.fileUploaded = true;
      this.fileUploading = false;
      sessionStorage.setItem('fileUploading', "no");
      this.file = this._UploadFileService.UploadedImageFiles;
      for(let i = 0; i < this._UploadFileService.UploadedImageFiles.length; i++){
        this.uploadProgress[i] = {value : 100};
      }
    }    
  }

  AddSelectedToList(active : boolean, feature : any, amount : string, price: number, label : string){
    if(active){
      this._UploadFileService.totalPriceImages -= price;
      this._UploadFileService.selectedImageLabels.forEach((element: any, index: any) => {
            if(element.label === label){
              if (index > -1) {
                this._UploadFileService.selectedImageLabels.splice(index, 1);
              }
            }
          });
    }
    else{
      this._UploadFileService.totalPriceImages += price;
      this._UploadFileService.selectedImageLabels.push(
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
      this.StoreSelected(this.labels1, label, amount, price, feature);
    }
    if(row === 2){
      this.StoreSelected(this.labels2, label, amount, price, feature);
    }
    if(row === 3){
      this.StoreSelected(this.labels3, label, amount, price, feature);
    }    
    this.selectedCount = this._UploadFileService.selectedImageLabels.length;
    this.totalPrice = this._UploadFileService.totalPriceImages.toFixed(1);
    this.total_Price = this._UploadFileService.totalPriceImages;
    
  }
  // select all labels
  PushSelectedImageLabels(label: any, amount : any, feature: any, price: number){
    this._UploadFileService.selectedImageLabels.push(
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
    this._UploadFileService.selectedImageLabels.splice(0,this._UploadFileService.selectedImageLabels.length);
    this._UploadFileService.totalPriceImages = 0;
    let price = 0;
    //select labels1 items
    this.labels1.forEach(
      e => {
        this.PushSelectedImageLabels(e.label, e.amount, e.feature, e.price);
        price += e.price;
        e.active = true;
      }
    )
    //select labels2 items
    this.labels2.forEach(
      e => {
        this.PushSelectedImageLabels(e.label, e.amount, e.feature, e.price);
        price += e.price;
        e.active = true;
      }
    )
    //select labels3 items
    this.labels3.forEach(
      e => {
        this.PushSelectedImageLabels(e.label, e.amount, e.feature, e.price);
        price += e.price;
        e.active = true;
      }
    )
    this.total_Price = price;
    this._UploadFileService.totalPriceImages = price;
    this.selectedCount = this._UploadFileService.selectedImageLabels.length;
    this.totalPrice = this._UploadFileService.totalPriceImages.toFixed(1);
  }
  //clear all selections
  ClearAllLabels(labelArray : any[]){
    for(let i = 0; i < labelArray.length; i++){
      labelArray[i].active = false;
    }
  }
  ClearAll() {
    this._UploadFileService.selectedImageLabels.splice(0,this._UploadFileService.selectedImageLabels.length);
    this.ClearAllLabels(this.labels1);
    this.ClearAllLabels(this.labels2);
    this.ClearAllLabels(this.labels3);
    this.selectedCount = this._UploadFileService.selectedImageLabels.length;
    this._UploadFileService.totalPriceImages = 0;
    this.total_Price = 0;
    this.totalPrice = this._UploadFileService.totalPriceImages.toFixed(1);
  }
  
  onDragOver(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

  ThrowErrorMessage(msg: string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }
  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
numberofFiles = 0;
  onChange(event :any, drop : boolean) { 
    if(!this.fileUploading){
      this.features = '';
      if(this.fileUploaded){
        this.file = [];
        this._UploadFileService.imageFiles = [];
        this._UploadFileService.UploadedImageFiles = [];
        this.fileUploaded = false;
        this.numberofFiles = 0;
      }
      if(drop){
        if (event.dataTransfer.items[0].kind === 'file') {
          for (var i = 0; i < event.dataTransfer.items.length; i++) {
            this.uploadProgress[this.numberofFiles] = {value : 0};
            this.numberofFiles++;
            const file1 = event.dataTransfer.items[i].getAsFile();
            if(file1.type.includes('image')){
              const reader = new FileReader();
              reader.onload = (e:any) => {
                this._UploadFileService.imageFiles.push({
                  file : file1,
                  size : file1.size,
                  thumbnail : e.target.result
                });
              }
              reader.readAsDataURL(file1);
            }
            else{
              this.ThrowErrorMessage("Please upload a valid file");
            }
          }
        }
      }
      else{
        Object.keys(event.target.files).forEach(
          (key :any, i : number) => {
            const file1 = event.target.files[key];
            this.uploadProgress[this.numberofFiles] = {value : 0};
            this.numberofFiles++;
            if(file1.type.includes('image')){
              const reader = new FileReader();
              reader.onload = (e:any) => {
                this._UploadFileService.imageFiles.push({
                  file : file1,
                  size : file1.size,
                  thumbnail : e.target.result
                }); 
              }
              reader.readAsDataURL(file1);
            }
            else{
              this.ThrowErrorMessage("Please upload a valid file");
            }
          }
        );
      }
      this.file = this._UploadFileService.imageFiles;
      this._UploadFileService.uploadImageBtn = true;
      this.uploadBtn = true;
    }
    
  } 
  
  DeleteFile(index: number){
    this._UploadFileService.imageFiles.splice(index, 1);
    this.numberofFiles++;
    if(this.file.length === 0){
      this.uploadBtn = false;
    }
  }
  uploadClicked(){
    let element : HTMLElement | null = document.querySelector('#file');
    element?.click();
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
    };
  }
  UploadFile(i : number){
    const promise1 = new Promise((resolve, reject) => {
      this._UploadFileService.CheckStatus('image', '0', this.file[i].size, this.totalPrice).subscribe(
        (res : any) => {
          this._UploadFileService.UploadFile(this.file[i].file, this.features).subscribe(
            (res : any) => {
              if (res.type === HttpEventType.UploadProgress) {
                this.uploadProgress[i].value = Math.round(100 * res.loaded / res.total);
              } 
              else if (res instanceof HttpResponse) {
                this.switch.emit();
                resolve('Image uploaded successfully');
              }
            },
            (err : HttpErrorResponse) => {
              this.fileUploading = false;
              sessionStorage.setItem('fileUploading', "no");
              reject(err);
            }
          );  
        }, (err : HttpErrorResponse) => {
          this.file= [];
          this._UploadFileService.selectedImageLabels=[]
          this._UploadFileService.imageFiles=[]
          this.features = '';
          this.ClearAll();
          this.uploadBtn = false;
          this.fileUploading = false;
          sessionStorage.setItem('fileUploading', "no");
          reject(err);
        });
        
    });
    promise1.then((res : any)=>{
      this._UploadFileService.Uploaded();
      this.ThrowSuccessMessage(res);
      i++;
      if(i < this.file.length){
        this.UploadFile(i);
      }
      else if(i === this.file.length){
        this._UploadFileService.UploadedImageFiles = this._UploadFileService.imageFiles;
        this._UploadFileService.imageFiles = [];
        this._UploadFileService.imageFeatures = [];
        this._UploadFileService.selectedImageLabels = [];
        this._UploadFileService.totalPriceImages = 0;
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
    if(this._UploadFileService.selectedImageLabels.length > 0) {
      this.fileUploading=true;
      sessionStorage.setItem('fileUploading', "uploading");
      this.uploadBtn = false;
      this._UploadFileService.selectedImageLabels.forEach(
        (key : any, i : number) => {
          if(i === this._UploadFileService.selectedImageLabels.length - 1){
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
