import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'timeline-video-card',
  templateUrl: './timeline-video-card.component.html',
  styleUrls: ['./timeline-video-card.component.scss']
})
export class TimelineVideoCardComponent implements AfterViewInit {

  @Input() data!: any;//input video data from parent component
  VidUrl = '';//store url to video
  @Output() VideoInfo: EventEmitter<any[]> = new EventEmitter<any[]>();//emit video info to parent component
  isSample = false;
  
  ngAfterViewInit(): void {
    this.VidUrl =  this.data.thumbnail_video;
    this.isSample =  this.data.isSample;
  }
  OpenVideo(){
    if(this.isSample){
      localStorage.setItem('isSample', 'true')
    }
    else{
      localStorage.setItem('isSample', 'false')
    }
    this.VideoInfo.emit([this.data.name.split('/')[this.data.name.split('/').length - 1], this.data.id, this.data.original_name]);
  }

}
