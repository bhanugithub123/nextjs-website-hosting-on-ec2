import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { errorMonitor } from 'stream';
import { AuthService } from '../shared/auth.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  @ViewChild('alert') alertDiv!: ElementRef;
  @ViewChild('remember') remember !: ElementRef;
  signInForm ! : FormGroup;
  submitted = false;
  responseError! : string;
  viewPassword = false;
  rememberMe = false;
  message = '';
  showSpinner = false;
  constructor(
    private router: Router,
    private authService : AuthService
    ) { }

  ngOnInit(): void {
    this.createForm();
    
  }

  get email() {
    return this.signInForm.get('email');
  }
  get password() {
    return this.signInForm.get('password');
  }

  createForm() {
    this.signInForm = new FormGroup({
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }
  ThrowErrorMessage(msg : string){
    this.message = msg;
    this.alertDiv.nativeElement.classList.add('show');
    setTimeout(() => {
      this.alertDiv.nativeElement.classList.remove('show');
    }, 5000);
  }

  onSubmit() {
    this.submitted = true;
    this.showSpinner = true;
    if(this.signInForm.valid) {
      this.authService.Login_User(this.signInForm.value).subscribe(
        (data : any) => {
          if(this.rememberMe){
            localStorage.setItem('Token', data['token']);
            localStorage.setItem('user_Name', data['full_name']);
            localStorage.setItem('email', data['email']);
            localStorage.setItem('admin', data['is_admin']);
            localStorage.setItem('User_id', data['user_id']);
          }
          else {
            sessionStorage.setItem('Token', data['token']);
            sessionStorage.setItem('user_Name', data['full_name']);
            sessionStorage.setItem('email', data['email']);
            sessionStorage.setItem('admin', data['is_admin']);
            sessionStorage.setItem('User_id', data['user_id']);
          }
          this.showSpinner = false;
          if(data['is_admin'] === "True"){
            this.router.navigate(['admin']);
          }
          else{
            this.router.navigate(['home/video']);
          }            
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
          
          this.submitted = false;
        }
      )
    }
    else{
      this.showSpinner = false;
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
  onChange(event : any) {
    if(this.rememberMe){
      this.rememberMe = false;
      event.target.parentNode.classList.remove('checked');
    }
    else {
      this.rememberMe = true;
      event.target.parentNode.classList.add('checked');
    }
    
  }
  
  ToogleCheckBox(ev : any){
    const element = document.getElementById('remember-me');
    if(this.rememberMe){
      this.rememberMe = false;
      element!.classList.remove('checked');
    }
    else {
      this.rememberMe = true;
      element!.classList.add('checked');
    }
  }
}
