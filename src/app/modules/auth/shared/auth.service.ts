import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) { }

  //sign up api call url
  signUp_Url =  environment.API_URL_HEAD + 'register_user';

  //api call methon for sign up
  Register_User(formData : any) {

    const register_Data = {
        "full_name" : formData.fullName,
        "email" :  formData.email,
        "password" :  formData.password,
        "confirm_password" : formData.confirmPassword
      };

    const opts = {
      headers : new HttpHeaders({
        'content-type' : 'application/json'
      })
    }

    return this.http.post(this.signUp_Url, register_Data, opts);

  }

  //resend mail api url
  resend_Mail_Url = environment.API_URL_HEAD + 'resend_mail';

  //API call method
  Resend_mail(email : any) {

    const resend_data = {
        "email" :  email
    };

    const opts = {
      headers : new HttpHeaders({
        'content-type' : 'application/json'
      })
    }

    return this.http.post(this.resend_Mail_Url, resend_data, opts);

  }

  //Login API url
  login_Url = environment.API_URL_HEAD + 'login_user';

  // login api call method 
  Login_User(user_data : any) {
    const login_data = {
      "email" : user_data.email,
      "password" : user_data.password
    }
    const opts = {
      headers : new HttpHeaders({
        'content-type' : 'application/json'
      })
    }

    return this.http.post(this.login_Url, login_data, opts);
  }

  //forgot password api url
  forgot_Password_Url = environment.API_URL_HEAD + 'forget_password';

  // send reset password link
  Send_Reset_Mail (email : string) {
    const reset_data = {
      "email" : email
    }
    
    const opts = {
      headers : new HttpHeaders({
        'content-type' : 'application/json'
      })
    }

    return this.http.post(this.forgot_Password_Url, reset_data, opts);
  }

  //reset password api url
  reset_Password_Url = environment.API_URL_HEAD + 'reset_password';

  //reset password
  Reset_Password(passwordData : any, token : string) {
    const reset_data = {
      "token" : token,
      "password" : passwordData.password,
      "confirm_password" : passwordData.confirmPassword
    }
    const opts = {
      headers : new HttpHeaders({
        'content-type' : 'application/json'
      })
    }

    return this.http.post(this.reset_Password_Url, reset_data, opts);
  }

  //verify user sign up url
  verify_User_Url = environment.API_URL_HEAD + 'verify_user/';

  //method for api call 
  Verify_User(token : any) {
    const opts = {
      params : new HttpParams(
        {
          fromString : `link=${token}`
        }
      ),
      headers : new HttpHeaders({
        'content-type' : 'application/json'
      })
    }

    return this.http.get(this.verify_User_Url, opts);
  }
}
