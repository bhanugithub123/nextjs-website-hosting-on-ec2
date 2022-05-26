import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/modules/dashboard/shared/image/image.service';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';

@Component({
  selector: 'app-image-description',
  templateUrl: './image-description.component.html',
  styleUrls: ['./image-description.component.scss']
})

export class ImageDescriptionComponent implements OnInit {
  showSpinner = false;
  imageName!: string | null;
  imageData : any = {};
  ImgUrl : any = '';
  mainImageHeight = '462px';
  mainImageWidth = '585px';
  count = 0;
  loadComponent = 'default';
  showText = -1;
  face = -1;
  objects = -1;
  landmark = -1;
  logo = -1;
  imageLoader = true;
  available_Features: any[] = [];// stores selected features
  not_available_Features: any[] = [];//stores not selected features
  showDeleteIcon = true;
  features = [
    {
      label: 'Web Detection',
      switch : false,
      count: '00',
      feature:'web_detection',
      processing : false
    },
    {
      label: 'Logo Detection',
      switch : false,
      count: '00',
      feature:'logo_detection',
      processing : false
    },
    {
      label: 'Text',
      switch : false,
      count: '00',
      feature:'text_detection',
      processing : false
    },
    {
      label: 'Objects',
      switch : false,
      count: '00',
      feature:'object_localization',
      processing : false
    },
    {
      label: 'Label Detection',
      switch : false,
      count: '00',
      feature:'label_detection',
      processing : false
    },
    {
      label: 'Face',
      switch : false,
      count: '00',
      feature:'facial_detection',
      processing : false
    },
    {
      label: 'Image Properties',
      switch : false,
      count: '00',
      feature:'image_properties',
      processing : false
    },
    {
      label: 'Explicit Contents',
      switch : false,
      count: '00',
      feature:'safe_search_detection',
      processing : false
    },
    {
      label: 'Landmarks',
      switch : false,
      count: '00',
      feature:'landmark_detection',
      processing : false
    }
  ]
  constructor(
    private _ImageService : ImageService,//reference to image service
    private _ToggleAlert : ToggleAlertService,//reference to alert service
    private _Router : Router
  ) { }
  
  ngOnInit(): void {
    if(localStorage.getItem('User_id')){
      this.ImgUrl = localStorage.getItem('imageUrl') + '&user_id='+localStorage.getItem('User_id');
    }
    if(sessionStorage.getItem('User_id')){
      this.ImgUrl = localStorage.getItem('imageUrl') + '&user_id='+sessionStorage.getItem('User_id');
    }
    this.imageName = localStorage.getItem('imageName'); 
    this.showSpinner = true;
    this.getImageInfo(localStorage.getItem('imageID'));
    this._ImageService.FeatureAdded$().subscribe(
      () => {
        this.showSpinner = true;
        this.imageData = [];
        setTimeout(() => {
          this.getImageInfo(localStorage.getItem('imageID'));
        }, 500);
      }
    );
  }

  setAvailableFeatureFromSelectedFeatures(selectedFeatures : string[]){
    this.available_Features = [];
    this.not_available_Features = [];
    this.features.forEach(
      (f : any) => {
        if(selectedFeatures.includes(f.feature)) {
          this.available_Features.push(f);
          f.processing = true;
        }
        else{
          this.not_available_Features.push(f)
        }
      }
    );
    console.log(this.available_Features)
  }
  setAvailableFeatures() {
    this.features.forEach(
      (f:any) => {
        this.available_Features.push(f);
      }
    );
  }

  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }
  checkErr(err: HttpErrorResponse){
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

  getImageInfo( id: string | null) {
    if(localStorage.getItem('isSample') === "true"){
      this.showDeleteIcon = false;
      this._ImageService.GetSampleImageResponse(id).subscribe(
        (data : any) => {
          if(data['success']) {
            this.imageData = data.image_data;
            this.showSpinner = false;
            this.setAvailableFeatures();
          }
        },
        (err : HttpErrorResponse) => {
          this.checkErr(err);
          this.showSpinner = false;
        }
      )
    }
    else{
      this._ImageService.GetImageInfo(id).subscribe(
        (data : any) => {
          if(data['success']) {
            this.imageData = data.image_data;
            this.showSpinner = false;
            this.setAvailableFeatureFromSelectedFeatures(data.image_data.selected_features);
          }
        },
        (err : HttpErrorResponse) => {
          this.checkErr(err);
          this.showSpinner = false;
        }
      )
    }
  }

  ImageLoaded(status : boolean){
    this.imageLoader = !status;
  }

  zoomMainImage() {   
    if(this.count < 4) {
      this.count += 1;
      switch (this.count) {
        case 1:
          this.mainImageHeight = '562px';
          this.mainImageWidth = '685px';
          break;
        case 2:
          this.mainImageHeight = '662px';
          this.mainImageWidth = '785px';
          break;
        case 3:
          this.mainImageHeight = '862px';
          this.mainImageWidth = '985px';
          break;
        case 4:
          this.mainImageHeight = '1062px';
          this.mainImageWidth = '1185px';
          break;
        default:
          break;
      }
    }
  }

  zoomOutMainImage() {   
    if(this.count > 0){
      this.count -= 1;
      switch (this.count) {
        case 0:
          this.mainImageHeight = '462px';
          this.mainImageWidth = '585px';
          break;
        case 1:
          this.mainImageHeight = '562px';
          this.mainImageWidth = '685px';
          break;
        case 2:
          this.mainImageHeight = '662px';
          this.mainImageWidth = '785px';
          break;
        case 3:
          this.mainImageHeight = '862px';
          this.mainImageWidth = '985px';
          break;
        default:
          break;
      }
    }
  }
  
  CurrentFeature(event : any){
    this.loadComponent = event;
  }
  
  ShowTextLabel(event: number){
    this.showText = event;
  }
  ShowObject(object : number){
    this.objects = object;
  }
  ShowFace(key : number){
    this.face = key;
  }
  ShowLandmark(key : number){
    this.landmark = key;
  }
  ShowLogo(key : number){
    this.logo = key;
  }
  RouteToDetails(){
    this._Router.navigate([`/home/imageDetails/${localStorage.getItem('imageID')}`]);
    this._Router.routeReuseStrategy.shouldReuseRoute = function () { //important reload function
      return false;
    };
  }
  OpenImage(info : any){
    localStorage.setItem('Date', `${info[1]}`);
    localStorage.setItem('imageUrl', info[0][0]);
    localStorage.setItem('imageID', `${info[0][1]}`);
    localStorage.setItem('imageName', info[0][2]);
    this.RouteToDetails();
  }
  deleting = false;
  ShowDeleteModal = false;
  ImageDeleted = false;
  ToggleDelete(){
    this.ShowDeleteModal = !this.ShowDeleteModal;
  }
  DeleteImage() {
    this.deleting = true;
    this._ImageService.DeleteImage(`${localStorage.getItem('imageID')}`).subscribe(
      (res : any) => {
        if(res['success']){
          this.ThrowSuccessMessage("Image Deleted Successfully!");
          this.ImageDeleted = true;
          this.deleting = false;
        }
      },
      (err : HttpErrorResponse)=> {
        this.deleting = false;
        this.checkErr(err);
      }
    );
  }
}
