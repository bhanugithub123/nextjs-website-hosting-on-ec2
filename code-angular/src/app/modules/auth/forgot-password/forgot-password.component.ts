import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  emailForm ! : FormGroup;
  submitted = false;
  message: string = 'An Email will be send to the above address with Password change instructions.';
  showMessage = false;
  responseError! : string;
  responseMessage! : string;

  constructor(private authService : AuthService) { }

  ngOnInit(): void {
    this.createForm()
  }

  get email() {
    return this.emailForm.get('email');
  }

  createForm() {
    this.emailForm = new FormGroup({
      email : new FormControl('', [Validators.required, Validators.email])
    })
  }
  sending = false;
  onSubmit() {
    this.submitted = true;
    if(this.emailForm.valid) {
      this.sending = true;
      this.authService.Send_Reset_Mail(this.emailForm.value.email).subscribe(
        (data : any) => {
          if(data['success']) {
            this.sending = false;
            this.showMessage = true;
            this.responseMessage = data['message'];
          }
        },
        (err : HttpErrorResponse) => {
          if(err.status === 0){
            this.responseError = "Address Not Reachable.Please Try Again!";
          }
          if(err.status === 504){
            this.responseError = "Server Not Responding.Please Try Again!";
          }
          if(err.status === 500){
            this.responseError = "Internal Server Error.Please Try Again!";
          }
          else{
            this.responseError = err.error['non_field_errors'];
          }          
          this.sending = false;
          this.submitted = false;
        }
      )
    }
  }

  emptyError() {
    this.responseError = '';
  }


}
