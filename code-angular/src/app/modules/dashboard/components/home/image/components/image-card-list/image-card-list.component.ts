import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'image-card-list',
  templateUrl: './image-card-list.component.html',
  styleUrls: ['./image-card-list.component.scss']
})
export class ImageCardListComponent {

  @Output() Images_selected: EventEmitter<void> = new EventEmitter<void>(); 
  @Input() showmore!: boolean ;
  @Input() imageInfo: any ;
  imageData!: any[];
  showMore = false;
  img_length! : number;
  

  ngOnChanges() {
    if(this.showmore){
      this.show(this.imageInfo.length);
    }
    else {
      this.show(14);
    }
  }

  ngAfterViewInit(): void {  
    this.img_length = this.imageInfo.length;
    if(this.img_length > 14) {
      this.showMore = true;  
      this.show(14);    
    }
    else if(this.img_length < 14){
      this.show(this.img_length);
    }  
  }

  show(len : number) {
    this.imageData = this.imageInfo.slice(0, len);
  }
  onChange(){
    this.Images_selected.emit();
  }
}
