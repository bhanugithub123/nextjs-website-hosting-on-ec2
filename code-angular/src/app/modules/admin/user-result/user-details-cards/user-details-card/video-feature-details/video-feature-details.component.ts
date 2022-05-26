import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UserResultService } from 'src/app/modules/admin/shared/user-result.service';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';

@Component({
  selector: 'video-feature-details',
  templateUrl: './video-feature-details.component.html',
  styleUrls: ['./video-feature-details.component.scss']
})
export class VideoFeatureDetailsComponent implements OnInit, AfterViewInit {

  Years : string[] = [];
  Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
  Dates : string[] = [];
  total = 0;
  @Input('id') id !: number;
  @ViewChild('day') day !: ElementRef;
  @ViewChild('month') month !: ElementRef;
  @ViewChild('year') year !: ElementRef;
  @ViewChild('today') today !: ElementRef;
  @ViewChild('tomonth') tomonth !: ElementRef;
  @ViewChild('toyear') toyear !: ElementRef;
  fromDate = '01-01-2021';
  toDate = '01-01-2021';
  
  FeatureObject = {
    label : '0',
    face : '0',
    person : '0',
    safe : '0',
    logo : '0',
    object : '0',
    shot: '0',
    text: '0',
    speech : '0'
  };
  FeatureObjectPercentage = {
    label : '0',
    face : '0',
    person : '0',
    safe : '0',
    logo : '0',
    object : '0',
    shot: '0',
    text: '0',
    speech : '0'
  };

  

  constructor(
    private _UserResultService : UserResultService, //reference to user reult service
    private _ToggleAlert : ToggleAlertService//reference to toggle alert service
  ) { }
  isValidDate(month: number, day: number) {
    if((month === 2 || month === 4 || month === 6 || month === 9 || month === 11) && day > 30){
      return false;
    }
    if(month === 2 && day >= 29){
      return false;
    }
    return true;
  }
  ngOnInit(): void {
    for(let i = 1 ; i < 32; i++){
      if(i < 10){
        this.Dates.push(`0${i}`);
      }
      else{
        this.Dates.push(`${i}`);
      }
    }
    for(let i = 21 ; i < 70; i++){
      this.Years.push(`20${i}`)
    }
    
  }

  ngAfterViewInit(): void {
    let [month, date, year]    = new Date().toLocaleDateString("en-US").split("/");
    this.toDate = '01-'+'0' + `${parseInt(month) - 1}`+'-2021';
    this.day.nativeElement.selectedIndex = 'null';
    this.month.nativeElement.selectedIndex = 'null';
    this.year.nativeElement.selectedIndex = 'null';
    this.today.nativeElement.selectedIndex = 'null';
    this.tomonth.nativeElement.selectedIndex = 'null';
    this.toyear.nativeElement.selectedIndex = 'null';  
  
  }

