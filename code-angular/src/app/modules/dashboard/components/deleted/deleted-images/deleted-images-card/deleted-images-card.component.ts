import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'deleted-images-card',
  templateUrl: './deleted-images-card.component.html',
  styleUrls: ['./deleted-images-card.component.scss']
})
export class DeletedImagesCardComponent implements OnInit {

  @Input() ImageData! : any;
  @ViewChild('image_Name') image_Name! : ElementRef;
  constructor() { }

  req_Name! : string;
  ImgUrl = '';
  ImgName = '';
  ngOnInit(): void {
    this.ImgName = this.ImageData.name.split('/')[this.ImageData.name.split('/').length - 1];
    if(this.ImgName.length > 16){
      let temp_name = '';
      for(let i = 0; i < this.ImgName.split('.').length - 1; i++){
        temp_name += this.ImgName.split('.')[i]+'.';
      }
      this.req_Name = temp_name.slice(0, 15) + '...';
    }
    else{
      this.req_Name = this.ImgName;
    }
    this.ImgUrl = this.ImageData.thumbnail_image;
  }
  showName = false;
  ToggleImageName() {
    if(this.showName) {
      this.image_Name.nativeElement.classList.remove('show');
    }
    else {
      this.image_Name.nativeElement.classList.add('show');
    }

    this.showName = !this.showName;
  }

}
