import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'default-image',
  templateUrl: './default-image.component.html',
  styleUrls: ['./default-image.component.scss']
})
export class DefaultImageComponent implements OnInit {

  @ViewChild('img') imageMain! : ElementRef;
  @ViewChild('Canvas') Canvas! : ElementRef;
  @Input('mainImageHeight') mainImageHeight! : string;
  @Input('mainImageWidth') mainImageWidth! : string;
  @Input('ImgUrl') url!: any;
  constructor() { }
  ImgUrl = ''
  @Output() imageLoader : EventEmitter<boolean> = new EventEmitter<boolean>();//event emitter about image status
  imagewidth = 0;
  imageheight = 0;
  cursorType = 'grab';
  Grabbing() {
    this.cursorType='grabbing';
  }
  Grab() {
    this.cursorType='grab';
  }
  ImageLoaded(){
    this.imageLoader.emit(true);
  }
  ngOnInit(): void {
    this.ImgUrl = this.url;  
  }
}
