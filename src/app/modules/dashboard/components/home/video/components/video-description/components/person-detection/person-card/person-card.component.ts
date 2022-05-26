import { Component, Input, OnInit } from '@angular/core';
import { VideosService } from 'src/app/modules/dashboard/shared/video/videos.service';

@Component({
  selector: 'person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class PersonCardComponent implements OnInit {

  @Input() Data !: any[];
  confidence = "";
  time="00:00:00"
  constructor(private _videoService : VideosService) { }

  ngOnInit(): void {
  }
  ToggleValue(value: string, time : string){
    this.confidence = value;
    this.time = time;
  }
  Toggle(time : string){
    this._videoService.JumpVideo(time);    
  } 

}
