import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(
    private router: Router
    ) { }
  showlogin = false;
  ngOnInit(): void {
    if(localStorage.getItem('Token')){
      this.showlogin = false;
      if(localStorage.getItem('admin') === "True"){
        this.router.navigate(['admin']);
      }
      else{
        this.router.navigate(['home/video']);
      }  
    }
    else{
      this.showlogin = true;
    }
  }
}
