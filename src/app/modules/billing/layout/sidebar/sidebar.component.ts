import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';
import { TopupWalletService } from 'src/app/modules/dashboard/shared/topup-wallet.service';
import { UploadFileService } from 'src/app/modules/dashboard/shared/upload/upload-file.service';
import { TransactionHistoryService } from '../../shared/transaction-history.service';

@Component({
  selector: 'billing-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  _opened: boolean = true;//boolean in reference to sidebar
  storageActive = false;
  transactionActive = true;
  innerWidth! : number;
  hamMenu = false;
  appHolderWidth = "100%";
  amountAvailable = 0;
  proccessingTopup = false;
  constructor(
    private _Router : Router,//reference to router module
    private cdRef: ChangeDetectorRef,//reference to change detector module
    private _TransactionHistoryService : TransactionHistoryService,
    private _ToggleAlert : ToggleAlertService,
    private _TopUp : TopupWalletService,
    private _UploadFileService : UploadFileService
  ) { }

  ngOnInit(): void {
    this._UploadFileService.FileUploaded$().subscribe(
      () => {
        this.LoadAvailableBalance();
      }
    );
    this.innerWidth = window.innerWidth;
    if(this.innerWidth < 989){
      this.hamMenu = true;
      this._opened = false;
      this.appHolderWidth = "calc(100% - 40px)";
    }
    this._TopUp.refreshNeeded$().subscribe(
      () => {
        this.LoadAvailableBalance();
      }
    );
    if(this._TopUp.UserBalance > 0){
      this.amountAvailable = this._TopUp.UserBalance;
    }
    else{
      this.LoadAvailableBalance();
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth < 989){
      this.hamMenu = true;
      this._opened = false;
      this.appHolderWidth = "calc(100% - 40px)";
    }
    else{
      this.hamMenu = false;
      this._opened = true;
      this.appHolderWidth = "100%";
    }
  }
  ToggleSidebar(){
    this._opened = !this._opened;
    if(this._opened){
      const element: any = document.querySelector('.ng-sidebar__content');
      element.style.transform='translateX(0px)!important';
    }
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();//detect changes in boolean values when reloaded
  }
  showPayNowModal = false;
  TogglePayNowModal(){
    this.showPayNowModal = !this.showPayNowModal;
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
    }
  }
  LoadAvailableBalance(){
    this._TransactionHistoryService.LoadAvailableBalance().subscribe(
      (res :any) => {
        this._TopUp.UserBalance = res.available_balance;
        this.amountAvailable = res.available_balance;
      },
      (err : HttpErrorResponse) =>{
        this.checkerr(err);
      }
    );
  }
  @ViewChild('value') value !: ElementRef;
  InitiateTransaction(){
    this.proccessingTopup = true;
    if(this.value.nativeElement.value.length < 1){
      this.proccessingTopup = false;
      this.ThrowErrorMessage("Please enter a valid amount!");
    }
    else if(this.value.nativeElement.value < 1){
      this.proccessingTopup = false;
      this.ThrowErrorMessage("Please enter an amount either equal to $1 or greater!");
    }
    else if(this.value.nativeElement.value % 1 != 0){
      this.proccessingTopup = false;
      this.ThrowErrorMessage("Please enter a non-decimal amount");
    }
    else{
      this._TopUp.TopUp(this.value.nativeElement.value).subscribe(
          (res : any)=> {
            this.proccessingTopup = false;
            window.open(res.url,'_self'); 
          },
          (err :HttpErrorResponse) => {
            this.checkerr(err);
          }
        );
    }
  }
  PreventChars(evt : any){
    if (evt.which < 48 || evt.which > 57)
    {
        evt.preventDefault();
    }
  }
  ClosePayNowModal(event : any){
    if(event.target === document.getElementById('paynow-modal')){
      this.TogglePayNowModal();
    }
  }
  RouteToHome(){
    if(this._Router.url === '/home/video' || this._Router.url === '/home/image'){
      this._Router.navigate(['']);
    } else{
      this._Router.navigate(['/home/video']);
    }
  }
}
