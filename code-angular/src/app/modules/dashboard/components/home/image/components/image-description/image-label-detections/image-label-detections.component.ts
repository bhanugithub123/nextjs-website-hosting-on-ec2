import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-label-detections',
  templateUrl: './image-label-detections.component.html',
  styleUrls: ['./image-label-detections.component.scss']
})
export class ImageLabelDetectionsComponent implements OnInit {

  @ViewChild('img') imageMain! : ElementRef;
  @Input('mainImageHeight') mainImageHeight! : string;
  @Input('mainImageWidth') mainImageWidth! : string;
  @Input('ImageData') ImageData! : any;
  @Input('ImgUrl') url!: any;
  @Output() imageLoader : EventEmitter<boolean> = new EventEmitter<boolean>();//event emitter about image status

  ImageLoaded(){
    this.imageLoader.emit(true);
  }

  constructor() { }
  ImgUrl = ''
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
