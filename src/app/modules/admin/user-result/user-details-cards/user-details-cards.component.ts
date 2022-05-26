import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';
import { UserResultService } from '../../shared/user-result.service';

@Component({
  selector: 'user-details-cards',
  templateUrl: './user-details-cards.component.html',
  styleUrls: ['./user-details-cards.component.scss']
})
export class UserDetailsCardsComponent implements OnInit {
  userData !: any[];
  userListLength !: number;
  requiredUserData !: any[];
  pages : number = 0;
  SearchString : string = '';
  constructor(
    private _UserResultService : UserResultService, //reference to user result service
    private _ToggleAlert : ToggleAlertService
    ) { }

  ngOnInit(): void {
    this._UserResultService.SearchString$.subscribe(
      (str : string) => {
        this.SearchString = str;
      }
    );
    this.GetUsers();
    this._UserResultService.refereshNeeded$.subscribe(
      () => {
        this.userData = [];
        this.userListLength = 0;
        this.GetUsers();
      }
    );
  }

  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }

  Setpagination(){
    this.pages = Math.ceil(this.userListLength / 10);
    this.requiredUserData = this.userData.slice(0, 10);
  }

  GetUsers(){
    this._UserResultService.GetUsers().subscribe(
      (data : any) => {
        this.userData = data.message;
        this.userListLength = this.userData.length;
        this.Setpagination();
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

  DetectPageChange(event : number){
    if(this.userData){
      const listStartPos = (event * 10) - 10;
      this.requiredUserData = this.userData.slice(listStartPos, listStartPos + 10);
    }
  }

}
