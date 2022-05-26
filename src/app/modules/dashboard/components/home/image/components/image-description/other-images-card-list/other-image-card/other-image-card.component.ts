import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'other-image-card',
  templateUrl: './other-image-card.component.html',
  styleUrls: ['./other-image-card.component.scss']
})
export class OtherImageCardComponent implements OnInit, AfterViewInit {
  @Input('imageData') imageData: any;
  constructor() { }
  ngOnInit(): void {
  }
  ImgUrl = '';
  current = {'box-shadow': "none"};
  ngAfterViewInit(): void {
    this.ImgUrl = this.imageData.thumbnail_image;  
    if(this.imageData.current === true){
      this.current = {'box-shadow': "0px 3px 6px #0000008A"};
    }
  }
  @Output() imageInfo: EventEmitter<any[]> = new EventEmitter<any[]>();
  OpenImage() {   
    this.imageInfo.emit([this.imageData.url, this.imageData.id, this.imageData.name]);
  }

}
