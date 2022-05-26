import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'deleted-videos-cards',
  templateUrl: './deleted-videos-cards.component.html',
  styleUrls: ['./deleted-videos-cards.component.scss']
})
export class DeletedVideosCardsComponent implements OnInit {

  @Input() showmore!: boolean ;
  @Input() videoInfo!:string[];
  titles!: string[];
  showMore = false;
  vid_length! : number;

  constructor() { }

  ngOnChanges() {
    if(this.showmore){
      this.show(this.videoInfo.length);
    }
    else {
      this.show(14);
    }
  }

  ngOnInit(): void {
    this.titles = this.videoInfo;
  }

  ngAfterViewInit(): void {    
    this.vid_length = this.videoInfo.length;
    if(this.vid_length > 14) {
      this.showMore = true;  
      this.show(14);    
    }
    else if(this.vid_length < 14){
      this.show(this.vid_length);
    }  
  }

  show(len : number) {
    this.titles = this.videoInfo.slice(0, len);
  }

}
