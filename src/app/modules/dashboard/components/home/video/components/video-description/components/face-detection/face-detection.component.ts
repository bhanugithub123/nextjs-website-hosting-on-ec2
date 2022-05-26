import { AfterViewInit, Component, Input } from '@angular/core';
import { VideosService } from 'src/app/modules/dashboard/shared/video/videos.service';

@Component({
  selector: 'face-detection',
  templateUrl: './face-detection.component.html',
  styleUrls: ['./face-detection.component.scss']
})
export class FaceDetectionComponent implements AfterViewInit {

  @Input() info!: any;
  objects: any = [];
  contentPresent = false;
  smilingData : any[] =[];
  glasses : any[] =[];
  headwear : any[] =[];
  mouth_open : any[] =[];
  looking_at_camera : any[] =[];
  eyes_visible : any[] =[];
  smilingDataUnique : any[] =[];
  glassesUnique : any[] =[];
  headwearUnique : any[] =[];
  mouth_openUnique : any[] =[];
  looking_at_cameraUnique : any[] =[];
  eyes_visibleUnique : any[] =[];
  constructor() { }


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
  ngAfterViewInit(): void {
    if(this.info){
      if(this.info.length > 0){
        this.contentPresent = true;
        const len = this.info.length;
        for(let i = 0; i < len; i++){
          if(this.info[i].name === 'smiling'){//filters object containing data about smiling
            this.smilingData.push(this.info[i]);
          }
          if(this.info[i].name === 'headwear'){//filters object containing data about headwear
            this.headwear.push(this.info[i]);
          }
          if(this.info[i].name === 'mouth_open'){//filters object containing data about mouth_open
            this.mouth_open.push(this.info[i]);
          }
          if(this.info[i].name === 'looking_at_camera'){//filters object containing data about looking_at_camera
            this.looking_at_camera.push(this.info[i]);
          }
          if(this.info[i].name === 'eyes_visible'){//filters object containing data about eyes_visible
            this.eyes_visible.push(this.info[i]);
          }
          if(this.info[i].name === 'glasses'){//filters object containing data about glasses
            this.glasses.push(this.info[i]);
          }
        }
      }
      const duration = `${localStorage.getItem('videoduration')}`;
      this.sort(this.smilingData)
      this.sort(this.headwear)
      this.sort(this.mouth_open)
      this.sort(this.eyes_visible)
      this.sort(this.looking_at_camera)
      this.sort(this.glasses)
      this.FilterUnique(this.smilingData, this.smilingDataUnique, duration);
      this.FilterUnique(this.headwear, this.headwearUnique, duration);
      this.FilterUnique(this.mouth_open, this.mouth_openUnique, duration);
      this.FilterUnique(this.looking_at_camera, this.looking_at_cameraUnique, duration);
      this.FilterUnique(this.eyes_visible, this.eyes_visibleUnique, duration);
      this.FilterUnique(this.glasses, this.glassesUnique, duration);
    }
  } 

  storeUnique(){
    
  }
  FilterUnique(list : any[], listUnique: any[], duration : string){
    let time_offset: any[] = [];
    const time = this.convertTime(list[0].time,0 ,0);
    listUnique.push({
      name : list[0].name,
      confidence : list[0].confidence,
      confidence_value : list[0].confidence_value,
      time : `${time[2]}:${time[1]}:${time[0]}`,
      start_time : list[0].start_time,
      time_gap : (((parseInt(list[0].start_time) - 0) / parseInt(duration)) * 100).toString(),
      time_diff : (((parseInt(list[0].end_time) - parseInt(list[0].start_time)) / parseInt(duration)) * 100).toString()
    });
    time_offset.push(list[0].start_time); 
    for(let i = 1; i < list.length; i++){//filters unique data objects have no same time offset and duration
      if(!time_offset.includes(list[i].start_time)){
        const time = this.convertTime(list[i].time,0 ,0);
        listUnique.push({
          name : list[i].name,
          confidence : list[i].confidence,
          confidence_value : list[i].confidence_value,
          time : `${time[2]}:${time[1]}:${time[0]}`,
          start_time : list[i].start_time,
          time_gap : ((((parseInt(list[i].start_time)) - parseInt(list[i-1].end_time)) / parseInt(duration)) * 100).toString(),
          time_diff : (((parseInt(list[i].end_time) - parseInt(list[i].start_time)) / parseInt(duration)) * 100).toString()
        });
        time_offset.push(list[i].start_time); 
      }
    }
    time_offset = [];
  }
  ToggleClockIcon(index : number){
    const status = this.objects[index].active;
    this.objects.forEach((element:any) => {
      element.active = false;
    });
    if(!status){
      this.objects[index].active = !this.objects[index].active;
    }
  }
  
}
