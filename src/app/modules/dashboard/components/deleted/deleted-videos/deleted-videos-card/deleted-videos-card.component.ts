import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'deleted-videos-card',
  templateUrl: './deleted-videos-card.component.html',
  styleUrls: ['./deleted-videos-card.component.scss']
})
export class DeletedVideosCardComponent implements OnInit {

  @Input() VideoData! : any;
  @ViewChild('video_Name') video_Name!: ElementRef;
  constructor() { }
  req_Name! : string;
  VidUrl = '';
  VidName = '';

  ngOnInit(): void {
    this.VidName = this.VideoData.name.split('/')[this.VideoData.name.split('/').length - 1];
    if(this.VidName.length > 16){
      let temp_name = '';
      for(let i = 0; i < this.VidName.split('.').length - 1; i++){
        temp_name += this.VidName.split('.')[i]+'.';
      }
      this.req_Name = temp_name.slice(0, 15) + '...';
    }
    else{
      this.req_Name = this.VidName;
    }
    this.VidUrl = this.VideoData.thumbnail_video;
  }
  showName = false;
  ToggleVideoName() {
    if(this.showName) {
      this.video_Name.nativeElement.classList.remove('show');
    }
    else {
      this.video_Name.nativeElement.classList.add('show');
    }

    this.showName = !this.showName;    
  }

}
