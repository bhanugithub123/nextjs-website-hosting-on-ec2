import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Router } from '@angular/router';
import { ImageService } from '../../shared/image/image.service';
import { ToggleAlertService } from '../../shared/toggle-alert.service';
import { UserDetailsService } from '../../shared/user-details.service';
import { VideosService } from '../../shared/video/videos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewChecked {

  @ViewChild('home') home! : ElementRef;
  overflow = 'auto';
  currentComponentVideo = true;
  showDeleteModal = false;
  deleting = false
  file_type = 'images';
  showBtn = false;
  showSelectAllBtn = false;
  constructor(
    private _Router : Router,
    private cdRef:ChangeDetectorRef,
    private _ImageService : ImageService,
    private _VideoService : VideosService,
    private _UserDetailsService : UserDetailsService,
    private _ToggleAlert : ToggleAlertService
    ) {
      _VideoService.Selectable$.subscribe(
        (status: boolean) =>{
          if(status){
            this.showSelectAllBtn = true;
          } else {
            this.showSelectAllBtn = false;
          }
        }
      );
      _ImageService.Selectable$.subscribe(
        (status: boolean) => {
          if(status){
            this.showSelectAllBtn = true;
          } else {
            this.showSelectAllBtn = false;
          }
        }
      );
    }
  
  handleRoute(){
    
    if(this._Router.url.includes('video') || this._Router.url.includes('videoDetails')){
      this.currentComponentVideo = true;
      this.file_type = 'videos';
    } else {
      this.currentComponentVideo = false;
      this.file_type = 'images';
    }
    if(this._Router.url.includes('imageDetails')) {
      this.overflow = 'hidden';
    }
    else{
      this._ImageService.OtherImagesCardList = [];
    }
    this._Router.events.subscribe(
      (event : any) => {
        this.showBtn = false;
        if(event.url){
          if(event.url.includes('video') || event.url.includes('videoDetails')){
            this.currentComponentVideo = true;
          } else {
            this.currentComponentVideo = false;
          } 
        }
      }
    );
  }
  FileSelectedSubscription(){
    this._ImageService.FileSelected$.subscribe(()=>{
      if(this._ImageService.fileIds.size > 0){
        this.showBtn = true;
      }
      else{
        this.showBtn = false;
      }
    });
    this._VideoService.FileSelected$.subscribe(()=>{
      if(this._VideoService.fileIds.size > 0){
        this.showBtn = true;
      }
      else{
        this.showBtn = false;
      }
    });
  }
  ngOnInit(): void {
    this.handleRoute();
    this.FileSelectedSubscription();
    this._UserDetailsService.setShowUpload$();    
  }
  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
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
  
  ToggleDeleteModal(){
    this.showDeleteModal = !this.showDeleteModal;
  }
  DeleteImage(){
    let counter = 0;
    for(let id of this._ImageService.fileIds){
      const FileId : string = `${id}`;
      counter++;
      this._ImageService.DeleteImage(FileId).subscribe(
        (res : any) => {
          if(res['success']){
            if(this._ImageService.fileIds.size >= counter){
              this._ImageService.fileIds.clear();
              this.ThrowSuccessMessage("Images Deleted Successfully!");
              this.deleting = false;
              this.showDeleteModal= false;
              this.showBtn = false;
              this._ImageService.ImageDeleted();
            }
          }
        },
        (err : HttpErrorResponse)=> {
          this.showDeleteModal= false;
          this.showBtn = false;
          this.deleting = false;
          this.CheckErr(err);
        }
      );
    }
  }
  DeleteVideo(){
    let counter = 0;
    for(let id of this._VideoService.fileIds){
      const FileId : string = `${id}`;
      counter++;
      this._VideoService.DeleteVideo(FileId).subscribe(
        (res : any) => {
          if(res['success']){
            if(this._VideoService.fileIds.size >= counter){
              this._VideoService.fileIds.clear();
              this.ThrowSuccessMessage("Videos Deleted Successfully!");
              this.deleting = false;
              this.showDeleteModal= false;
              this.showBtn = false;
              this._VideoService.VideoDeleted();
            }
          }
        },
        (err : HttpErrorResponse)=> {
          this.showDeleteModal= false;
          this.showBtn = false;
          this.deleting = false;
          this.CheckErr(err);
        }
      );
    }
  }
  DeleteFile() {
    this.deleting = true;
    if(!this.currentComponentVideo){
      this.DeleteImage();
    }
    else{
      this.DeleteVideo();
    }    
  }
  
  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }
  HandleSelectAll(){
    if(!this.currentComponentVideo){
      this._ImageService.fileIds.clear()
      setTimeout(() => {
        this._ImageService.SelectAll();
      }, 500);
    } else {
      this._VideoService._SelectAll$.next();
    }
  }
  HandleUnselectAll(){
    if(!this.currentComponentVideo){
      this._ImageService._UnselectAll$.next();
    } else {
      this._VideoService._UnselectAll$.next();
    }
  }
}
