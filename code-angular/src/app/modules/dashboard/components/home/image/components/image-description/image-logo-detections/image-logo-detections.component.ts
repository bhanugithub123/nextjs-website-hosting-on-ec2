import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-logo-detections',
  templateUrl: './image-logo-detections.component.html',
  styleUrls: ['./image-logo-detections.component.scss']
})
export class ImageLogoDetectionsComponent implements OnInit, OnChanges {

  @ViewChild('img') imageMain! : ElementRef;//reference to image
  @ViewChild('Canvas') Canvas! : ElementRef;//reference to main canvas
  @ViewChild('CanvasSingle') CanvasSingle! : ElementRef;//reference to canvas that show hover effect
  @Input('mainImageHeight') mainImageHeight! : string;//store image natural height
  @Input('mainImageWidth') mainImageWidth! : string;//store image natural width
  @Input('ImageData') ImageData! : any;//store image data from parent component
  @Input('ImgUrl') url!: any;//store image url
  @Output() imageLoader : EventEmitter<boolean> = new EventEmitter<boolean>();//event emitter about image status
  @Input('logo') logo! : number;//store id to specific logo from parent component
  imageName = '';//stores image name
  ImgUrl = '';//store image url locally
  imagewidth = 0;//store current image width
  imageheight = 0;//store current image height
  //facial values
  logoDetection: any[] = [];
  cursorType = 'grab';
  canvaswidth = 0;
  canvasheight = 0;
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
    this.logoDetection.push(this.ImageData.logo_detection); 
    var ctx = this.Canvas.nativeElement.getContext("2d");
    ctx.save();
    ctx.scale(585/this.imagewidth, 462/this.imageheight);
    ctx.beginPath();
    if(this.logoDetection[0][0].message){
      //do nothing
    }
    else{
      for(let i = 0; i < this.logoDetection[0].length; i++) {
        const logo_detect = this.logoDetection[0][i];   
        // bounding poly
        ctx.moveTo(logo_detect.bounding_poly[0].x1, logo_detect.bounding_poly[0].y1);
        ctx.lineTo(logo_detect.bounding_poly[0].x2, logo_detect.bounding_poly[0].y2);
        ctx.lineTo(logo_detect.bounding_poly[0].x3, logo_detect.bounding_poly[0].y3);
        ctx.lineTo(logo_detect.bounding_poly[0].x4, logo_detect.bounding_poly[0].y4);
        ctx.closePath();
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
  
  ngAfterViewInit(): void {
    
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
      if(this.logo > -1){
        var ctx = this.CanvasSingle.nativeElement.getContext("2d");
        ctx.save();
        ctx.scale(585/this.imagewidth, 462/this.imageheight);
        ctx.beginPath();
        if(this.logoDetection[0][0].message){
          //do nothing
        }
        else{
          const logo_detect = this.logoDetection[0][this.logo];
          // bounding poly
          ctx.moveTo(logo_detect.bounding_poly[0].x1, logo_detect.bounding_poly[0].y1);
          ctx.lineTo(logo_detect.bounding_poly[0].x2, logo_detect.bounding_poly[0].y2);
          ctx.lineTo(logo_detect.bounding_poly[0].x3, logo_detect.bounding_poly[0].y3);
          ctx.lineTo(logo_detect.bounding_poly[0].x4, logo_detect.bounding_poly[0].y4);
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
