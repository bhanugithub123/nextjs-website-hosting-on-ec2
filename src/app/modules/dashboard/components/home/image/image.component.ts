import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ImageService } from '../../../shared/image/image.service';
import { ToggleAlertService } from '../../../shared/toggle-alert.service';
import { UploadFileService } from '../../../shared/upload/upload-file.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, AfterViewChecked, OnDestroy {

  images: any[] = [];
  SampleImages: any[] = [];
  totalVideos!: number;
  showMore: boolean = false;
  showLess:boolean = false;
  showmore = false;
  showSpinner = true;//boolean to show spinner
  @Output() Images_selected: EventEmitter<void> = new EventEmitter<void>();
  constructor(
    private cdRef:ChangeDetectorRef,// reference to change detector module
    private _ImageService : ImageService,//reference to image service
    private _UploadFileService : UploadFileService,//refrence to upload file service
    private _ToggleAlert: ToggleAlertService// reference to alert service
    ) { 
      
    }
    convertDateFormat(date : string):string{
      const day = date.split('/')[0];
      var dayStr = '';
      switch (day) {
        case '01':
          dayStr = 'January';
          break;
        case '02':
          dayStr = 'February';
          break;
        case '03':
          dayStr = 'March';
        break;
        case '04':
          dayStr = 'April';
          break;
        case '05':
          dayStr = 'May';
          break;
        case '06':
          dayStr = 'June';
          break;
        case '07':
          dayStr = 'July';
          break;
        case '08':
          dayStr = 'August';
          break;
        case '09':
          dayStr = 'September';
          break;
        case '10':
          dayStr = 'October';
          break;
        case '11':
          dayStr = 'November';
          break;
        case '12':
          dayStr = 'December';
        break;
      }
  
      return dayStr + ', ' + date.split('/')[1];
    }
  ngOnInit(): void {
    this.loadImages();
    this._UploadFileService.FileUploaded$().subscribe(
      () => {
        this.loadImages();//reload images if new image is uploaded
      }
    );
    this._ImageService.FileDeleted$().subscribe(
      () => {
        this.loadImages();//reload images if an image is deleted
      }
    );
  }
  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }
  handleImages(images : any){
    let imageList : any[] = [];
    images.forEach((obj:any) => {
      imageList.push({
        id: obj.id,
        image_url : obj.image_url,
        name : obj.name,
        thumbnail_image : obj.thumbnail_image,
        status : obj.status,
        checked : false
      })
    });

    return imageList;
  }
  loadImages() {
    this._ImageService.GetImages().subscribe(
      (data : any) => {
        if(data['success']) {
          if(this.images.length > 0) {
            this.images = [];
            this._ImageService.ImageData = [];
          }
          if(this.SampleImages.length > 0) {
            this.SampleImages = [];
            this._ImageService.sampleImageData = [];
          }
          data['image_data'].forEach(
            (element : any) => {
              
              this.images.push({
                date : this.convertDateFormat(element.date),
                images : this.handleImages(element.images),
                count: element.images.length,
                showmore: element.images.length > 14 ? true:false,
                showless : false,
              })
              this._ImageService.ImageData = this.images;
            }
          )
          data['sample_image_data'].forEach(
            (element : any) => {
              this.SampleImages.push({
                url : element.image_url,
                name : element.name,
                id : element.id,
                thumbnail : element.thumbnail_image,
                checked : false
              })
              this._ImageService.sampleImageData = this.SampleImages;
            }
          )
          this.images.reverse();
          if(data['image_data'].length > 0){
            this._ImageService.FileSelectable(true);
          } else {
            this._ImageService.FileSelectable(false);
          }
          this.showSpinner = false;// hide spinner 
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
        this.showSpinner = false;
      }
    )
  }

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }

  toggleShow(index : number) {
    this.images[index].showmore = !this.images[index].showmore;
    this.images[index].showless = !this.images[index].showless;
  }

  ngOnDestroy(): void {
    this.images = [];
    this.SampleImages = [];
  }
  ToggleDeleteImages(){
    this._ImageService.FileSelected();
  }

}
