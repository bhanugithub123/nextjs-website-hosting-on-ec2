import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-object-detections',
  templateUrl: './image-object-detections.component.html',
  styleUrls: ['./image-object-detections.component.scss']
})
export class ImageObjectDetectionsComponent implements OnInit, OnChanges {

  @ViewChild('img') imageMain! : ElementRef;
  @ViewChild('Canvas') Canvas! : ElementRef;
  @Input('mainImageHeight') mainImageHeight! : string;
  @Input('mainImageWidth') mainImageWidth! : string;
  @Input('ImageData') ImageData! : any;
  @Input('ImgUrl') url!: any;
  @Output() imageLoader : EventEmitter<boolean> = new EventEmitter<boolean>();//event emitter about image status
  @Input('showObject') key!: number;
  cursorType = 'grab';
  imageName = '';
  ImgUrl = '';
  imagewidth = 0;
  imageheight = 0;
  canvasheight = 0;
  canvaswidth = 0;
  Grabbing() {
    this.cursorType='grabbing';
  }
  Grab() {
    this.cursorType='grab';
  }
  ImageLoaded(){
    this.imageLoader.emit(true);
    this.imagewidth = this.imageMain.nativeElement.naturalWidth;
    this.imageheight = this.imageMain.nativeElement.naturalHeight;
    if(this.imageheight >= this.imagewidth){
      this.canvasheight = parseInt(this.mainImageHeight);
      this.canvaswidth = (parseInt(this.mainImageHeight) / this.imageheight) * this.imagewidth;
    }
    else if(this.imagewidth > this.imageheight ){
      this.canvaswidth = parseInt(this.mainImageWidth);
      this.canvasheight = (parseInt(this.mainImageWidth) / this.imagewidth) * this.imageheight;
    }
    this.objectDetection.push(this.ImageData.object_localization);
    var svg = document.querySelector('#svg');
    var rect:string = '';
    if(this.objectDetection[0][0].message){
      //do nothing
    }
    else{
      for(let i = 0; i < this.objectDetection[0].length; i++) {
        const object_detect = this.objectDetection[0][i]; 
        // bounding poly
        rect += `<path fill="none" stroke="#95E06C" d="M${object_detect.bounding_poly[0].x1 * this.canvaswidth} ${object_detect.bounding_poly[0].y1 * this.canvasheight} L${object_detect.bounding_poly[0].x2 * this.canvaswidth} ${object_detect.bounding_poly[0].y2 * this.canvasheight} L${object_detect.bounding_poly[0].x3 * this.canvaswidth} ${object_detect.bounding_poly[0].y3 * this.canvasheight} L${object_detect.bounding_poly[0].x4 * this.canvaswidth} ${object_detect.bounding_poly[0].y4 * this.canvasheight} Z" style="stroke-width:3;" />`
      }
      svg!.innerHTML = rect;
    }
  }

  constructor() { }
  
  ngOnInit(): void { 
    this.ImgUrl = this.url;
  }
  
  ngOnChanges(): void {
    this.objectDetection = [];
    if(this.imageMain){
      if(this.key > -1){
        this.imagewidth = this.imageMain.nativeElement.naturalWidth;
        this.imageheight = this.imageMain.nativeElement.naturalHeight;
        if(this.imageheight >= this.imagewidth){
          this.canvasheight = parseInt(this.mainImageHeight);
          this.canvaswidth = (parseInt(this.mainImageHeight) / this.imageheight) * this.imagewidth;
        }
        else if(this.imagewidth > this.imageheight ){
          this.canvaswidth = parseInt(this.mainImageWidth);
          this.canvasheight = (parseInt(this.mainImageWidth) / this.imagewidth) * this.imageheight;
        }
        var svgSingle = document.querySelector('#svgSingle');
        var rect:string = '';
        const object_detect = this.ImageData.object_localization[this.key]; 
        // bounding poly
        rect += `<path fill="none" stroke="red" d="M${object_detect.bounding_poly[0].x1 * this.canvaswidth} ${object_detect.bounding_poly[0].y1 * this.canvasheight} L${object_detect.bounding_poly[0].x2 * this.canvaswidth} ${object_detect.bounding_poly[0].y2 * this.canvasheight} L${object_detect.bounding_poly[0].x3 * this.canvaswidth} ${object_detect.bounding_poly[0].y3 * this.canvasheight} L${object_detect.bounding_poly[0].x4 * this.canvaswidth} ${object_detect.bounding_poly[0].y4 * this.canvasheight} Z" style="stroke-width:3;" />`;
        
        svgSingle!.innerHTML += rect;
      }
      else{
        this.objectDetection = [];
        this.imagewidth = this.imageMain.nativeElement.naturalWidth;
        this.imageheight = this.imageMain.nativeElement.naturalHeight;
        if(this.imageheight >= this.imagewidth){
          this.canvasheight = parseInt(this.mainImageHeight);
          this.canvaswidth = (parseInt(this.mainImageHeight) / this.imageheight) * this.imagewidth;
        }
        else if(this.imagewidth > this.imageheight ){
          this.canvaswidth = parseInt(this.mainImageWidth);
          this.canvasheight = (parseInt(this.mainImageWidth) / this.imagewidth) * this.imageheight;
        }
        this.objectDetection.push(this.ImageData.object_localization);
        var svg = document.querySelector('#svg');
        var rect:string = '';
        var svgSingle = document.querySelector('#svgSingle');
        svgSingle!.innerHTML = '';
        if(this.objectDetection[0][0].message){
          //do nothing
        }
        else{
          for(let i = 0; i < this.objectDetection[0].length; i++) {
            const object_detect = this.objectDetection[0][i]; 
            // bounding poly
            const width = (object_detect.bounding_poly[0].x2 - object_detect.bounding_poly[0].x1) * 100;
            const height = (object_detect.bounding_poly[0].y2 - object_detect.bounding_poly[0].y1) * 100;
            const X = object_detect.bounding_poly[0].x1 * 100;
            const Y = object_detect.bounding_poly[0].y1 * 100;
            rect += `<path fill="none" stroke="#95E06C" d="M${object_detect.bounding_poly[0].x1 * this.canvaswidth} ${object_detect.bounding_poly[0].y1 * this.canvasheight} L${object_detect.bounding_poly[0].x2 * this.canvaswidth} ${object_detect.bounding_poly[0].y2 *this.canvasheight} L${object_detect.bounding_poly[0].x3 * this.canvaswidth} ${object_detect.bounding_poly[0].y3 * this.canvasheight} L${object_detect.bounding_poly[0].x4 * this.canvaswidth} ${object_detect.bounding_poly[0].y4 * this.canvasheight} Z" style="stroke-width:3;" />`;
          }
          svg!.innerHTML = rect;
        }
      }
    }
    }

  //Object values
  objectDetection: any[] = [];

}
