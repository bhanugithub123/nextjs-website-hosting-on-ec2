import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnChanges, OnInit } from '@angular/core';
import { ImageService } from 'src/app/modules/dashboard/shared/image/image.service';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';
import { VideosService } from 'src/app/modules/dashboard/shared/video/videos.service';
import { StorageDetailsService } from '../../shared/storage-details.service';

@Component({
  selector: 'storage-cards-list',
  templateUrl: './storage-cards-list.component.html',
  styleUrls: ['./storage-cards-list.component.scss']
})
export class StorageCardsListComponent implements OnInit, OnChanges {

  image_details :any[] = [];
  video_details :any[] = [];
  data_list : any[] = [];
  data_loaded = false;
  constructor(
    private _StorageDetails : StorageDetailsService,
    private _ToggleAlert : ToggleAlertService,
    private _ImageService : ImageService,// variable refrence to Image service
    private _VideoService : VideosService, // variable refrence to video service
  ) { }
  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }

  checkerr(err : HttpErrorResponse){
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
  ngOnInit(): void {
    this.loadStorageDetails();
    this._VideoService.FileDeleted$().subscribe(
      () => {
        this.video_details = [];
        this.image_details = [];
        this.data_list = [];
        this.data_loaded =false;
        this.loadStorageDetails();
      }
    );
    this._ImageService.FileDeleted$().subscribe(
      () => {
        this.image_details = [];
        this.video_details = [];
        this.data_list = [];
        this.data_loaded = false;
        this.loadStorageDetails();
      }
    );
  }
  loadStorageDetails(){
    this.image_details = [];
    this.video_details = [];
    
    this._StorageDetails.LoadStorageDetailsList().subscribe(
      (res : any) =>{
        res.files.forEach(
          (file_info : any) => {
            if(file_info.image_name){
              this.image_details.push(file_info);
            }
            else{
              this.video_details.push(file_info);
            }
          }
        );
        this.data_loaded = true;
        this.createList();
      },
      (err : HttpErrorResponse) => {
        this.checkerr(err);
        this.data_loaded = true;
      }
    );
  }
  convertsize(size : string){
    let mem = parseFloat(size);
    let result = '';
    if(mem < 1000){
      result = mem.toFixed(2) + ' Bytes';
    }
    if(mem > 1000){
      mem = mem /1000;
      result = mem.toFixed(2) + ' KB';
    }
    if(mem > 1024){
      mem = mem /1024;
      result = mem.toFixed(2) + ' MB'
    }
    if(mem > 1024){
      mem = mem /1024;
      result = mem.toFixed(2) + ' GB';
    }
    return result;
  }
  createList(){
    if(this.image_details.length > 0){
      this.image_details.forEach(
        (data : any) => {
          this.data_list.push({
            size : this.convertsize(data.image_size),
            name : data.image_name,
            url : data.thumbnail_url,
            type : 'image',
            id: data.image_id,
            non_deletable : data.image_size === '0.00' ? true: false
          });
        }
      );
    }
    if(this.video_details.length > 0){
      this.video_details.forEach(
        (data : any) => {
          this.data_list.push({
            size : this.convertsize(data.video_size),
            name : data.video_name,
            url : data.thumbnail_url,
            type : 'video',
            id: data.image_id,
            non_deletable : data.video_size === '0.00' ? true: false
          });
        }
      );
    }
  }
  ngOnChanges(): void {
    
  }
  
}
