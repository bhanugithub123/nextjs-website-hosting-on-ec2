import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-send-verify-mail',
  templateUrl: './send-verify-mail.component.html',
  styleUrls: ['./send-verify-mail.component.scss']
})
export class SendVerifyMailComponent implements OnInit {

  emailForm ! : FormGroup;
  submitted = false;
  message!: String;
  sending = false;

  constructor(
    private _AuthService : AuthService,
    private _Router : Router
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  get email() {
    return this.emailForm.get('email');
  }

  createForm() {
    this.emailForm = new FormGroup({
      email : new FormControl('', [Validators.required, Validators.email])
    })
  }

  @ViewChild('alert') alertDiv!: ElementRef;
  ThrowErrorMessage(err : string){
    this.message = err;
    this.alertDiv.nativeElement.classList.add('show');
    this.sending = false; 
    setTimeout(() => {
      this.alertDiv.nativeElement.classList.remove('show');
    }, 5000);
  }
  onSubmit() {
    this.sending = true;
    this._AuthService.Resend_mail(this.emailForm.value.email).subscribe(
      (data:any) => {
        if(data['success']){
          this.sending = false;
          this.message = 'Verification email Sent Successfully';
          this.alertDiv.nativeElement.classList.add('show');
          this.sending = false; 
          setTimeout(() => {
            this.alertDiv.nativeElement.classList.remove('show');
          }, 5000);
          setTimeout(() => {
            this._Router.navigate([''])
          }, 7000);
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
