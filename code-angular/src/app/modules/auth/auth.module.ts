import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { PasswordChangedComponent } from './password-changed/password-changed.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { SendVerifyMailComponent } from './send-verify-mail/send-verify-mail.component';
import { UserVerifiedComponent } from './user-verified/user-verified.component';

const routes: Routes = [
  {
    path:'', component: AuthComponent,
    children: [
      {
        path: '', component: SignInComponent
      },
      {
        path: 'sign-up', component : SignUpComponent
      },
      {
        path : 'forgot-password', component : ForgotPasswordComponent
      },
      {
        path : 'reset_password/:token', component : NewPasswordComponent
      },
      {
        path : 'password-changed', component : PasswordChangedComponent
      },
      {
        path : 'verify_user/:token', component : VerifyUserComponent
      },
      {
        path : 'send-mail', component : SendVerifyMailComponent
      },
      {
        path : 'verified/:status', component : UserVerifiedComponent
      }
    ]
  }
];

@NgModule({
  declarations: [AuthComponent, SignInComponent, SignUpComponent, ForgotPasswordComponent, NewPasswordComponent, PasswordChangedComponent, VerifyUserComponent, SendVerifyMailComponent, UserVerifiedComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthModule { }
