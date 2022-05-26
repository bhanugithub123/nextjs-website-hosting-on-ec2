import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VideosService } from 'src/app/modules/dashboard/shared/video/videos.service';

@Component({
  selector: 'speech-transcription',
  templateUrl: './speech-transcription.component.html',
  styleUrls: ['./speech-transcription.component.scss']
})
export class SpeechTranscriptionComponent implements OnInit, AfterViewInit {

  @Input() info!: any;
  objects: any = [];
  contentPresent = false;
  transcript = '';
  searchTerm = '';
  onSearch(ev : any){
    this.searchTerm = ev.target.value;
  }
  constructor(private _videoService : VideosService) { }
  ngOnInit(): void {    
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

  ngAfterViewInit(): void {
    if(this.info){
      this.contentPresent = true;
      if(this.info.length > 0) {
        this.info[0].alternatives.forEach((f : any) => {
          if(f.alternative_words.length > 0){
            f.alternative_words.forEach(
              (e:any)=> {
                const time = this.convertTime(e.start_time, 0, 0);
                this.objects.push(
                  {
                    word : e.word.length > 0 ? e.word : "undefined",
                    time : `${time[2]}:${time[1]}:${time[0]}`,
                    active_clock : false,
                    active : false,
                    confidence : Math.floor(f.Confidence * 100) + '%',
                    transcript : f.Transcript.length > 0 ? f.Transcript : 'Undefined'
                  }
                )
              }
            );
          }
          else if(f.Transcript.length > 0){
            this.objects.push(
              {
                word : "undefined",
                time : `00:00:00`,
                active_clock : false,
                active : false,
                confidence : '0%',
                transcript : f.Transcript
              }
            )
          }
          else{
            this.objects.push(
              {
                word : "undefined",
                time : `00:00:00`,
                active_clock : false,
                active : false,
                confidence : '0%',
                transcript : 'undefined'
              }
            )
          }
        });
      }
    }
    this.sort(this.objects);
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
