import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, OnChanges } from '@angular/core';
import { RouteService } from '../../../shared/route.service';

@Component({
  selector: 'video-card-list',
  templateUrl: './video-card-list.component.html',
  styleUrls: ['./video-card-list.component.scss']
})
export class VideoCardListComponent implements AfterViewInit, OnChanges {

  @Output() Videos_selected: EventEmitter<void> = new EventEmitter<void>(); 
  @Input() showmore!: boolean ;
  @Input() videoInfo!:string[];
  titles!: string[];
  showMore = false;
  vid_length! : number;

  ngOnChanges() {
    if(this.showmore){
      this.show(this.videoInfo.length);
    }
    else {
      this.show(14);
    }
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
  onChange(){
    this.Videos_selected.emit();
  }
}
