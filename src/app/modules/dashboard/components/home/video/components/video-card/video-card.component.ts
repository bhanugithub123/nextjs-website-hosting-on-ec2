import { HttpErrorResponse } from '@angular/common/http';
import { Component, Output, EventEmitter, Input, OnChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';
import { VideosService } from 'src/app/modules/dashboard/shared/video/videos.service';
import { saveAs } from 'file-saver';
import { RouteService } from '../../../shared/route.service';
import { Router } from '@angular/router';
@Component({
  selector: 'video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.scss']
})
export class VideoCardComponent implements OnChanges, AfterViewInit {

  @ViewChild('video_Name') video_Name!: ElementRef;//reference to image name tooltip
  @Output() openVideo: EventEmitter<string> = new EventEmitter<string>(); 
  @Output() Video_selected: EventEmitter<void> = new EventEmitter<void>();
  @Input() sample!: boolean;// get image data from parent component
  @Input() videoData! : any;// get sample image data from parent component
  isSample: boolean = false;// true if the image is a sample
  req_Name! : string;// tool tip name
  VidUrl = '';//store thumbnail
  VidId = '';//store/ video id
  VidName = '';//store video name
  showName = false;
  deleting = false;//toggle switch for deleting pop up spinner
  ShowDeleteModal = false;
  ShowMenu = false;
  checked = false;
  constructor(
    private _VideoService : VideosService, // variable refrence to video service
    private _ToggleAlert : ToggleAlertService,// variable refrence to alert service
    private _RouteService : RouteService,
    private _Router : Router
  ) { 
    _RouteService.ToggleDropDown$.subscribe(
      () => {
        this.ShowMenu = false;
      }
    );
    _VideoService.SelectAll$.subscribe(
      () => {
        if(!this.isSample){
          this.Select();
        }
      }
    );
    _VideoService.UnselectAll$.subscribe(
      () => {
        if(!this.isSample){
          this.Unselect();
        }
      }
    );
  }

  ngAfterViewInit(): void {
    this.isSample = this.sample;
    if(!this.sample){
      if(this.videoData) {
        this.VidId = this.videoData.id;
        this.VidName = this.videoData.original_name;
        if(this.VidName.length > 16){
          let temp_name = '';
          for(let i = 0; i < this.VidName.split('.').length - 1; i++){
            temp_name += this.VidName.split('.')[i]+'.';
          }
          this.req_Name = temp_name.slice(0, 15) + '...';
        }
        else{
          this.req_Name = this.VidName;
        }
        this.VidUrl = this.videoData.thumbnail_video;
      }
    }
    else{
      if(this.videoData) {
        this.VidId = this.videoData.id;
        this.VidName = this.videoData.name;
        if(this.VidName.length > 16){
          let temp_name = '';
          for(let i = 0; i < this.VidName.split('.').length - 1; i++){
            temp_name += this.VidName.split('.')[i]+'.';
          }
          this.req_Name = temp_name.slice(0, 15) + '...';
        }
        else{
          this.req_Name = this.VidName;
        }
        this.VidUrl = this.videoData.thumbnail;
      }
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

  DownloadAsPDF(){
    let file_type = 'video';
    if(this.isSample){
      file_type = 'sample_video';
    }
    this._VideoService.DownloadPDF(this.VidId, file_type).subscribe(
      (data : any)=>{
        const blob = new Blob([data], { type: '.pdf' });
        saveAs(blob, `Video Result_${this.req_Name}.pdf`);
      },
      (err : HttpErrorResponse) => {
        this.CheckErr(err);
      }
    );
  }

  ToggleVideoName() {
    if(this.showName) {
      this.video_Name.nativeElement.classList.remove('show');//add class to element
    }
    else {
      this.video_Name.nativeElement.classList.add('show');//remove class from element
    }
    this.showName = !this.showName;//toggle boolean
  }

  ngOnChanges() {
    this.isSample = this.sample;//check whether the card is sample or not
  }
  RouteToDetails(){
    this._Router.navigate([`/home/videoDetails/${localStorage.getItem('OpenVideoID')}`]);
    this._Router.routeReuseStrategy.shouldReuseRoute = function () { //important reload function
      return false;
    };
  }
  OpenVideo() {
    if(this.isSample){
      localStorage.setItem('isSample', 'true');
      localStorage.setItem('OpenVideoTitle', `${this.videoData.path.split('/')[this.videoData.path.split('/').length - 1]}`);
    } else{
      localStorage.setItem('isSample', 'false');
      localStorage.setItem('OpenVideoTitle', `${this.videoData.name.split('/')[this.videoData.name.split('/').length - 1]}`);
    }
    localStorage.setItem('OpenVideoID', `${this.VidId}`);//stores video id to local storage
    this.Unselect();
    this.RouteToDetails();
  }

  //delete Video 
  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }
  
  ToggleDeleteModal(){
    this.ShowDeleteModal = !this.ShowDeleteModal;
  }
  DeleteVideo() {
    this.deleting = true;
    this._VideoService.DeleteVideo(this.VidId).subscribe(
      (res : any) => {
        if(res['success']){
          this.ThrowSuccessMessage("Video Deleted Successfully!");
          this.deleting = false;
          this._VideoService.VideoDeleted();
        }
      },
      (err : HttpErrorResponse) => {
        this.deleting = false;
        this.CheckErr(err);
      }
    );
  }
  DownloadAsXLS(){
    let file_type = 'video';
    if(this.isSample){
      file_type = 'sample_video';
    }
    this._VideoService.DownloadXLS(this.VidId, file_type).subscribe(
      (data : any)=>{
        const blob = new Blob([data], { type: '.xlsx' });
        saveAs(blob, `Video Result_${this.req_Name}.xlsx`);
      },
      (err : HttpErrorResponse) => {
        this.CheckErr(err);
      }
    );
  }
  DownloadAsJSON(){
    let file_type = 'video';
    if(this.isSample){
      file_type = 'sample_video';
    }
    this._VideoService.DownloadJSON(this.VidId, file_type).subscribe(
      (data : any)=>{
        const blob = new Blob([data], { type: '.json' });
        saveAs(blob, `Video Result_${this.req_Name}.json`);
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
      this._VideoService.fileIds.delete(this.VidId);
    } else{
      this._VideoService.fileIds.add(this.VidId);
      this.checked = true;
    }
    this.Video_selected.emit();
  }
  Select(){
    if(!this.checked){
      this.onChange();
    }
  }
  Unselect(){
    if(this.checked){
      this.onChange();
    }
  }
}
