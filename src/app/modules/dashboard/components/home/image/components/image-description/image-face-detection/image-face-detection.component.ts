import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'image-face-detection',
  templateUrl: './image-face-detection.component.html',
  styleUrls: ['./image-face-detection.component.scss']
})
export class ImageFaceDetectionComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('img') imageMain! : ElementRef;//reference to image element
  @ViewChild('Canvas') Canvas! : ElementRef;//reference to canvas element
  @ViewChild('CanvasSingle') CanvasSingle! : ElementRef;//reference to canvas element
  @Input('mainImageHeight') mainImageHeight! : string;//reference to image height
  @Input('mainImageWidth') mainImageWidth! : string;//reference to image width
  @Input('ImageData') ImageData! : any;// reference to image data from parent component
  @Input('ImgUrl') url!: any;// reference to image url
  imagewidth = 0;//store image width
  imageheight = 0;//store image height
  ImgUrl = '';//store image url in this component
  @Output() imageLoader : EventEmitter<boolean> = new EventEmitter<boolean>();//event emitter about image status
  @Input('face') key!: number;
  //facial values
  facialDetection: any[] = [];
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
  }
  ngOnChanges(): void {
    if(this.imageheight >= this.imagewidth){
      this.canvasheight = parseInt(this.mainImageHeight);
      this.canvaswidth = (parseInt(this.mainImageHeight) / this.imageheight) * this.imagewidth;
    }
    else if(this.imagewidth > this.imageheight ){
      this.canvaswidth = parseInt(this.mainImageWidth);
      this.canvasheight = (parseInt(this.mainImageWidth) / this.imagewidth) * this.imageheight;
    }
    if(this.Canvas){
      if(this.key > -1){
        this.imagewidth = this.imageMain.nativeElement.naturalWidth;
        this.imageheight = this.imageMain.nativeElement.naturalHeight;
        
        let radius = 2;
        if(this.imagewidth > 1000){
          radius = 5;
        }
        if(this.imagewidth < 200){
          radius = 0.2
        }
        var ctx = this.CanvasSingle.nativeElement.getContext("2d");
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 255)";
        ctx.fillRect(0, 0, 585*this.imagewidth, 462*this.imageheight);
        ctx.clearRect(0, 0, 585*this.imagewidth, 462*this.imageheight);
        ctx.beginPath();
        ctx.scale(585/this.imagewidth, 462/this.imageheight);
        ctx.beginPath();
        if(this.facialDetection[0][0].message){
          //do nothing
        }
        else{
          const facial_detect = this.facialDetection[0][this.key];     
          // bounding poly
          ctx.moveTo(facial_detect.bounding_poly[0].x1, facial_detect.bounding_poly[0].y1);
          ctx.lineTo(facial_detect.bounding_poly[0].x2, facial_detect.bounding_poly[0].y2);
          ctx.lineTo(facial_detect.bounding_poly[0].x3, facial_detect.bounding_poly[0].y3);
          ctx.lineTo(facial_detect.bounding_poly[0].x4, facial_detect.bounding_poly[0].y4);
          ctx.closePath();
  
          //fd bounding poly
          ctx.moveTo(facial_detect.fd_bounding_poly[0].x1, facial_detect.fd_bounding_poly[0].y1);
          ctx.lineTo(facial_detect.fd_bounding_poly[0].x2, facial_detect.fd_bounding_poly[0].y2);
          ctx.lineTo(facial_detect.fd_bounding_poly[0].x3, facial_detect.fd_bounding_poly[0].y3);
          ctx.lineTo(facial_detect.fd_bounding_poly[0].x4, facial_detect.fd_bounding_poly[0].y4);
          ctx.closePath();
  
          //landmarks
          facial_detect.landmarks.forEach(
            (element:any) => {
              ctx.moveTo(element.position[0].x, element.position[0].y)
              ctx.arc(element.position[0].x, element.position[0].y, radius, 0, 2 * Math.PI);
            }
          );  
          ctx.restore();
          ctx.strokeStyle = "red";
          ctx.lineWidth = 5;
          ctx.stroke();
          ctx.moveTo(0,0);
        }     
      }
      else{
        this.imagewidth = this.imageMain.nativeElement.naturalWidth;
        this.imageheight = this.imageMain.nativeElement.naturalHeight;
        var ctx = this.CanvasSingle.nativeElement.getContext("2d");
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 255)";
        ctx.fillRect(0, 0, 585*this.imagewidth, 462*this.imageheight);
        ctx.clearRect(0, 0, 585*this.imagewidth, 462*this.imageheight);
        ctx.beginPath();
      }
    }
    
  }
  ngOnInit(): void { 
    this.ImgUrl = this.url;  
  }
  constructor() { }
  ngAfterViewInit(): void {
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
      let radius = 2;
        if(this.imagewidth > 1000){
          radius = 5;
        }
        if(this.imagewidth < 200){
          radius = 0.2
        }
      this.facialDetection.push(this.ImageData.facial_detection);
      var ctx = this.Canvas.nativeElement.getContext("2d");
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 255)";
      ctx.fillRect(0, 0, 585*this.imagewidth, 462*this.imageheight);
      ctx.clearRect(0, 0, 585*this.imagewidth, 462*this.imageheight);
      ctx.beginPath();
      ctx.scale(585/this.imagewidth, 462/this.imageheight);
      ctx.beginPath();
      if(this.facialDetection[0][0].message){
        //do nothing
      }
      else{
        for(let i = 0; i < this.facialDetection[0].length; i++) {
          const facial_detect = this.facialDetection[0][i];     
          // bounding poly
          ctx.moveTo(facial_detect.bounding_poly[0].x1, facial_detect.bounding_poly[0].y1);
          ctx.lineTo(facial_detect.bounding_poly[0].x2, facial_detect.bounding_poly[0].y2);
          ctx.lineTo(facial_detect.bounding_poly[0].x3, facial_detect.bounding_poly[0].y3);
          ctx.lineTo(facial_detect.bounding_poly[0].x4, facial_detect.bounding_poly[0].y4);
          ctx.closePath();
  
          //fd bounding poly
          ctx.moveTo(facial_detect.fd_bounding_poly[0].x1, facial_detect.fd_bounding_poly[0].y1);
          ctx.lineTo(facial_detect.fd_bounding_poly[0].x2, facial_detect.fd_bounding_poly[0].y2);
          ctx.lineTo(facial_detect.fd_bounding_poly[0].x3, facial_detect.fd_bounding_poly[0].y3);
          ctx.lineTo(facial_detect.fd_bounding_poly[0].x4, facial_detect.fd_bounding_poly[0].y4);
          ctx.closePath();
  
          //landmarks
          facial_detect.landmarks.forEach(
            (element:any) => {
              ctx.moveTo(element.position[0].x, element.position[0].y)
              ctx.arc(element.position[0].x, element.position[0].y, radius, 0, 2 * Math.PI);
            }
          );
        }    
        ctx.restore();
        ctx.strokeStyle = "#95E06C";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.moveTo(0,0);
      }      
  }
  
}
