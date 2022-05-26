import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { truncate } from 'fs';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';
import { TopupWalletService } from 'src/app/modules/dashboard/shared/topup-wallet.service';
import { StorageDetailsService } from '../../shared/storage-details.service';
import { TransactionHistoryService } from '../../shared/transaction-history.service';

@Component({
  selector: 'storage-details-modal',
  templateUrl: './storage-details-modal.component.html',
  styleUrls: ['./storage-details-modal.component.scss']
})
export class StorageDetailsModalComponent {

  @Output('CloseModal') CloseModal : EventEmitter<void> = new EventEmitter<void>();
  ShowModal = false;
  available_space = 0;
  user_space = 0;
  used_space = '0 KB';
  percentage_used = '0%';
  amountAvailable = 0;
  memory = 0;
  amount = 0;
  active1 = false;
  active2 = false;
  active3 = false;
  activePlans : any[] = [];
  constructor(
    private _BuyStorage : TopupWalletService, 
    private _ToggleAlert : ToggleAlertService,
    private _StorageDetails : StorageDetailsService,
    private _TransactionHistoryService : TransactionHistoryService
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
    }
  }
  closeModal(){
    this.CloseModal.emit();
  }
  
  setPlan(planNum : number){
    if(planNum === 1){
      this.active1 = !this.active1;
      this.active2 = false;
      this.active3 = false;
      if(this.active1){
        this.memory = 50;
        this.amount = 25;
      }
      else{
        this.memory = 0;
        this.amount = 0;
      }
    }
    else if(planNum === 2){
      this.active2 = !this.active2;
      this.active3 = false;
      if(this.active2){
        this.memory = 20;
        this.amount = 15;
      }
      else{
        this.memory = 0;
        this.amount = 0;
      }
    }
    else if(planNum === 3){
      this.active3 = !this.active3;
      this.active2 = false;
      this.active1 = false;
      if(this.active3){
        this.memory = 10;
        this.amount = 5;
      }
      else{
        this.memory = 0;
        this.amount = 0;
      }
    }
  }
  processing = false;
  BuyStorage(){
    this.processing = true;
    if(!this.active1 && !this.active2 && !this.active3){
      this.processing = false;
      this.ThrowErrorMessage('Please select one of the storage plans');
    }
    if(this.amount > 0){
      this._BuyStorage.buyStorage(this.memory, this.amount).subscribe(
        (res :any) => {
          this.ThrowSuccessMessage(res.message);
          this.active1 = false;
          this.active2 = false;
          this.active3 = false;
          this.processing = false;
        },
        (err : HttpErrorResponse) =>{
          this.checkerr(err);
          this.active1 = false;
          this.active2 = false;
          this.active3 = false;
          this.processing = false;
        }
      );
    }
  }
  ToggleUnsubscribeModal(){
    this.ShowModal = !this.ShowModal;
    if(this.ShowModal){
      this.loadStorageDetails();
      this.LoadAvailableBalance();
      this.GetActivePlans();
    }
  }
  CloseUnsubscribeModal(event : any){
    if(event.target === document.getElementById('modal')){
      this.ToggleUnsubscribeModal()
    }
  }
  convertSpace(memory : number) {
    let space= 0;
    let size = 'KB';
    space = memory;
    if(memory > 1000){
      space = memory / 1024; 
      size = 'MB';
    }
    if(space > 1000){
      space = memory / 1024;
      size = 'GB';
    }
    this.used_space = space.toFixed(2) + ' ' + size;
  }
  calculatePercentUsed(used_memory : number, total_memory : number){
    const mem = used_memory / (1024 * 1024);
    this.percentage_used = ((mem / total_memory) * 100).toFixed(2) + '%';
    this.createCircle(parseFloat(((mem / total_memory) * 100).toFixed(2)));
  }
  @ViewChild('circle1') circle1 !:ElementRef;
  @ViewChild('circle2') circle2 !:ElementRef;
  @ViewChild('halfCircleTop') halfCircleTop !:ElementRef;
  createCircle(percentage : number){
    var scrolledPortionDegree =(percentage * 360) / 100;
    this.circle2.nativeElement.style.transform = `rotate(${scrolledPortionDegree}deg)`;
    if(scrolledPortionDegree < 180){
      this.halfCircleTop.nativeElement.style.opacity = '1';
      this.circle1.nativeElement.style.transform = `rotate(${scrolledPortionDegree}deg)`;
      
    } else {
      this.halfCircleTop.nativeElement.style.opacity = "0";
      this.circle1.nativeElement.style.transform = `rotate(180deg)`;
      
    }
  }
  loadStorageDetails(){
    this._StorageDetails.LoadStorageDetails().subscribe(
      (res : any) =>{
        if(res.success){
          this.available_space = res['available_space'];
          this.user_space = res['occupied_space'];
          this.convertSpace(this.user_space);
          this.calculatePercentUsed(this.user_space, this.available_space);
        }
      },
      (err : HttpErrorResponse) => {
        this.checkerr(err);
      }
    );
  }
  
  LoadAvailableBalance(){
    this._TransactionHistoryService.LoadAvailableBalance().subscribe(
      (res :any) => {
        this.amountAvailable = res.available_balance;
      },
      (err : HttpErrorResponse) =>{
        this.checkerr(err);
      }
    );
  }
  SelectPlan(id : number){
    for(let i = 0; i < this.activePlans.length; i++){
      if(this.activePlans[i]["memory_id"] === id && this.activePlans[i].canUnsubscribe){
        this.activePlans[i]["active"] = !this.activePlans[i]["active"];
        break;
      }
    }
  }
  HandlePlansThatCanBeUnsubscribed(){
    const memoryConsumedInGb = (this.user_space/1024)/1024;
    let totalMemory = this.available_space;
    this.activePlans.forEach(
      (obj : any, idx : number) => {
        totalMemory -= obj.space;
        if(totalMemory < memoryConsumedInGb){
          this.activePlans[idx].canUnsubscribe = false;
        }
      }
    );
  }
  GetActivePlans(){
    this.activePlans = [];
    this._StorageDetails.GetActiveStoragePlans().subscribe(
      (res : any) => {
        res["Memory details"].forEach((obj : any,idx:number) => {
          this.activePlans.push({
            id : idx,
            space : obj.space,
            amount : obj.amount,
            active : false,
            memory_id : obj.memory_id,
            canUnsubscribe : true
          });
        });
        setTimeout(() => {
          this.HandlePlansThatCanBeUnsubscribed();
        }, 500);
      }, (err : HttpErrorResponse) => {
        this.checkerr(err);
      }
    );
  }
  processedAll = false;
  HandleUnsubscribeToStoragePlan(){
    this.processingUnsubscribe = true;
    if(this.activePlans.length === 0){
      this.processingUnsubscribe = false;
    }
    this.activePlans.forEach(
      (obj : any, idx:number)=>{
        if(idx === this.activePlans.length - 1){
          this.processedAll = true;
        }
        if(obj.active){
          this.UnsubscribeToStoragePlan(obj.memory_id);
        } 
        
      }
    );
  }
  processingUnsubscribe = false;
  UnsubscribeToStoragePlan(memory_id : number){
    const payload = new FormData;
    payload.append('memory_id', `${memory_id}`);
    this._BuyStorage.UnsubscribeToStoragePlan(payload).subscribe(
      () => {
        if(this.processedAll){
          this.processingUnsubscribe = false;
          this.ThrowSuccessMessage('Plan unsubsribed!');
          this.ToggleUnsubscribeModal();
        }
      }, (err : HttpErrorResponse) => {
        this.checkerr(err);
      }
    );
  }
}
