import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  @ViewChild('alertDanger') alertDiv!: ElementRef;
  sending = false;
  signUpForm ! : FormGroup;
  submitted = false;
  responseError!: string;
  tempEmail!: string;
  viewPassword = false;
  viewConfirmPassword = false;
  showModal = false;

  constructor(
    private authService : AuthService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  get fullName() {
    return this.signUpForm.get('fullName');
  }
  get email() {
    return this.signUpForm.get('email');
  }
  get password() {
    return this.signUpForm.get('password');
  }
  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  createForm() {
    this.signUpForm = new FormGroup({
      fullName : new FormControl('', Validators.required),
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword : new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  ThrowErrorMessage(err : string){
    this.responseError = err;
    this.alertDiv.nativeElement.classList.add('show');
    this.sending = false; 
    setTimeout(() => {
      this.alertDiv.nativeElement.classList.remove('show');
    }, 3000);
  }
  
  onSubmit() {
    this.submitted = true;
    if(this.signUpForm.valid) {
      this.sending = true;
      this.tempEmail = this.signUpForm.value.email;
      this.authService.Register_User(this.signUpForm.value).subscribe(
        (data : any) => {
          if(data['success']){   
            this.sending = false;  
            this.ToogleShowModal();       
            this.submitted = false;
            this.signUpForm.patchValue(
              {
                fullName : '',
                email : '',
                password : '',
                confirmPassword : ''
              }
            )
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

  resend() {
    this.ToogleShowModal();
    this.sending = true;
    this.authService.Resend_mail(this.tempEmail).subscribe(
      (data:any) => {
        if(data['success']){
          this.ToogleShowModal();
          this.sending = false;
        }
      },
      (err : HttpErrorResponse) => {
        this.ThrowErrorMessage(err.error['non_field_errors'])
        this.sending = false;
      }
    )
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

  ToogleShowModal() {
    this.showModal = !this.showModal;
  }

}
