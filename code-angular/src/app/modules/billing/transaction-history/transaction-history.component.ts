import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToggleAlertService } from '../../dashboard/shared/toggle-alert.service';
import { TopupWalletService } from '../../dashboard/shared/topup-wallet.service';
import { TransactionHistoryService } from '../shared/transaction-history.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit {

  amountAvailable = 0;
  Filtered_transaction_details : any[] = [];
  data_loaded = false;
  filter = '';
  constructor(
    private _BuyStorage : TopupWalletService,
    private _TransactionHistoryService : TransactionHistoryService,
    private _ToggleAlert : ToggleAlertService
    ) { }
  
  ngOnInit(): void {
    this.LoadTransactionHistory();
    this.LoadAvailableBalance();
    this._BuyStorage.refreshNeeded$().subscribe(
      () => {
        this.LoadAvailableBalance();
        this.LoadTransactionHistory();
      }
    );
  }

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
  LoadTransactionHistoryDateFilter(event : string[]){
    this.data_loaded = false;
    this._TransactionHistoryService.LoadTransactionHistoryDateFilter(event[0], event[1]).subscribe(
      (res :any) => {
        this.Filtered_transaction_details = res['payment history'].reverse();
        this.data_loaded = true;
      },
      (err : HttpErrorResponse) =>{
        this.checkerr(err);
        this.LoadTransactionHistory();
      }
    );
  }

  LoadTransactionHistory(){
    this.data_loaded = false;
    this._TransactionHistoryService.LoadTransactionHistory().subscribe(
      (res :any) => {
        this.Filtered_transaction_details = res['payment history'].reverse();
        this.data_loaded = true;
      },
      (err : HttpErrorResponse) =>{
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

  Filter(name : string){
    this.filter = name;
  }

}
