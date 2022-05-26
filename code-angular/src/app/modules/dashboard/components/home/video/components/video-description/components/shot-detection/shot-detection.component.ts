import { AfterViewInit, Component, Input } from '@angular/core';
import { VideosService } from 'src/app/modules/dashboard/shared/video/videos.service';

@Component({
  selector: 'shot-detection',
  templateUrl: './shot-detection.component.html',
  styleUrls: ['./shot-detection.component.scss']
})
export class ShotDetectionComponent implements AfterViewInit {

  @Input() info!: any;
  objects: any = [];
  contentPresent = false;
  constructor(private _videoService : VideosService) { }
  
  Jump(time : string){
    this._videoService.JumpVideo(time);
  }
  sort(list : any){//sort the data time wise
    const len = list.length;
    for (let i = 0; i < len-1; i++) {
      for (let j = 0; j < len-i-1; j++) {
        if (list[j].start_time > list[j+1].start_time) 
          { 
            const temp = list[j]; 
            list[j] = list[j+1]; 
            list[j+1] = temp; 
          } 
      }      
    }
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
  ToggleClockIcon(index : number){
    const status = this.objects[index].active_clock;
    this.objects.forEach((element:any) => {
      element.active_clock = false;
    });
    if(!status){
      this.objects[index].active_clock = !this.objects[index].active_clock;
    }
  }

  ngAfterViewInit(): void {
    if(this.info.length > 0) {
      this.contentPresent = true;
      this.info.forEach((f : any) => {
        const time = this.convertTime(f.start_time, 0, 0);
        const end_time = this.convertTime(f.end_time, 0, 0);
        this.objects.push(
          {
            entity :'Shot start',
            start_time : `${time[2]}:${time[1]}:${time[0]}`,
            end_time : `${end_time[2]}:${end_time[1]}:${end_time[0]}`,
            active_clock : false,
            active : false,
          }
        )
      });
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
}
