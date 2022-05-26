import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { ImageService } from 'src/app/modules/dashboard/shared/image/image.service';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';
import { UploadFileService } from 'src/app/modules/dashboard/shared/upload/upload-file.service';

@Component({
  selector: 'other-images-cards',
  templateUrl: './other-images-card-list.component.html',
  styleUrls: ['./other-images-card-list.component.scss']
})
export class OtherImagesCardListComponent implements OnInit, AfterViewInit,OnChanges {

  constructor(
    private _ImageService: ImageService,//reference to image service
    private _ToggleAlert : ToggleAlertService,// variable refrence to alert service
    private _UploadFileService : UploadFileService
    ) { }

  date! : string | null;//store date of the image on image response page
  imageId! : string | null;//stores image id
  otherImage : any = [];// store data of other images as well
  imageCount: number = 0;//store the count image in that date
  showMore = true;
  req_Length: number[] = [];
  loadSpinner = true;//boolean for spinner
  @Input() DetectDelete : boolean = false;
  @Output() ImageInfo: EventEmitter<any[]> = new EventEmitter<any[]>();// emit image info to paretn component
  @ViewChild('nav', {read: DragScrollComponent}) ds!: DragScrollComponent;
  ngOnChanges(): void {
    if(this.DetectDelete){
      this.SwitchImage();
    }
  }
  ngOnInit(): void {
    this._UploadFileService.FileUploaded$().subscribe(
      () => {
        this.loadImages();//reload images if new image is uploaded
        this.date = localStorage.getItem('Date');
        this.imageId = localStorage.getItem('imageID');
        this._ImageService.OtherImagesCardList = [];
      }
    );
    this._ImageService.FileDeleted$().subscribe(
      () => {
        this.loadImages();//reload images if an image is deleted
        this.date = localStorage.getItem('Date');
        this.imageId = localStorage.getItem('imageID');
        this._ImageService.OtherImagesCardList = [];
      }
    );
    this.date = localStorage.getItem('Date');
    this.imageId = localStorage.getItem('imageID');
    this.loadImages();
    this.otherImage = this._ImageService.OtherImagesCardList;
    if(this.otherImage.length > 0){
      this.imageCount = this.otherImage.length;
      this.otherImage.forEach(
        (image : any) => {
          if(image.id == this.imageId){
            image.current = true;
          }
          else{
            image.current = false;
          }
        }
      );
      this.loadSpinner = false;
    }
  } 
  
  ngAfterViewInit(): void {
    setTimeout(() => {
    }, 1000);
  }

  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }
  loadImages() {
    this._ImageService.GetImages().subscribe(
      (data : any) => {
        if(this.otherImage.length === 0){
          data.image_data.forEach(
            (images : any) => {
              images.images.forEach(
                (e : any) => {
                  if(this.imageId === `${e.id}`){
                    this.otherImage.push({
                      id:e.id,
                      url: e.image_url,
                      name: e.name,
                      thumbnail_image: e.thumbnail_image,
                      current: true,
                      isSample : false
                    })
                  }
                  else{
                    this.otherImage.push({
                      id:e.id,
                      url: e.image_url,
                      name: e.name,
                      thumbnail_image: e.thumbnail_image,
                      current: false,
                      isSample : false
                    })
                  }
                }
              )
            }
          )
          data.sample_image_data.forEach(
            (e : any) => {
              if(this.imageId === `${e.id}`){
                this.otherImage.push({
                  id:e.id,
                  url: e.image_url,
                  name: e.name,
                  thumbnail_image: e.thumbnail_image,
                  current: true,
                  isSample : true
                })
              }
              else{
                this.otherImage.push({
                  id:e.id,
                  url: e.image_url,
                  name: e.name,
                  thumbnail_image: e.thumbnail_image,
                  current: false,
                  isSample : true
                })
              }
            }
          )
          this.imageCount = this.otherImage.length;
        } 
        this._ImageService.OtherImagesCardList = this.otherImage;
        this.loadSpinner = false;
        setTimeout(() => {
          this.shiftCards();
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
        this.loadSpinner = false;
      }
    );
  }
  shiftCards(){
    let p = 0;
    this.otherImage.forEach(
      (obj : any, i : number) => {
        if(obj.current){
          p = i;
        }
      }
    );
    this.ds.moveTo(p - 1);
  }
  OpenImage(info : any, isSample : boolean){
    if(isSample){
      localStorage.setItem('isSample',"true");
    }
    else{
      localStorage.setItem('isSample',"false");
    }
    this.ImageInfo.emit([info, this.date]);
  }

  SwitchImage(){
    const len = this.otherImage.length;
    let pos = 0; 
    for(let idx = 0; idx < len; idx++){
      if(this.otherImage[idx].current === true){
         pos = idx + 1;
         break;
      }
    }
    this.OpenImage([this.otherImage[pos].url, this.otherImage[pos].id, this.otherImage[pos].name], this.otherImage[pos].isSample);
    
  }
}
