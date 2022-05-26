import { ElementRef, EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'explicit-contents',
  templateUrl: './explicit-contents.component.html',
  styleUrls: ['./explicit-contents.component.scss']
})
export class ExplicitContentsComponent implements OnInit {

  @ViewChild('img') imageMain! : ElementRef;
  @Input('mainImageHeight') mainImageHeight! : string;
  @Input('mainImageWidth') mainImageWidth! : string;
  @Input('ImageData') ImageData! : any;
  @Input('ImgUrl') url!: any;
  @Output() imageLoader : EventEmitter<boolean> = new EventEmitter<boolean>();//event emitter about image status

  ImageLoaded(){
    this.imageLoader.emit(true);
  }
  cursorType = 'grab';
  Grabbing() {
    this.cursorType='grabbing';
  }
  Grab() {
    this.cursorType='grab';
  }
  constructor() { }
  ImgUrl = '';
  ngOnInit(): void {   
    this.ImgUrl = this.url;
  }

}
