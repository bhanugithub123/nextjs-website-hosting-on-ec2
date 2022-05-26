import { AfterViewInit, Component, Input, } from '@angular/core';
import { VideosService } from 'src/app/modules/dashboard/shared/video/videos.service';

@Component({
  selector: 'person-detection',
  templateUrl: './person-detection.component.html',
  styleUrls: ['./person-detection.component.scss']
})
export class PersonDetectionComponent implements AfterViewInit {

  @Input() info!: any;
  objects: any = [];
  contentPresent = false;
  landmarks : any[] = [];
  landmarksGrouped : any[] = [];
  filteredLandmarks : any[] = [];
  constructor(private _videoService : VideosService) { }

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
    if(this.info.length > 0) {
      this.contentPresent = true;
      this.info[0].tracks.forEach((track : any) => {
        track.timestamped_objects.forEach(
          (obj : any) => {
            //store landmarks
            if(obj.landmarks){
              obj.landmarks.forEach(
                (mark : any) => {
                  this.objects.push(
                    {
                      name : mark.name,
                      confidence : Math.round(mark.confidence * 100).toString() + '%',
                      confidence_value : Math.round(mark.confidence * 100),
                      value: "",
                      time : obj.time_offset,
                      start_time: track.start_time_offset,
                      end_time : track.end_time_offset,
                      active : false
                    }
                  );
                }
              )
            }
          });
      });
    }
    const duration = `${localStorage.getItem('videoduration')}`;
    this.sort(this.landmarks);
    let landmarks: string[] = [];
    let time : number[] = [];
    this.objects.forEach((obj : any, i : number) => {
      if(i > 0){
        if(this.objects[i].start_time > this.objects[i - 1].start_time){
          landmarks = [];
        }
      }
      if(!landmarks.includes(obj.name) || !time.includes(obj.start_time)){
        landmarks.push(obj.name);
        time.push(obj.start_time);
        this.landmarks.push(obj);
      }
    });
    this.sort(this.landmarks)
    for(let i = 0; i < landmarks.length; i++){
      for(let j = 0; j < this.landmarks.length; j++){
        if(this.landmarks[j].name === landmarks[i]){
          this.landmarksGrouped.push(this.landmarks[j]);
        }
      }
    }
    for(let i = 0; i < landmarks.length; i++){
      let tempObject : any[] = [];
      if(this.landmarksGrouped[0].name === landmarks[i]){
        const curr_time = this.convertTime(this.landmarksGrouped[0].time,0 ,0);
        tempObject.push({
          name : this.landmarksGrouped[0].name,
          value : this.landmarksGrouped[0].value,
          confidence : this.landmarksGrouped[0].confidence,
          confidence_value: this.landmarksGrouped[0].confidence_value,
          time : `${curr_time[2]}:${curr_time[1]}:${curr_time[0]}`,
          start_time : this.landmarksGrouped[0].start_time,
          end_time : this.landmarksGrouped[0].end_time,
          time_gap : (((parseInt(this.landmarksGrouped[0].start_time) - 0) / parseInt(duration)) * 100).toString(),
          time_diff : (((parseInt(this.landmarksGrouped[0].end_time) - parseInt(this.landmarksGrouped[0].start_time)) / parseInt(duration)) * 100).toString()
        });
      }
      for(let j = 1; j < this.landmarksGrouped.length; j++){
        const curr_time = this.convertTime(this.landmarksGrouped[j].time,0 ,0);
        if(this.landmarksGrouped[j].name === landmarks[i]){
          if(parseInt(this.landmarksGrouped[j].start_time) > parseInt(this.landmarksGrouped[j - 1].end_time)){
            tempObject.push({
              name : this.landmarksGrouped[j].name,
              value : this.landmarksGrouped[j].value,
              confidence : this.landmarksGrouped[j].confidence,
              confidence_value: this.landmarksGrouped[j].confidence_value,
              time : `${curr_time[2]}:${curr_time[1]}:${curr_time[0]}`,
              start_time : this.landmarksGrouped[j].start_time,
              end_time : this.landmarksGrouped[j].end_time,
              time_gap : (((parseInt(this.landmarksGrouped[j].start_time) - parseInt(this.landmarksGrouped[j - 1].end_time)) / parseInt(duration)) * 100).toString(),
              time_diff : (((parseInt(this.landmarksGrouped[j].end_time) - parseInt(this.landmarksGrouped[j].start_time)) / parseInt(duration)) * 100).toString()
            });
          }
          else{
            tempObject.push({
              name : this.landmarksGrouped[j].name,
              value : this.landmarksGrouped[j].value,
              confidence : this.landmarksGrouped[j].confidence,
              confidence_value: this.landmarksGrouped[j].confidence_value,
              time : `${curr_time[2]}:${curr_time[1]}:${curr_time[0]}`,
              start_time : this.landmarksGrouped[j].start_time,
              end_time : this.landmarksGrouped[j].end_time,
              time_gap : ((0 / parseInt(duration)) * 100).toString(),
              time_diff : (((parseInt(this.landmarksGrouped[j].end_time) - parseInt(this.landmarksGrouped[j].start_time)) / parseInt(duration)) * 100).toString()
            });
          }
        }
      }
      this.filteredLandmarks.push({
        name : landmarks[i],
        objects : tempObject
      });
    }
    
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
