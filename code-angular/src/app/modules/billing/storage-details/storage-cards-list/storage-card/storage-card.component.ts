import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ImageService } from 'src/app/modules/dashboard/shared/image/image.service';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';
import { VideosService } from 'src/app/modules/dashboard/shared/video/videos.service';

@Component({
  selector: 'storage-card',
  templateUrl: './storage-card.component.html',
  styleUrls: ['./storage-card.component.scss']
})
export class StorageCardComponent implements OnInit{
  @Input() storage_details ! :any;
  name = '';
  size = '';
  url = '';
  id = -1;
  deleting = false;
  CanDelete = false;
  constructor(
    private _ImageService : ImageService,// variable refrence to Image service
    private _VideoService : VideosService, // variable refrence to video service
    private _ToggleAlert : ToggleAlertService// variable refrence to alert service
  ) { }
  ngOnInit(): void {
    this._VideoService.FileDeleted$().subscribe(
      () => {
        this.name = '';
        this.size = '';
        this.url = '';
        this.id = -1;
        this.deleting = false;
        this.CanDelete = false;
      }
    );
    this._ImageService.FileDeleted$().subscribe(
      () => {
        this.name = '';
        this.size = '';
        this.url = '';
        this.id = -1;
        this.deleting = false;
        this.CanDelete = false;
      }
    );
  }
  ngOnChanges(): void {
    if(this.storage_details){
      this.name = this.storage_details.name;
      this.url = this.storage_details.url;
      this.size = this.storage_details.size;
      this.id = this.storage_details.id;
      this.CanDelete = !this.storage_details.non_deletable;
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
    };
  }

  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }

  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }

  DeleteFile(){
    if(this.storage_details.type === 'image'){
      this.DeleteImage(`${this.id}`);
    }
    else{
      this.DeleteVideo(`${this.id}`);
    }
  }

  ShowDeleteModal = false;
  file_type = 'image';
  ToggleDeleteModal(){
    if(this.storage_details.type === 'image'){
      this.file_type = 'image';
    }
    else{
      this.file_type = 'video';
    }
    this.ShowDeleteModal = !this.ShowDeleteModal;
  }

  DeleteImage(id : string) {
    this.deleting = true;
    this._ImageService.DeleteImage(id).subscribe(
      (res : any) => {
        if(res['success']){
          this.ThrowSuccessMessage("Image Deleted Successfully!");
          this._ImageService.ImageDeleted();
          this.deleting = false;
        }
      },
      (err : HttpErrorResponse)=> {
        this.deleting = false;
        this.CheckErr(err);
      }
    );
  }

  DeleteVideo(id : string) {
    this.deleting = true;
    this._VideoService.DeleteVideo(id).subscribe(
      (res : any) => {
        if(res['success']){
          this.ThrowSuccessMessage("Video Deleted Successfully!");
          this._VideoService.VideoDeleted();
          this.deleting = false;
        }
      },
      (err : HttpErrorResponse) => {
        this.deleting = false;
        this.CheckErr(err);
      }
    );
  }
}
