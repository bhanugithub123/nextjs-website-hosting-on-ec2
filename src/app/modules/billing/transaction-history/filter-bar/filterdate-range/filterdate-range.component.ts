import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';

@Component({
  selector: 'filterdate-range',
  templateUrl: './filterdate-range.component.html',
  styleUrls: ['./filterdate-range.component.scss']
})
export class FilterdateRangeComponent implements OnInit, AfterViewInit {
  
  Years : string[] = [];
  Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
  Dates : any[] = [];
  total = 0;
  @Input('id') id !: number;
  @ViewChild('day') day !: ElementRef;
  @ViewChild('month') month !: ElementRef;
  @ViewChild('year') year !: ElementRef;
  @ViewChild('today') today !: ElementRef;
  @ViewChild('tomonth') tomonth !: ElementRef;
  @ViewChild('toyear') toyear !: ElementRef;
  @Output('date_range') date_range : EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output('reload') reload : EventEmitter<void> = new EventEmitter<void>();
  constructor(
    private _ToggleAlert : ToggleAlertService
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
        this.Dates.push(
          {
            value : `${i}`,
            label : `0${i}`
          }
        );
      }
      else{
        this.Dates.push({
          value : `${i}`,
          label : `${i}`
        });
      }
    }
    for(let i = 21 ; i < 70; i++){
      this.Years.push(`20${i}`)
    }
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }
  setDefaultValues(){
    this.day.nativeElement.selectedIndex = 'null';
    this.month.nativeElement.selectedIndex = 'null';
    this.year.nativeElement.selectedIndex = 'null';
    this.today.nativeElement.selectedIndex = 'null';
    this.tomonth.nativeElement.selectedIndex = 'null';
    this.toyear.nativeElement.selectedIndex = 'null';
  }
  ngAfterViewInit(): void {
    this.setDefaultValues();
  }
  onSearch(){
    let flag = true;
    let [month, date, year]    = new Date().toLocaleDateString("en-US").split("/");
    const fromDate = `${this.day.nativeElement.value}-${this.month.nativeElement.value < 10?`0${this.month.nativeElement.value}`:this.month.nativeElement.value}-${this.year.nativeElement.value}`;
    const toDate = `${this.today.nativeElement.value}-${this.tomonth.nativeElement.value < 10?`0${this.tomonth.nativeElement.value}`:this.tomonth.nativeElement.value}-${this.toyear.nativeElement.value}`;
    if(this.day.nativeElement.value === 'null' || this.month.nativeElement.value === 'null' || this.year.nativeElement.value === 'null' || this.today.nativeElement.value === 'null' || this.tomonth.nativeElement.value === 'null' || this.toyear.nativeElement.value === 'null'){
      this.ThrowErrorMessage('Please choose a valid date');
      flag = false;
    }
    if(!this.isValidDate(parseInt(this.month.nativeElement.value), parseInt(this.day.nativeElement.value)) || !this.isValidDate(parseInt(this.tomonth.nativeElement.value), parseInt(this.today.nativeElement.value))){
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
      this.date_range.emit([fromDate, toDate]);
    }
  }
  onRefresh(){
    this.setDefaultValues();
    this.reload.emit();
  }
}
