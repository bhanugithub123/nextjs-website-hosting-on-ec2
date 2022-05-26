import { Component, OnInit } from '@angular/core';
import { ToggleAlertService } from '../../../shared/toggle-alert.service';
import { DeleteService } from '../shared/delete.service';

@Component({
  selector: 'deleted-images',
  templateUrl: './deleted-images.component.html',
  styleUrls: ['./deleted-images.component.scss']
})
export class DeletedImagesComponent implements OnInit {

  showSpinner = false;
  _videoCardsVisible!: boolean;
  showMore: boolean = false;
  showLess:boolean = false;
  showmore = false;
  images : any[] = [];

  constructor(
    private _Deleted : DeleteService,//reference to delete service
    private _ToggleAlert : ToggleAlertService// reference to toggle alert service
    ) { }

  ngOnInit(): void {
    this.LoadImages();
  }
  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
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
  LoadImages() {
    this.showSpinner = true;
    this._Deleted.loadDeletedImages().subscribe(
      (res : any) =>{
        if(res['success']){
          if(this.images.length > 0) {
            this.images = [];
          }          
          res['deleted_images'].forEach(
            (element : any) => {
              this.images.push({
                date : this.convertDateFormat(element.date),
                images : element.images,
                count: element.images.length,
                showmore: element.images.length > 14 ? true:false,
                showless : false
              })
            }
          )
        }
        this.images.reverse();
        this.showSpinner = false;
      },
      (err : any) => {
        if(err.status === 0){
          this.ThrowErrorMessage("Address not reachable. Please Try Again Later!");
        }
        else{
          this.ThrowErrorMessage("Something went wrong. Please Try Again Later!");
        }
        this.showSpinner = false;
      }
    );
  }
  

  toggleShow(index : number) {
    this.images[index].showmore = !this.images[index].showmore;
    this.images[index].showless = !this.images[index].showless;
  }

}
