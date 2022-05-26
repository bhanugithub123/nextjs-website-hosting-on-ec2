import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'image-landmarks',
  templateUrl: './image-landmarks.component.html',
  styleUrls: ['./image-landmarks.component.scss']
})
export class ImageLandmarksComponent implements OnInit, OnChanges {

  @ViewChild('img') imageMain! : ElementRef;//reference to image
  @ViewChild('Canvas') Canvas! : ElementRef;//reference to canvas
  @ViewChild('CanvasSingle') CanvasSingle! : ElementRef;//reference to canvas
  @Input('mainImageHeight') mainImageHeight! : string;//store image natural height
  @Input('mainImageWidth') mainImageWidth! : string;//store image natural width
  @Input('ImageData') ImageData! : any;//store data about image from parent component
  @Input('ImgUrl') url!: any;//store image url from parent component
  @Input('landmark') landmark !: number;//store active landmark id from parent component
  @Output() imageLoader : EventEmitter<boolean> = new EventEmitter<boolean>();//event emitter about image status
  imagewidth = 0;//store image current width
  imageheight = 0;// store image current height
  ImgUrl = '';//store url to image
  landMarks: any[] = [];//stores landmarks
  cursorType = 'grab';//store info about cursor type
  canvaswidth = 0;
  canvasheight = 0;
  Grabbing() {
    this.cursorType='grabbing';//switch cursor type
  }
  Grab() {
    this.cursorType='grab';//switch cursor type
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
    this.landMarks.push(this.ImageData.landmark_detection);
    var ctx = this.Canvas.nativeElement.getContext("2d");
    ctx.save();
    ctx.scale(585/this.imagewidth, 462/this.imageheight);
    ctx.beginPath();
    if(this.landMarks[0][0].message){
      //do nothing
    }
    else{
      const len = this.landMarks.length;
      for(let i = 0; i < len; i++){
        const detected_landmark = this.landMarks[i];
        detected_landmark.forEach(
          (data : any) => {
          // bounding poly
          ctx.moveTo(data.bounding_poly[0].x1, data.bounding_poly[0].y1);
          ctx.lineTo(data.bounding_poly[0].x2, data.bounding_poly[0].y2);
          ctx.lineTo(data.bounding_poly[0].x3, data.bounding_poly[0].y3);
          ctx.lineTo(data.bounding_poly[0].x4, data.bounding_poly[0].y4);
          ctx.closePath();
        });
      }  
      ctx.restore();
      ctx.strokeStyle = "#95E06C";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.moveTo(0,0);  
    }
  }

  constructor() { }
  
  ngOnInit(): void {  
    this.ImgUrl = this.url;
  }  

  ngOnChanges(): void {
    if(this.imageMain){
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
      if(this.landmark > -1){
        var ctx = this.CanvasSingle.nativeElement.getContext("2d");
        ctx.save();
        ctx.scale(585/this.imagewidth, 462/this.imageheight);
        ctx.beginPath();
        if(this.landMarks[0][0].message){
          //do nothing
        }
        else{
          const detected_landmark = this.landMarks[0][this.landmark];
          // bounding poly
          ctx.moveTo(detected_landmark.bounding_poly[0].x1, detected_landmark.bounding_poly[0].y1);
          ctx.lineTo(detected_landmark.bounding_poly[0].x2, detected_landmark.bounding_poly[0].y2);
          ctx.lineTo(detected_landmark.bounding_poly[0].x3, detected_landmark.bounding_poly[0].y3);
          ctx.lineTo(detected_landmark.bounding_poly[0].x4, detected_landmark.bounding_poly[0].y4);
          ctx.closePath();
          ctx.restore();
          ctx.strokeStyle = "red";
          ctx.lineWidth = 6;
          ctx.stroke();
          ctx.moveTo(0,0);  
        }
    }
    else{
      var ctx = this.CanvasSingle.nativeElement.getContext("2d");
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 255)";
      ctx.fillRect(0, 0, 585*this.imagewidth, 462*this.imageheight);
      ctx.clearRect(0, 0, 585*this.imagewidth, 462*this.imageheight);
      ctx.beginPath();
    }
    }
  }
  
}
