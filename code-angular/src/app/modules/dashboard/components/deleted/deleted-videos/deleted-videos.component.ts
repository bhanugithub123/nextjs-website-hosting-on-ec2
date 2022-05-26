import { Component, HostListener, OnInit } from '@angular/core';
import { ToggleAlertService } from '../../../shared/toggle-alert.service';
import { DeleteService } from '../shared/delete.service';

@Component({
  selector: 'deleted-videos',
  templateUrl: './deleted-videos.component.html',
  styleUrls: ['./deleted-videos.component.scss']
})
export class DeletedVideosComponent implements OnInit {

  showSpinner = true;
  _videoCardsVisible!: boolean;
  showMore: boolean = false;
  showLess:boolean = false;
  showmore = false;

  constructor(private _Deleted : DeleteService, private _ToggleAlert : ToggleAlertService) { }
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
    this.LoadVideos();
  }
  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }

  videos : any = [];
  LoadVideos() {
    this._Deleted.LoadDeletedVideos().subscribe(
      (res : any) =>{
        if(res['success']){
          if(this.videos.length > 0) {
            this.videos = [];
          }
          res['deleted_videos'].forEach(
            (element : any) => {
              this.videos.push({
                date : this.convertDateFormat(element.date),
                videos : element.videos,
                count: element.videos.length,
                showmore: element.videos.length > 14 ? true:false,
                showless : false
              })
            }
          )
        }
        this.videos.reverse();
        this.showSpinner = false;
      },
      (err : any) => {
        this.showSpinner = false;
        if(err.status === 0){
          this.ThrowErrorMessage("Address not reachable. Please Try Again Later!");
        }
        else{
          this.ThrowErrorMessage("Something went wrong. Please Try Again Later!");
        }
      }
    );
  }
  

  toggleShow(index : number) {
    this.videos[index].showmore = !this.videos[index].showmore;
    this.videos[index].showless = !this.videos[index].showless;
  }

  

}
