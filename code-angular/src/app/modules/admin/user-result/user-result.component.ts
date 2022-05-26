import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-result',
  templateUrl: './user-result.component.html',
  styleUrls: ['./user-result.component.scss']
})
export class UserResultComponent implements OnInit {

  constructor(private _Router : Router) { }

  ngOnInit(): void {
    if(this._Router.url.includes('video')){
      this.showVideoIconActive = true;
      this.showImageIconActive = false;
      this.videoLinkactive = true;
    }
    else{
      this.showVideoIconActive = false;
      this.showImageIconActive = true;
      this.videoLinkactive = false;
    }
  }

  showVideoIconActive = true;
  showImageIconActive = false;
  videoLinkactive = true;

  ToggleVideoIcon(){
    if(!this.videoLinkactive){
      this.showVideoIconActive = !this.showVideoIconActive;
    }
  }

  ToggleImageIcon(){
    if(this.videoLinkactive){
      this.showImageIconActive = !this.showImageIconActive;
    }
  }

  ToggleVideoOn(){
    this.videoLinkactive = true;
    this.showVideoIconActive = true;
    this.showImageIconActive = false;
  }
  ToggleVideoOff(){
    this.videoLinkactive = false;
    this.showVideoIconActive = false;
    this.showImageIconActive = true;
  }

}
