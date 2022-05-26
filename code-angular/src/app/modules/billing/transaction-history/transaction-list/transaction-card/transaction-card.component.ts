import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'transaction-card',
  templateUrl: './transaction-card.component.html',
  styleUrls: ['./transaction-card.component.scss']
})
export class TransactionCardComponent implements OnInit, OnChanges {

  @Input() details !: any;
  @Input() filter: string = '';
  details_object = {
    name : '',
    file_url : '',
    feature : '',
    date : '',
    time: '',
    amount : '',
    fullname : '',
    type : 'All'
  }
  credited = false;
  failed = false;
  debited = false;
  imgPresent = false;
  ngOnChanges(): void {
    
    this.details_object.amount = this.details.amount;
    this.details_object.date = this.details.date;
    const ss = this.details.time.split(':')[2];
    const mm = this.details.time.split(':')[1];
    const hh = this.details.time.split(':')[0];
    this.details_object.time = `${parseInt(hh)}:${parseInt(mm)}:${parseInt(ss) > 9 ? parseInt(ss):'0'+ `${parseInt(ss)}` }`;
    if(hh >= 12){
      this.details_object.time += ' PM';
    }
    else{
      this.details_object.time += ' AM';
    }
    if(this.details['transaction_type']==='FAILED'){
      this.details_object.name = 'Transaction failed';
      this.details_object.type = 'Transaction failed';
      this.details_object.feature = 'You tried to add '+ this.details_object.amount + '$ on '+ this.details.date;
      this.failed = true;
      this.details_object.amount = '$' + this.details_object.amount;
    }
    else if(this.details['transaction_type']==='CREDITED'){
      this.details_object.name = 'Amount added';
      this.details_object.type = 'Amount added';
      this.details_object.feature = 'You have added '+ this.details_object.amount + '$ on '+ this.details.date;
      this.credited = true;
      this.details_object.amount = '+ $' + this.details_object.amount;
    }
    else if(this.details['transaction_type']==='DEBITED'){
      if(this.details.file_type==="image"){
        this.details_object.name = this.details.name.slice(0,15) + '...';
        this.details_object.fullname = this.details.name;
        this.details_object.type = 'Images';
        if(this.details.thumbnail){
          this.imgPresent = true;
          this.details_object.file_url = this.details.thumbnail;
        }
        if(this.details.selected_feature){
          this.details_object.feature = this.details.selected_feature;
        }
        else{
          this.details_object.feature = 'Debited';
        }
        this.debited = true;
        this.details_object.amount = '- $' + this.details_object.amount;
      }
      else if(this.details.file_type==="video"){
        this.details_object.name = this.details.video_name.slice(0,15) + '...';
        this.details_object.fullname = this.details.video_name;
        this.details_object.type = 'Videos';
        if(this.details.thumbnail_video){
          this.imgPresent = true;
          this.details_object.file_url = this.details.thumbnail_video;
        }
        if(this.details.selected_features){
          this.details_object.feature = this.details.selected_features;
        }
        else{
          this.details_object.feature = 'Debited';
        }
        this.debited = true;
        this.details_object.amount = '- $' + this.details_object.amount;
      }
      else{
        this.details_object.name = 'Storage buyed';
        this.details_object.fullname = this.details.video_name;
        this.details_object.type = 'Storage buyed';
        if(this.details.thumbnail_video){
          this.imgPresent = true;
          this.details_object.file_url = this.details.thumbnail_video;
        }
        this.details_object.feature ='You bought '+ this.details.space + ' GB on '+ this.details.date;
        this.debited = true;
        this.details_object.amount = '- $' + this.details_object.amount;
      }
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
