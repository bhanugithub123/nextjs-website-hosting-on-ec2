import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ImageService } from '../../dashboard/shared/image/image.service';
import { ToggleAlertService } from '../../dashboard/shared/toggle-alert.service';
import { TopupWalletService } from '../../dashboard/shared/topup-wallet.service';
import { VideosService } from '../../dashboard/shared/video/videos.service';
import { StorageDetailsService } from '../shared/storage-details.service';

@Component({
  selector: 'common-storage-details',
  templateUrl: './common-storage-details.component.html',
  styleUrls: ['./common-storage-details.component.scss']
})
export class CommonStorageDetailsComponent implements OnInit, AfterViewInit {

  available_space = 0;
  user_space = 0;
  used_space = '0 KB';
  percentage_used = '0%';
  constructor(
    private _ImageService : ImageService,// variable refrence to Image service
    private _VideoService : VideosService, // variable refrence to video service
    private _StorageDetails : StorageDetailsService,
    private _ToggleAlert : ToggleAlertService,
    private _BuyStorage : TopupWalletService
    ) { }

  ngOnInit(): void {
    this.loadStorageDetails();
    this._BuyStorage.refreshNeeded$().subscribe(
      () => {
        this.loadStorageDetails();
      }
    );
    this._VideoService.FileDeleted$().subscribe(
      () => {
        this.loadStorageDetails();
      }
    );
    this._ImageService.FileDeleted$().subscribe(
      () => {
        setTimeout(() => {
          this.loadStorageDetails();
        }, 500);
      }
    );
  }

  ngAfterViewInit(): void {
    this.createCircle(0);
  }
  ShowStorageModal = false;
  ToggleStorageDetails(){
    this.ShowStorageModal = !this.ShowStorageModal;
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

}