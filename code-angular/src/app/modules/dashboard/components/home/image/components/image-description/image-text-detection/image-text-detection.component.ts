import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-text-detection',
  templateUrl: './image-text-detection.component.html',
  styleUrls: ['./image-text-detection.component.scss']
})
export class ImageTextDetectionComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild('img') imageMain! : ElementRef;
  @ViewChild('Canvas') Canvas! : ElementRef;
  @ViewChild('CanvasSingle') CanvasSingle! : ElementRef;
  @Input('mainImageHeight') mainImageHeight! : string;
  @Input('mainImageWidth') mainImageWidth! : string;
  @Input('ImageData') ImageData! : any;
  @Input('ImgUrl') url!: any;
  @Input('showText') key: number = -1;
  @Output() imageLoader : EventEmitter<boolean> = new EventEmitter<boolean>();//event emitter about image status
  canvaswidth = 0;
  canvasheight = 0;
  imagewidth = 0;
  imageheight = 0;
  setImageDimensions(){
    this.imagewidth = this.imageMain.nativeElement.naturalWidth;
    this.imageheight = this.imageMain.nativeElement.naturalHeight;
  }
  ImageLoaded(){
    this.imageLoader.emit(true);
    this.setImageDimensions();
    if(this.imageheight >= this.imagewidth){
      this.canvasheight = parseInt(this.mainImageHeight);
      this.canvaswidth = (parseInt(this.mainImageHeight) / this.imageheight) * this.imagewidth;
    }
    else if(this.imagewidth > this.imageheight ){
      this.canvaswidth = parseInt(this.mainImageWidth);
      this.canvasheight = (parseInt(this.mainImageWidth) / this.imagewidth) * this.imageheight;
    }
    
    var ctx = this.Canvas.nativeElement.getContext("2d");
    ctx.save();
    this.textDetection = [];
    ctx.fillStyle = "rgba(0, 0, 0, 255)";
    ctx.fillRect(0, 0, 585*this.imagewidth, 462*this.imageheight);
    ctx.clearRect(0, 0, 585*this.imagewidth, 462*this.imageheight);
    ctx.beginPath();
    ctx.scale(585/this.imagewidth, 462/this.imageheight);
    if(this.ImageData.text_detection.length > 0){
      this.textDetection = this.ImageData.text_detection;
      for(let i = 0; i < this.textDetection.length; i++) {
        const text_detect = this.textDetection[i];  
        // bounding poly
        ctx.moveTo(text_detect.bounding_poly[0].x1, text_detect.bounding_poly[0].y1);
        ctx.lineTo(text_detect.bounding_poly[0].x2, text_detect.bounding_poly[0].y2);
        ctx.lineTo(text_detect.bounding_poly[0].x3, text_detect.bounding_poly[0].y3);
        ctx.lineTo(text_detect.bounding_poly[0].x4, text_detect.bounding_poly[0].y4);
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
  imageName = '';
  ImgUrl = '';
  ngOnInit(): void {
    this.ImgUrl = this.url;
  }
  
  ngAfterViewInit(): void {  

  }

  ngOnChanges(): void {
    
    if(this.Canvas){    
      if(this.key === -1){
        this.setImageDimensions();
        if(this.imageheight >= this.imagewidth){
          this.canvasheight = parseInt(this.mainImageHeight);
          this.canvaswidth = (parseInt(this.mainImageHeight) / this.imageheight) * this.imagewidth;
        }
        else if(this.imagewidth > this.imageheight ){
          this.canvaswidth = parseInt(this.mainImageWidth);
          this.canvasheight = (parseInt(this.mainImageWidth) / this.imagewidth) * this.imageheight;
        }
        var ctx = this.CanvasSingle.nativeElement.getContext("2d");
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 255)";
        ctx.fillRect(0, 0, 585*this.imagewidth, 462*this.imageheight);
        ctx.clearRect(0, 0, 585*this.imagewidth, 462*this.imageheight);
        ctx.beginPath();
      }
      
      if(this.key > -1){
        this.setImageDimensions();
        if(this.imageheight >= this.imagewidth){
          this.canvasheight = parseInt(this.mainImageHeight);
          this.canvaswidth = (parseInt(this.mainImageHeight) / this.imageheight) * this.imagewidth;
        }
        else if(this.imagewidth > this.imageheight ){
          this.canvaswidth = parseInt(this.mainImageWidth);
          this.canvasheight = (parseInt(this.mainImageWidth) / this.imagewidth) * this.imageheight;
        }
        var ctx = this.CanvasSingle.nativeElement.getContext("2d");
        ctx.save();
        ctx.scale(585/this.imagewidth, 462/this.imageheight);
        if(this.ImageData.text_detection.length > 0){
          const text_detect = this.ImageData.text_detection[this.key]; 
          // bounding poly
          ctx.moveTo(text_detect.bounding_poly[0].x1, text_detect.bounding_poly[0].y1);
          ctx.lineTo(text_detect.bounding_poly[0].x2, text_detect.bounding_poly[0].y2);
          ctx.lineTo(text_detect.bounding_poly[0].x3, text_detect.bounding_poly[0].y3);
          ctx.lineTo(text_detect.bounding_poly[0].x4, text_detect.bounding_poly[0].y4);
          ctx.closePath();  
          ctx.restore();
          // Fill with gradient
          ctx.strokeStyle = "red";
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.moveTo(0,0);           
        }
      }
    }
  }

  //Text values
  textDetection: any[] = [];
  cursorType = 'grab';

  Grabbing() {
    this.cursorType='grabbing';
  }

  Grab() {
    this.cursorType='grab';
  }

}
