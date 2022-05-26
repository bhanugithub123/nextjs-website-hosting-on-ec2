import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  token : string | null;
  admin : string | null;
  setToken(){
    if(sessionStorage.getItem('Token') === null) {
      this.token = localStorage.getItem('Token')
    }
    else {
      this.token = sessionStorage.getItem('Token');
    }
  }
  constructor(private _Router : Router) {
    if(sessionStorage.getItem('Token') === null) {
      this.token = localStorage.getItem('Token')
    }
    else {
      this.token = sessionStorage.getItem('Token');
    }
    if(sessionStorage.getItem('admin') === null) {
      this.admin = localStorage.getItem('admin')
    }
    else {
      this.admin = sessionStorage.getItem('admin');
    }
  }
  canActivate(): boolean 
  {
    this.setToken();
    if(this.token === null){
      this._Router.navigate(['']);
      return false;
    }
    else{
      if((sessionStorage.getItem('admin') === "True" || localStorage.getItem('admin') === "True")){
        this._Router.navigate(['admin']);
        return false;
      }
      else{
        return true;
      }
    }
    
  }
  canLoad(): boolean
    {
      if(this.token === null){
        this._Router.navigate(['']);
        return false;
      }
      else{
        if((sessionStorage.getItem('admin') === "True" || localStorage.getItem('admin') === "True")){
          this._Router.navigate(['admin']);
          return false;
        }
        else{
          return true;
        }
      }
  }
}
