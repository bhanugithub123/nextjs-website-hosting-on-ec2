import { AfterViewInit, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements AfterViewInit {
  @Input('Videos') Videos !: any;

  constructor( private _Router : Router) { }

  availableVideos : any[] = [];

  ngAfterViewInit(): void {
    this.availableVideos = this.Videos;
  }
  RouteToDetails(){
    this._Router.navigate([`/home/videoDetails/${localStorage.getItem('OpenVideoID')}`]);
    this._Router.routeReuseStrategy.shouldReuseRoute = function () { //important reload function
      return false;
    };
  }
  OpenVideo(event : any){
    localStorage.setItem('OpenVideoTitle', `${event[0]}`);
    localStorage.setItem('OpenVideoID',`${event[1]}`);
    this.RouteToDetails();
  }

}


