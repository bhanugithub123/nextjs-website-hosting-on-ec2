import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ToggleAlertService } from '../../../shared/toggle-alert.service';
import { UploadFileService } from '../../../shared/upload/upload-file.service';
import { VideosService } from '../../../shared/video/videos.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, OnDestroy {

  videos : any[] = [];
  totalVideos!: number;
  showMore: boolean = false;
  showLess:boolean = false;
  showmore = false;
  showSpinner = true;
  samplevideos : any[] = [];
  constructor(
    private cdRef:ChangeDetectorRef,//reference to change detector module
    private _VideoServices : VideosService,//reference to video service
    private _UploadFileService : UploadFileService,//reference to upload service
    private _ToggleAlert: ToggleAlertService// reference to alert service
    ) { }
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
    this.loadVideos();
    this._VideoServices.FileDeleted$().subscribe(
      () => {
        this.loadVideos();//reload video cards when a video is deleted
      }
    );
    this._UploadFileService.FileUploaded$().subscribe(
      () => {
        this.loadVideos();//reload video cards when a video is uploaded
      }
    );
    this._VideoServices.RefreshNeeded$.subscribe(
      () => {
        this.showSpinner = true;
        this.loadVideos();
      }
    );
  }

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }

  toggleShow(index : number) {
    this.videos[index].showmore = !this.videos[index].showmore;
    this.videos[index].showless = !this.videos[index].showless;
  }
  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }
  loadVideos() {
    this._VideoServices.GetVideo().subscribe(
      (data : any) => {
        if(data['success']){
          if(this.videos.length > 0) {
            this.videos = [];
          }
          if(this.samplevideos.length > 0) {
            this.samplevideos = [];
          }
          data['sample_video_data'].forEach(
            (element : any) => {
              this.samplevideos.push({
                name : element.original_name,
                thumbnail : element.thumbnail_video,
                path : element.name,
                id : element.id
              })
              this._VideoServices.sampleVideoData = this.samplevideos;
            }
          )
          data['video_data'].forEach(
            (element : any) => {
              this.videos.push({
                date : this.convertDateFormat(element.date),
                videos : element.videos,
                count: element.videos.length,
                showmore: element.videos.length > 14 ? true:false,
                showless : false
              })
              this._VideoServices.videoData = this.videos;
            }
          );
        }
        this.videos.reverse();
        if(data['video_data'].length > 0){
          this._VideoServices.FileSelectable(true);
        } else {
          this._VideoServices.FileSelectable(false);
        }
        this.showSpinner = false;//hide spinner
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
        }        
        this.showSpinner = false;//hide spinner
      }
    );
  }

  ngOnDestroy(): void {
    this.videos = [];
    this.samplevideos = [];
  }
  ToggleDeleteVideos(){
    this._VideoServices.FileSelected();
  }
}
