import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  _opened: boolean = true;//boolean in reference to sidebar
  globalActive = true;
  usersActive = false;
  innerWidth! : number;
  hamMenu = false;
  appHolderWidth = "100%";
  constructor(
    private _Router : Router,//reference to router module
    private cdRef: ChangeDetectorRef//reference to change detector module
  ) { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth < 989){
      this.hamMenu = true;
      this._opened = false;
      this.appHolderWidth = "calc(100% - 40px)";
    }
  }
  ngAfterViewInit(): void {
    if(this._Router.url.includes("user-details")){
      this.RouteChangedToUsers();
    }
    else{
      this.RouteChangedToGlobal();
    }
    
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth < 989){
      this.hamMenu = true;
      this._opened = false;
      this.appHolderWidth = "calc(100% - 40px)";
    }
    else{
      this.hamMenu = false;
      this._opened = true;
      this.appHolderWidth = "100%";
    }
  }
  ToggleSidebar(){
    this._opened = !this._opened;
    if(this._opened){
      const element: any = document.querySelector('.ng-sidebar__content');
      element.style.transform='translateX(0px)!important';
    }
  }

  RouteChangedToUsers(){
    this.usersActive = true;
    this.globalActive = false;
  }
  RouteChangedToGlobal(){
    this.globalActive = true;
    this.usersActive = false;
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();//detect changes in boolean values when reloaded
  }
  RouteToHome(){
    if(this._Router.url === '/admin'){
      this._Router.navigate(['']);
    } else{
      this._Router.navigate(['/admin']);
    }
  }
}
