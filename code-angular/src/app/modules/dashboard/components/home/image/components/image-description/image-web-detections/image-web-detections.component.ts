import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';


@Component({
  selector: 'app-image-web-detections',
  templateUrl: './image-web-detections.component.html',
  styleUrls: ['./image-web-detections.component.scss']
})
export class ImageWebDetectionsComponent implements OnInit {

  @ViewChild('img') imageMain! : ElementRef;
  @Input('mainImageHeight') mainImageHeight! : string;
  @Input('mainImageWidth') mainImageWidth! : string;
  @Input('ImageData') ImageData! : any;
  @Input('ImgUrl') url!: any;

  constructor() { }
  imageName = '';
  ImgUrl = '';
  @Output() imageLoader : EventEmitter<boolean> = new EventEmitter<boolean>();//event emitter about image status

  ImageLoaded(){
    this.imageLoader.emit(true);
  }
  ngOnInit(): void { 
    this.ImgUrl = this.url;
  }

  cursorType = 'grab';

  Grabbing() {
    this.cursorType='grabbing';
  }

  Grab() {
    this.cursorType='grab';
  }

}
