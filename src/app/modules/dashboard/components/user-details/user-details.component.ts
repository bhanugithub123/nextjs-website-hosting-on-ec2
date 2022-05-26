import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserDetailsService } from '../../shared/user-details.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  newProfileImageUploaded = false;
  file! : File | null;
  message = '';
  show = false;
  showSpinner = false;
  checkPasswordChange = false;
  clearFile = false;
  saveDisabled = true;

  onUploadNotify(event : any) {
    this.newProfileImageUploaded = event;
  }

  UploadedFile(event : any){
    this.file = event;
    if(this.file){
      this.saveDisabled = false;
    }
  }

  constructor(private userDetailsService : UserDetailsService) { }

  ngOnInit(): void {
    this.userDetailsService.setHideUpload$();
    this.userDetailsService.EnableSave$.subscribe(
      (status : boolean) => {
        if(status){
          this.saveDisabled = true;
        }
        else{
          this.saveDisabled = false;
        }
      }
    );
  }

  submit() {
    this.checkPasswordChange = true;
    setTimeout(() => {
      this.checkPasswordChange = false;
    }, 500);
    if(this.newProfileImageUploaded) {
      this.upload();
    }
  }
  ThrowErrorMessage(msg: string){
    this.message = msg;
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 3000);
  }
  ThrowSuccessMessage(msg : string){
    this.message = msg;
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 3000);
  }
  
  upload() {
    this.showSpinner = true;
    this.saveDisabled = true;
    if(this.file != null) {
      this.userDetailsService.Upload_Image(this.file).subscribe(
        () => {
          this.ThrowSuccessMessage("Profile Pic Uploaded Successfully!");
          this.showSpinner = false;
          this.newProfileImageUploaded = false;
        },
        (err : HttpErrorResponse) => {
          this.showSpinner = false;
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
      )
    }
  }
  
  clear(){
    this.userDetailsService._Discarded$.next();
    this.newProfileImageUploaded = false;
    this.clearFile = true;
    setTimeout(() => {
      this.clearFile = false;
    }, 500);
  }
}
