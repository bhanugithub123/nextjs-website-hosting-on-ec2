import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'deleted-images-cards',
  templateUrl: './deleted-images-cards.component.html',
  styleUrls: ['./deleted-images-cards.component.scss']
})
export class DeletedImagesCardsComponent implements OnInit {

  @Input() showmore!: boolean ;
  @Input() imageInfo! : any[];
  titles!: any[];
  showMore = false;
  vid_length! : number;

  constructor() { }

  ngOnChanges() {
    if(this.showmore){
      this.show(this.imageInfo.length);
    }
    else {
      this.show(14);
    }
  }

  ngOnInit(): void {
    this.titles = this.imageInfo;
  }

  ngAfterViewInit(): void {    
    this.vid_length = this.imageInfo.length;
    if(this.vid_length > 14) {
      this.showMore = true;  
      this.show(14);    
    }
    else if(this.vid_length < 14){
      this.show(this.vid_length);
    }  
  }

  show(len : number) {
    this.titles = this.imageInfo.slice(0, len);
  }


}
