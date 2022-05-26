import { Component, Input, OnInit } from '@angular/core';
import { VideosService } from 'src/app/modules/dashboard/shared/video/videos.service';

@Component({
  selector: 'logo-detection',
  templateUrl: './logo-detection.component.html',
  styleUrls: ['./logo-detection.component.scss']
})
export class LogoDetectionComponent implements OnInit {

  @Input() info!: any;

  constructor(private _videoService : VideosService) { }

  ngOnInit(): void {
    
  }

  objects: any = [];
  contentPresent = false;
  searchTerm = '';
  onSearch(ev : any){
    this.searchTerm = ev.target.value;
  }
  convertTime(seconds: any, minutes: number, hours: number) {
    if(seconds > 60){
      minutes = Math.floor(seconds / 60);
      seconds = seconds - (minutes * 60);     
    }
    if(minutes > 60){
      hours = Math.floor(minutes / 60);
      minutes = minutes - (hours * 60)
    }
    seconds = Math.round(seconds);
    var ss = `0${seconds}`;
    if(seconds > 9){
      ss = `${seconds}`;
    }
    var mm = `0${minutes}`;
    if(minutes > 9){
      mm = `${minutes}`
    }
    var hh = `0${hours}`;
    if(hours > 9){
      hh = `${hours}`
    }

    return [ss, mm, hh];
  }
  sort(list : any){//sort the data time wise
    const len = list.length;
    for (let i = 0; i < len-1; i++) {
      for (let j = 0; j < len-i-1; j++) {
        if (list[j].time > list[j+1].time) 
          { 
            const temp = list[j]; 
            list[j] = list[j+1]; 
            list[j+1] = temp; 
          } 
      }      
    }
  }
  ngOnChanges(): void {
    if(this.info){
      this.contentPresent = true;
      if(this.info.length > 0) {
        this.info.forEach((f : any) => {
          const time = this.convertTime(f.tracks[0].start_time_offset, 0, 0);
          this.objects.push(
            {
              entity : f.description,
              time : `${time[2]}:${time[1]}:${time[0]}`,
              active_clock : false,
              active : false,
              confidence : Math.floor(f.tracks[0].confidence * 100) + '%'
            }
          )
        });
      }
    }
    this.sort(this.objects);
  }
  Toggle(index : number, time : string){
    const status = this.objects[index].active;
    this.objects.forEach((element:any) => {
      element.active = false;
    });
    if(!status){
      this.objects[index].active = !this.objects[index].active;
    }
    this._videoService.JumpVideo(time); 
  } 
  
  ToggleClockIcon(index : number){
    const status = this.objects[index].active_clock;
    this.objects.forEach((element:any) => {
      element.active_clock = false;
    });
    if(!status){
      this.objects[index].active_clock = !this.objects[index].active_clock;
    }
  }
}
