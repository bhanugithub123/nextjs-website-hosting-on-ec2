import { Component, Input, OnChanges } from '@angular/core';
import { VideosService } from 'src/app/modules/dashboard/shared/video/videos.service';


@Component({
  selector: 'object-tracking',
  templateUrl: './object-tracking.component.html',
  styleUrls: ['./object-tracking.component.scss']
})
export class ObjectTrackingComponent implements  OnChanges {

  @Input() info!: any;
  objects: any[] = [];
  objectsUnique: any[] = [];
  groupedObjectsUnique: any[] = [];
  filteredObjectsUnique: any[] = [];
  contentPresent = false;
  searchTerm = '';
  onSearch(ev : any){
    this.searchTerm = ev.target.value;
  }
  constructor(private _videoService : VideosService) { }

  Toggle(index : number, time : string){
    const status = this.objectsUnique[index].active;
    this.objectsUnique.forEach((element:any) => {
      element.active = false;
    });
    if(!status){
      this.objectsUnique[index].active = !this.objectsUnique[index].active;
    }
    this._videoService.JumpVideo(time); 
    
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
  convertTime(seconds: any, minutes: number, hours: number) {
    if(seconds > 60){
      minutes = Math.floor(seconds / 60);
      seconds = seconds - (minutes * 60);     
    }
    if(minutes > 60){
      hours = Math.floor(minutes / 60);
      minutes = minutes - (hours * 60)
    }
    seconds = Math.floor(seconds);
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
  ngOnChanges(): void {
    if(this.info){
      this.contentPresent = true;
      if(this.info.length > 0) {
        this.info.forEach((f : any) => {
          this.objects.push(
            {
              entity : f.entity[0].description,
              confidence : Math.round(f.confidence * 100).toString() + '%',
              confidence_value : Math.round(f.confidence * 100),
              active_clock : false,
              active : false,
              start_time : f.start_time,
              end_time : f.end_time
            }
          )
        });
      }
    }
    const duration = `${localStorage.getItem('videoduration')}`;
    this.sort(this.objects);
    let objectslist: string[] = [];
    let time: string[] = [];
    this.objects.forEach(
      (obj : any) => {
        if(!objectslist.includes(obj.entity) ){
          const curr_time = this.convertTime(obj.start_time, 0, 0);
          this.objectsUnique.push({
            entity : obj.entity,
            confidence : obj.confidence,
            confidence_value : obj.confidence_value,
            active_clock : false,
            active : false,
            time : `${curr_time[2]}:${curr_time[1]}:${curr_time[0]}`,
            start_time : obj.start_time,
            end_time : obj.end_time
          });
          objectslist.push(obj.entity);
          time.push(obj.start_time);
        }
        else{
          if(!time.includes(obj.time)){
            const curr_time = this.convertTime(obj.start_time, 0, 0);
            this.objectsUnique.push({
              entity : obj.entity,
              confidence : obj.confidence,
              confidence_value : obj.confidence_value,
              active_clock : false,
              active : false,
              time : `${curr_time[2]}:${curr_time[1]}:${curr_time[0]}`,
              start_time : obj.start_time,
              end_time : obj.end_time
            });
            objectslist.push(obj.entity);
            time.push(obj.start_time);
          }
        }
      }
    );
    let objectNameList : string[] = [];
    this.objectsUnique.forEach(
      (obj : any) => {
        if(!objectNameList.includes(obj.entity)){
          objectNameList.push(obj.entity);
        }
      }
    );
    this.sortByName(objectNameList);
    this.GroupByName(objectNameList, duration);
    
  }
  sortByName(objectNameList : any[]){
    for(let i = 0; i < objectNameList.length; i++){
      const name = objectNameList[i];
      for(let j = 1; j < this.objectsUnique.length; j++){
        if(name === this.objectsUnique[j].entity){
          this.groupedObjectsUnique.push(this.objectsUnique[j]);
        }
      }
    }
  }
  GroupByName(objectNameList : any[], duration : string){
    for(let i = 0; i < objectNameList.length; i++){
      let tempList : any[] = [];
      const name = objectNameList[i];
      if(name === this.groupedObjectsUnique[0].entity && i === 0){
        tempList.push({
          entity : this.groupedObjectsUnique[0].entity,
          confidence : this.groupedObjectsUnique[0].confidence,
          confidence_value : this.groupedObjectsUnique[0].confidence_value,
          time : this.groupedObjectsUnique[0].time,
          active_clock : false,
          active : false,
          start_time : this.groupedObjectsUnique[0].start_time,
          end_time : this.groupedObjectsUnique[0].end_time, 
          time_gap : (((parseInt(this.groupedObjectsUnique[0].start_time) - 0) / parseInt(duration)) * 100).toString(),
          time_diff : (((Math.round(this.groupedObjectsUnique[0].end_time) - Math.round(this.groupedObjectsUnique[0].start_time)) / parseInt(duration)) * 100).toString()
        })
      }
      for(let j = 1; j < this.groupedObjectsUnique.length; j++){
        if(name === this.groupedObjectsUnique[j].entity){
          if(this.groupedObjectsUnique[j].entity != this.groupedObjectsUnique[j - 1].entity){//if object name changes the time gap should be calculated from 0
            tempList.push({
              entity : this.groupedObjectsUnique[j].entity,
              confidence : this.groupedObjectsUnique[j].confidence,
              confidence_value : this.groupedObjectsUnique[j].confidence_value,
              time : this.groupedObjectsUnique[j].time,
              active_clock : false,
              active : false,
              start_time : this.groupedObjectsUnique[j].start_time,
              end_time : this.groupedObjectsUnique[j].end_time, 
              time_gap : (((parseInt(this.groupedObjectsUnique[j].start_time) - 0) / parseInt(duration)) * 100).toString(),
              time_diff : (((Math.round(this.groupedObjectsUnique[j].end_time) - Math.round(this.groupedObjectsUnique[j].start_time)) / parseInt(duration)) * 100).toString()
            });
          }
         else{
          tempList.push({
            entity : this.groupedObjectsUnique[j].entity,
            confidence : this.groupedObjectsUnique[j].confidence,
            confidence_value : this.groupedObjectsUnique[j].confidence_value,
            time : this.groupedObjectsUnique[j].time,
            active_clock : false,
            active : false,
            start_time : this.groupedObjectsUnique[j].start_time,
            end_time : this.groupedObjectsUnique[j].end_time, 
            time_gap : (((Math.round(this.groupedObjectsUnique[j].start_time) - Math.round(this.groupedObjectsUnique[j - 1].end_time)) / parseInt(duration)) * 100).toString(),
            time_diff : (((Math.round(this.groupedObjectsUnique[j].end_time) - Math.round(this.groupedObjectsUnique[j].start_time)) / parseInt(duration)) * 100).toString()
          });
         }
        }

      }
      this.filteredObjectsUnique.push({
        name : name,
        objects : tempList
      })
    }
  }
  ToggleClockIcon(index : number){
    const status = this.objectsUnique[index].active_clock;
    this.objectsUnique.forEach((element:any) => {
      element.active_clock = false;
    });
    if(!status){
      this.objectsUnique[index].active_clock = !this.objectsUnique[index].active_clock;
    }
  }
}
