import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { ImageService } from 'src/app/modules/dashboard/shared/image/image.service';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';
import { saveAs } from 'file-saver';
import { RouteService } from '../../../shared/route.service';
import { Router } from '@angular/router';

@Component({
  selector: 'image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.scss']
})
export class ImageCardComponent implements  OnChanges, AfterViewInit {

  @ViewChild('image_Name') image_Name! : ElementRef;//reference to image name tooltip
  @Input() imageData!: any;// get image data from parent component
  @Input() sample: any;// get sample image data from parent component
  isSample: boolean = false;// true if the image is a sample
  req_Name! : string;// tool tip name
  ImgUrl = '';//store base64 thumbnail info to image
  ImgId = '';// store image id
  ImgName = '';//store image name
  hide = true;
  showName = false;
  deleting = false;
  ShowMenu = false;
  @ViewChild('checkbox') checkbox !: ElementRef;
  checked = false;
  @Output() Image_selected: EventEmitter<void> = new EventEmitter<void>();
  constructor( 
    private _ImageService : ImageService,// variable refrence to Image service
    private _ToggleAlert : ToggleAlertService,// variable refrence to alert service
    private _RouteService : RouteService,
    private _Router : Router
    ) {
      _RouteService.ToggleDropDown$.subscribe(
        () => {
          this.ShowMenu = false;
        }
      );
      _ImageService.SelectAll$.subscribe(
        () => {
          if(!this.sample){
            this.SelectAll();
          }
        }
      );
      _ImageService.UnselectAll$.subscribe(
        () => {
          if(!this.sample){
            this.UnselectAll();
          }
        }
      );
  }
  SelectAll(){
    if(!this.checked){
      this.onChange();
    }
  }
  UnselectAll(){
    if(this.checked){
      this.onChange();
    }
  }
  ngOnChanges() {    
    this.checked = this.imageData.checked;
    this.isSample = this.sample;
  }
  StoreName(){
    if(this.ImgName.length > 16){
      let temp_name = '';
      for(let i = 0; i < this.ImgName.split('.').length - 1; i++){
        temp_name += this.ImgName.split('.')[i]+'.';
      }
      this.req_Name = temp_name.slice(0, 15) + '...';
    }
    else{
      this.req_Name = this.ImgName;
    }
  }
  ngAfterViewInit(): void {
    if(!this.isSample){
      this.ImgId = this.imageData.id;
      this.ImgName = this.imageData.name;
      this.StoreName();
      this.ImgUrl = this.imageData.thumbnail_image;
      this.checked = this.imageData.checked;
    }
    else{
      this.ImgId = this.imageData.id;
      this.ImgName = this.imageData.name;
      this.StoreName();
      this.ImgUrl = this.imageData.thumbnail;
      this.checked = this.imageData.checked;
    }
    
  }

  CheckErr(err : HttpErrorResponse){
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
  RouteToDetails(){
    this._Router.navigate([`/home/imageDetails/${localStorage.getItem('imageID')}`]);
    this._Router.routeReuseStrategy.shouldReuseRoute = function () { //important reload function
      return false;
    };
  }
  OpenImage() {
    if(!this.isSample){
      localStorage.setItem('isSample', 'false');
      localStorage.setItem('imageUrl', this.imageData.image_url);
    }
    else{
      localStorage.setItem('isSample', 'true');
      localStorage.setItem('imageUrl', this.imageData.url);
    }
    localStorage.setItem('imageID', `${this.ImgId}`);
    localStorage.setItem('imageName', this.ImgName);
    this.RouteToDetails()
  }

  ToggleImageName() {
    if(this.showName) {
      this.image_Name.nativeElement.classList.remove('show');
    }
    else {
      this.image_Name.nativeElement.classList.add('show');
    }

    this.showName = !this.showName;
  }
  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }
  ShowDeleteModal = false;

  ToggleDeleteModal(){
    this.ShowDeleteModal = !this.ShowDeleteModal;
  }
  DeleteImage() {
    this.deleting = true;
    this._ImageService.DeleteImage(this.ImgId).subscribe(
      (res : any) => {
        if(res['success']){
          this.ThrowSuccessMessage("Image Deleted Successfully!");
          this.deleting = false;
          this._ImageService.ImageDeleted();
        }
      },
      (err : HttpErrorResponse)=> {
        this.deleting = false;
        this.CheckErr(err);
      }
    );
  }
  DownloadAsPDF(){
    let file_type = 'image';
    if(this.isSample){
      file_type = 'sample_image';
    }
    this._ImageService.DownloadPDF(this.ImgId, file_type).subscribe(
      (data : any)=>{
        const blob = new Blob([data], { type: '.pdf' });
        saveAs(blob, `Image Result_${this.req_Name}.pdf`);
      },
      (err : HttpErrorResponse) => {
        this.CheckErr(err);
      }
    );
  }

  DownloadAsXLS(){
    let file_type = 'image';
    if(this.isSample){
      file_type = 'sample_image';
    }
    this._ImageService.DownloadXLS(this.ImgId, file_type).subscribe(
      (data : any)=>{
        const blob = new Blob([data], { type: '.xlsx' });
        saveAs(blob, `Image Result_${this.req_Name}.xlsx`);
      },
      (err : HttpErrorResponse) => {
        this.CheckErr(err);
      }
    );
  }
  DownloadAsJSON(){
    let file_type = 'image';
    if(this.isSample){
      file_type = 'sample_image';
    }
    this._ImageService.DownloadJSON(this.ImgId, file_type).subscribe(
      (data : any)=>{
        const blob = new Blob([data], { type: '.json' });
        saveAs(blob, `Image Result_${this.req_Name}.json`);
      },
      (err : HttpErrorResponse) => {
        this.CheckErr(err);
      }
    );
  }
  ToggleOffDropDown(ev : any){
    if(ev.target === document.getElementById("close-dropdown")){
      this.ShowMenu = false;
    }
  } 
  ToggleDropdown(){
    if(!this.ShowMenu){
      this._RouteService.ToggleDropdownOff();
    }
    this.ShowMenu = !this.ShowMenu;
  }
  onChange(){
    if(this.checked){
      this.checked = false;
      this._ImageService.fileIds.delete(this.ImgId);
    } else{
      this._ImageService.fileIds.add(this.ImgId);
      this.checked = true;
    }
    this.Image_selected.emit();
  }
}



