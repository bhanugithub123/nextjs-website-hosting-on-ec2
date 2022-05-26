import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';
import { UserResultService } from '../../../shared/user-result.service';

@Component({
  selector: 'user-details-card',
  templateUrl: './user-details-card.component.html',
  styleUrls: ['./user-details-card.component.scss']
})
export class UserDetailsCardComponent implements OnInit, AfterViewChecked, AfterViewInit {
  @Input('data') data !: any;
  deactivated = false;
  name = '';
  status = '';
  id !: number;
  showPopup = false;
  amountSpent !: number;
  creditsAvailable !: number;
  spaceAvailable !: number;
  spaceAllocated !: number;
  UserBlocked = false;
  videoComponentActive = true;
  ToggleActive = false;
  @ViewChild('blockcheckbox') checkbox !: ElementRef;
  constructor(
    private _UserResultService : UserResultService, //reference to user reult service
    private _ToggleAlert : ToggleAlertService//reference to toggle alert service
    ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.id = this.data.user_id;
    this.name = this.data.user_name;
    if(this.data.status){
      this.status = 'Active';
    }
    else{
      this.status='Deactivated';
    }
    if(this.data["blocked_status"]){
      this.status =  'Blocked';
      this.UserBlocked = true;
    }

    this.deactivated = (this.status === 'Deactivated' || this.status === 'Blocked'? true : false);
  }

  ngAfterViewChecked(): void {
    if(this.data["blocked_status"]){
      if(this.checkbox){
        this.checkbox.nativeElement.setAttribute('checked', '');
      }
    }
  }

  OpenModal(){
    this.showPopup = true;
    this.GetDetailsById();
  }

  CloseModal(){
    this.showPopup = false;
  }
  ImageComponentActive = false;
  videoCompActive = true;
  onImageHover(){
    if(this.videoComponentActive){
      this.ImageComponentActive = !this.ImageComponentActive;
    }
  }
  onVideoHover() {
    if(!this.videoComponentActive){
      this.videoCompActive = !this.videoCompActive;
    }
  }

  ToggleVideComponent(){
    this.videoComponentActive = true;
    this.ImageComponentActive = false;
    this.videoCompActive = true;
  }

  ToggleImageComponent(){
    this.videoComponentActive = false;
    this.ImageComponentActive = true;
    this.videoCompActive = false;
  }

  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }

  GetDetailsById(){
    this._UserResultService.GetUserDetails(this.id).subscribe(
      (data : any) => {
        this.amountSpent = data.amount_spent;
        this.creditsAvailable = data.credits_available;
        this.spaceAllocated = data.space_allocation;
        this.spaceAvailable = data.space_available;
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
  ToggleStatus(){
    this.ToggleActive = true;
    if(this.UserBlocked){
      if(this.checkbox){
        this.checkbox.nativeElement.removeAttribute('checked', '');
      }
    }
    else{
      if(this.checkbox){
        this.checkbox.nativeElement.setAttribute('checked', '');
      }
    }
    this.UserBlocked = !this.UserBlocked;
  }

  Submit(){
    if(this.ToggleActive){
      this._UserResultService.BlockUser(this.id, this.UserBlocked).subscribe(
        (res : any) => {
          if(res.success){
            if(this.UserBlocked){
              this.ThrowSuccessMessage('User Blocked Successfully!');
            }
            else{
              this.ThrowSuccessMessage('User Unblocked Successfully!');
            }
            this.CloseModal();
          }
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
    else{
      this.CloseModal();
    }
  }

  CloseModalFromWrapper(event : any){
    if(event.target === document.getElementById('pop-main')){
      this.CloseModal();
    }
  }
}