  onChange(){
    this.FeatureObject.face = '0';
    this.FeatureObject.label = '0';
    this.FeatureObject.logo = '0';
    this.FeatureObject.safe = '0';
    this.FeatureObject.object = '0';
    this.FeatureObject.person = '0';
    this.FeatureObject.shot = '0';
    this.FeatureObject.speech = '0';
    this.FeatureObject.text = '0';
    //calculate total feature used
    this.total = 0;
    //calculate percentage of each feature
    setTimeout(() => {
      this.FeatureObjectPercentage.face = '0';
      this.FeatureObjectPercentage.label = '0';
      this.FeatureObjectPercentage.logo = '0';
      this.FeatureObjectPercentage.safe = '0';
      this.FeatureObjectPercentage.object = '0';
      this.FeatureObjectPercentage.person = '0';
      this.FeatureObjectPercentage.shot = '0';
      this.FeatureObjectPercentage.speech = '0';
      this.FeatureObjectPercentage.text = '0';
    }, 500);
    if(this.month.nativeElement.value < 10){
      this.fromDate = `${this.day.nativeElement.value}-0${this.month.nativeElement.value}-${this.year.nativeElement.value}`;
    }
    else{
      this.fromDate = `${this.day.nativeElement.value}-${this.month.nativeElement.value}-${this.year.nativeElement.value}`;
    }
    if(this.tomonth.nativeElement.value < 10){
      this.toDate = `${this.today.nativeElement.value}-0${this.tomonth.nativeElement.value}-${this.toyear.nativeElement.value}`;
    }
    else{
      this.toDate = `${this.day.nativeElement.value}-${this.tomonth.nativeElement.value}-${this.toyear.nativeElement.value}`;
    }
    let flag = true;
    let [month, date, year]    = new Date().toLocaleDateString("en-US").split("/");
    const fromDate = `${this.day.nativeElement.value}-${this.month.nativeElement.value < 10?`0${this.month.nativeElement.value}`:this.month.nativeElement.value}-${this.year.nativeElement.value}`;
    const toDate = `${this.today.nativeElement.value}-${this.tomonth.nativeElement.value < 10?`0${this.tomonth.nativeElement.value}`:this.tomonth.nativeElement.value}-${this.toyear.nativeElement.value}`;
    if(!this.isValidDate(parseInt(this.month.nativeElement.value), parseInt(this.day.nativeElement.value)) || !this.isValidDate(parseInt(this.tomonth.nativeElement.value), parseInt(this.today.nativeElement.value))){
      this.ThrowErrorMessage('Please choose a valid date');
      flag = false;
    }
    if(this.day.nativeElement.value === 'null' || this.month.nativeElement.value === 'null' || this.year.nativeElement.value === 'null' || this.today.nativeElement.value === 'null' || this.tomonth.nativeElement.value === 'null' || this.toyear.nativeElement.value === 'null'){
      this.ThrowErrorMessage('Please choose a valid date');
      flag = false;
    }
    if(parseInt(this.tomonth.nativeElement.value) > parseInt(month) || parseInt(this.toyear.nativeElement.value) > parseInt(year) || parseInt(this.month.nativeElement.value) > parseInt(month) || parseInt(this.year.nativeElement.value) > parseInt(year)){
      this.ThrowErrorMessage('Search date yet to come');
      flag = false;
    }
    if(parseInt(this.toyear.nativeElement.value) <= parseInt(year) && parseInt(this.tomonth.nativeElement.value) === parseInt(month)){
      if(this.today.nativeElement.value > date){
        this.ThrowErrorMessage('Search date yet to come');
        flag = false;
      }      
    }
    if(parseInt(this.year.nativeElement.value) <= parseInt(year) && parseInt(this.month.nativeElement.value) === parseInt(month)){
      if(this.day.nativeElement.value > date){
        this.ThrowErrorMessage('Search date yet to come');
        flag = false;
      }      
    }
    if(parseInt(this.year.nativeElement.value) > parseInt(this.toyear.nativeElement.value) || parseInt(this.month.nativeElement.value) > parseInt(this.tomonth.nativeElement.value)){
      this.ThrowErrorMessage('Please choose correct date range');
      flag = false;
    }
    if(parseInt(this.year.nativeElement.value) <= parseInt(this.toyear.nativeElement.value) ){
      if(parseInt(this.day.nativeElement.value) > parseInt(this.today.nativeElement.value) && parseInt(this.month.nativeElement.value) === parseInt(this.tomonth.nativeElement.value)){
        this.ThrowErrorMessage('Please choose correct date range');
        flag = false;
      }
      
    }
    if(flag){
      this.LoadData(this.id, this.fromDate, this.toDate);
    }
    
  }

  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }

  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }

  LoadData(id : number, from : string, to : string) {
    this._UserResultService.GetVideoFeaturesDetails(id, from, to).subscribe(
      (res : any) => {
        // save count in local variable
        this.FeatureObject.face = res.message[0].face_detection;
        this.FeatureObject.label = res.message[0].label_detection;
        this.FeatureObject.logo = res.message[0].logo_detection;
        this.FeatureObject.safe = res.message[0].explicit_content_detection;
        this.FeatureObject.object = res.message[0].object_tracking;
        this.FeatureObject.person = res.message[0].person_detection;
        this.FeatureObject.shot = res.message[0].shot_detection;
        this.FeatureObject.speech = res.message[0].speech_transcription;
        this.FeatureObject.text = res.message[0].text_detection;
        //calculate total feature used
        this.total = parseInt(this.FeatureObject.face) + parseInt(this.FeatureObject.label) + parseInt(this.FeatureObject.logo) + parseInt(this.FeatureObject.safe) + parseInt(this.FeatureObject.speech) + parseInt(this.FeatureObject.text) + parseInt(this.FeatureObject.shot) + parseInt(this.FeatureObject.person) + parseInt(this.FeatureObject.object); 
        //calculate percentage of each feature
        setTimeout(() => {
          this.FeatureObjectPercentage.face = Math.floor((parseInt(this.FeatureObject.face) / this.total) * 100).toString();
          this.FeatureObjectPercentage.label = Math.floor((parseInt(this.FeatureObject.label) / this.total) * 100).toString();
          this.FeatureObjectPercentage.logo = Math.floor((parseInt(this.FeatureObject.logo) / this.total) * 100).toString();
          this.FeatureObjectPercentage.safe = Math.floor((parseInt(this.FeatureObject.safe) / this.total) * 100).toString();
          this.FeatureObjectPercentage.object = Math.floor((parseInt(this.FeatureObject.object) / this.total) * 100).toString();
          this.FeatureObjectPercentage.person = Math.floor((parseInt(this.FeatureObject.person) / this.total) * 100).toString();
          this.FeatureObjectPercentage.shot = Math.floor((parseInt(this.FeatureObject.shot) / this.total) * 100).toString();
          this.FeatureObjectPercentage.speech = Math.floor((parseInt(this.FeatureObject.speech) / this.total) * 100).toString();
          this.FeatureObjectPercentage.text = Math.floor((parseInt(this.FeatureObject.text) / this.total) * 100).toString();
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
      }
    );
  }

}
