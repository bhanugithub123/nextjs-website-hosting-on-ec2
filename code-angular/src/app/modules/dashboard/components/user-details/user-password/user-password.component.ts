import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDetailsService } from '../../../shared/user-details.service';

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.scss']
})
export class UserPasswordComponent implements OnInit, OnChanges {

  userPasswordForm!: FormGroup;
  @Input() checkPasswordChange!: boolean;
  message = '';
  show = false;
  submitted = false;
  passwordNotMatch = false;

  constructor(
    private _UserDetailsServices : UserDetailsService, //reference to user details service
    private router : Router//reference to router module
    ) { }

  ngOnInit(): void {
    this.createForm();
    this._UserDetailsServices.Discarded$.subscribe(
      () => {
        this.submitted = false;
        this.userPasswordForm.patchValue({
          oldpassword : '',
          newpassword : '',
          confirmpassword : ''
        })
      }
    );
  }

  ngOnChanges(): void {
    if(this.checkPasswordChange && this.userPasswordForm.value.oldpassword.length > 0){
      this.onSubmit();
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

  get oldpassword() {
    return this.userPasswordForm.get('oldpassword');
  }
  get newpassword() {
    return this.userPasswordForm.get('newpassword');
  }
  get confirmpassword() {
    return this.userPasswordForm.get('confirmpassword');
  }

  createForm() {
    this.userPasswordForm = new FormGroup({
      oldpassword : new FormControl('',  [Validators.required, Validators.minLength(6)]),
      newpassword : new FormControl('',  [Validators.required, Validators.minLength(6)]),
      confirmpassword : new FormControl('',  [Validators.required, Validators.minLength(6)])
    })
  }

  MatchPasswords(){
    this.CheckEditDetails();
    if(this.userPasswordForm.value.confirmpassword != this.userPasswordForm.value.newpassword){
      this.passwordNotMatch = true;
    }
    else{
      this.passwordNotMatch = false;
    }
  }
  CheckEditDetails(){
    // if(this.userPasswordForm.value.oldpassword.length > 5) {
    //   if(this.userPasswordForm.value.newpassword.length > 1 && this.userPasswordForm.value.confirmpassword.length > 1){
    //     this._UserDetailsServices._EnableSave$.next(false);
    //   }
    //   else{
    //     this._UserDetailsServices._EnableSave$.next(true);
    //   }
    // }
    // else{
    //   this._UserDetailsServices._EnableSave$.next(true);
    // } 
    if(this.userPasswordForm.value.newpassword.length > 0){
      this._UserDetailsServices._EnableSave$.next(false);
    }
    else{
      this._UserDetailsServices._EnableSave$.next(true);
    }
  }
  onSubmit() {
    this.submitted = true;
    if(this.userPasswordForm.value.oldpassword.length > 5) {
      if(this.userPasswordForm.value.newpassword.length > 5 && this.userPasswordForm.value.confirmpassword.length > 5){
        this._UserDetailsServices.ChangePassword(this.userPasswordForm.value).subscribe(
          (res : any) => {
            if(res.success){
              this.ThrowSuccessMessage('Password Changed Successfully');
              sessionStorage.removeItem('Token');
              localStorage.removeItem('Token');
              sessionStorage.removeItem('email');
              sessionStorage.removeItem('user_name');
              localStorage.removeItem('Date');
              localStorage.removeItem('imageUrl');
              localStorage.removeItem('imageID');
              localStorage.removeItem('imageName');
              localStorage.removeItem('isSample');
              localStorage.removeItem('OpenVideoTitle');
              localStorage.removeItem('OpenVideoDate');
              localStorage.removeItem('OpenVideoID');
              sessionStorage.removeItem('admin');
              localStorage.removeItem('admin');
              sessionStorage.clear();
              localStorage.clear();
              this.router.navigate(['']);
              this.submitted = false;
              this.userPasswordForm.patchValue({
                oldpassword:'',
                newpassword:'',
                confirmpassword:''
              })
            }
          },
          (err : HttpErrorResponse) => {
            // this.submitted = false;
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
  }

  viewPassword = false;
  ToggleShowOld(){
    this.viewPassword = !this.viewPassword;
  }

  viewPasswordNew = false;
  ToggleShowNew(){
    this.viewPasswordNew = !this.viewPasswordNew;
  }

  viewPasswordNewC = false;
  ToggleShowNewC(){
    this.viewPasswordNewC = !this.viewPasswordNewC;
  }

}
