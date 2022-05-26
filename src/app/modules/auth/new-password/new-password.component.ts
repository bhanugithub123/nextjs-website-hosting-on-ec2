import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {

  passwordForm ! : FormGroup;
  submitted = false;
  resetToken! : string;
  viewPassword = false;
  viewConfirmPassword = false;
  responseError!: string;
  @ViewChild('alertDanger') alertDiv!: ElementRef;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService : AuthService
    ) { }

  ngOnInit(): void {
    this.createForm();
    this.resetToken = this.activatedRoute.snapshot.params.token;
  }

  get password() {
    return this.passwordForm.get('password');
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  createForm() {
    this.passwordForm = new FormGroup({
      password : new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword : new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }
  ThrowErrorMessage(err : string){
    this.responseError = err;
    this.alertDiv.nativeElement.classList.add('show');
    setTimeout(() => {
      this.alertDiv.nativeElement.classList.remove('show');
    }, 3000);
  }

  onSubmit() {
    this.submitted = true;
    if(this.passwordForm.valid) {
      this.authService.Reset_Password(this.passwordForm.value, this.resetToken).subscribe(
        (data : any) => {
          if(data['success']) {
            this.router.navigate(['/user/password-changed']);
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
      )
    }
    
  }

  TogglePasswordView() {
    if(this.viewPassword){
      this.viewPassword = false;
    }
    else {
      this.viewPassword = true;
    }
  }

  ToggleConfirmPasswordView() {
    if(this.viewConfirmPassword){
      this.viewConfirmPassword = false;
    }
    else {
      this.viewConfirmPassword = true;
    }
  }


}
