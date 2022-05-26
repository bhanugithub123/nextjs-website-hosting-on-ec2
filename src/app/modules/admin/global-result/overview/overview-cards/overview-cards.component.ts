import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';
import { GlobalResultService } from '../../../shared/global-result.service';

@Component({
  selector: 'admin-overview-cards',
  templateUrl: './overview-cards.component.html',
  styleUrls: ['./overview-cards.component.scss']
})
export class OverviewCardsComponent implements OnInit {

  @Input('className') className !: string;

  activeUser !: number;
  blockedUser !: number;
  totalUser !: number;
  totalAmount !: number;

  constructor(
    private _GlobalResultService : GlobalResultService,// reference to gloabl result service
    private _ToggleAlert : ToggleAlertService// reference to toggle alert service
  ) { }

  ngOnInit(): void {
    this.GetStatusDetails();
  }

  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }

  GetStatusDetails(){
    this._GlobalResultService.GetEarningDetails().subscribe(
      (data : any) => {
        this.totalAmount = data.total_amount;
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
    this._GlobalResultService.GetStatusDetails().subscribe(
      (data : any) => {
        this.activeUser = data.active;
        this.blockedUser = data.blocked;
        this.totalUser = data.total_users;
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
