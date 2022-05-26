import { Component, Input, OnInit } from '@angular/core';
import { VideosService } from 'src/app/modules/dashboard/shared/video/videos.service';

@Component({
  selector: 'face-card',
  templateUrl: './face-card.component.html',
  styleUrls: ['./face-card.component.scss']
})
export class FaceCardComponent implements OnInit {

  @Input() Data !: any[];
  confidence = "";
  time="00:00:00";
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
