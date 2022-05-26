import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';
import { VideosService } from 'src/app/modules/dashboard/shared/video/videos.service';

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  videoSRC : any;//store source blob data to video
  @Input() VideoPath!: any;//input video path from parent element
  @Input() info!: any;//import video information from parent element
  @Input() comp!: any;//input current component name from parent component
  @Output() videoLoaded : EventEmitter<void> = new EventEmitter<void>();
  timeStamp : any[] = [];//store bounding poly values when a single track is there
  timeStampCollective : any[] =[];//stores bounding poyl values when multiple tracks are there
  counter = 1;//counter to bounding poly
  multiple = false;//boolean to multiple tracks
  detect = false;//boolean to single track
  showVolumeSlider = false;//boolean to volume slider
  time = '00:00:00';//store current time
  totalTime = '00:00:00';//stores  duration of the video
  fullscreen = false;//boolean to toggle fullscreen
  seekTime = '00:00:00';//popup to show seek time
  showSeekTime = false;//boolean to popup seek time
  seekLeft = {'left': "30px"};
  Jump_Time = '';//time at which to jump the video
  timer : any;
  isplaying = false;
  showSpinner = true;//toggle to show/hide spinner
  videoheight = 0;
  videowidth = 0;
  BoundingBoxPresent = false;
  svgWidth = '840px';
  svgHeight = '315px';
  Loaded(){
    this.showSpinner = false;//hide spinner when video is loaded
    const video = <HTMLVideoElement>document.querySelector("#player");
    if(video != null){
      video.addEventListener('timeupdate', this.timeUpdated.bind(this));
      video.addEventListener('loadedmetadata', (e) => {
        this.svgWidth = ((315 / video.videoHeight) * video.videoWidth).toString() + 'px';
        var seconds = video.duration;
        localStorage.setItem('videoduration', `${video.duration}`);
        this.videoLoaded.emit();
        var minutes = 0;
        var hours = 0;
        const returnTime = this.convertTime(seconds, minutes, hours);    
        this.totalTime = `${returnTime[2]}:${returnTime[1]}:${returnTime[0]}`;
      });
    }
  }
  constructor(
    private videoservice : VideosService,//reference to video service
    private _ToggleAlert: ToggleAlertService// reference to alert service
    ) {
      document.addEventListener('fullscreenchange', ()=>{//function to listen to fullscreen close event
        const video = <HTMLVideoElement>document.querySelector("#player");
        let svg = <HTMLElement>document.querySelector('#svg-wrapper');
        let video_wrapper = <HTMLElement>document.querySelector('#video1');
        if(!document.fullscreenElement){
          this.fullscreen = false;
          video.setAttribute("style", "object-fit: contain;width:840px;height:315px");
          this.svgWidth = ((315 / video.videoHeight) * video.videoWidth).toString() + 'px';
          this.svgHeight = '315px';
          video.classList.remove('fullscreen');
          svg.classList.remove('fullscreen');
          video_wrapper.classList.remove('fullscreen');
        }
      });
    }
  ngOnInit(): void {
    this.videoservice.getVideoTime$().subscribe(
      (time) =>{
        this.Jump_Time = time;
        this.Jumptime();
      }
    );
  }

  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }

  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }
  ngAfterViewInit(): void {
    this.videoservice.LoadVideo().subscribe(
      (data)=>{
        const blob = new Blob([data], { type: 'video' });
        this.videoSRC = blob;
        const vidReq = document.createElement('video');
        vidReq.setAttribute("width", "840");
        vidReq.setAttribute("height", "315");
        vidReq.setAttribute("style", "object-fit: contain;");
        vidReq.setAttribute("id", "player");
        vidReq.src = window.URL.createObjectURL(blob);
        vidReq.click();
        const element = document.querySelector("#video1");
        element?.append(vidReq);
        this.Loaded();
        this.SetTimeStamps();
      },
      (err : HttpErrorResponse) => {
        if(err.error.non_field_errors){
          this.ThrowErrorMessage(err.error.non_field_errors[0]);
        }
        else if(err.status === 0){
          this.ThrowErrorMessage("Address Not Reachable.Please Try Again!")
        }
        else if(err.status === 504){
          this.ThrowErrorMessage("Server Not Responding.Please Try Again!")
        }
        else if(err.status === 500){
          this.ThrowErrorMessage("Internal Server Error.Please Try Again!")
        }
        else if(err.status === 400){
          this.ThrowErrorMessage("Bad Request!")
        }
        else{
          this.ThrowErrorMessage("Oops Something Went Wrong. Please Try Again!");
        };
        this.Loaded();
      }
    );
  }

  pushDataIntoTimeStamp(data : any, text : string){
    const x1 = data.rotated_bounding_box.x1;
    const x2 = data.rotated_bounding_box.x2;
    const y1 = data.rotated_bounding_box.y1;
    const y4 = data.rotated_bounding_box.y4;
    this.timeStamp.push({
      time: data.time_offset,
      bounding_poly: {
        left : x1,
        right : x2,
        top : y1,
        bottom : y4
      },
      text: text
    });
  }
  SetTimeStamps(){//set time stamp of current required bounding box 
    this.timeStamp = [];
    this.timeStampCollective = [];
    this.isplaying = false;
    const video = <HTMLVideoElement>document.querySelector("#player");
    video.pause();
    clearInterval(this.timer);
    video.currentTime = 0;
    const progress = <HTMLElement>document.querySelector("#progress");
    const progressPercent = ( video.currentTime / video.duration ) * 100;
    progress.style.width = `${progressPercent}%`; 
    const svg = document.getElementById('svg');
    if(svg != null){
      svg!.innerHTML = '';
    }
    //face Detections
    if(this.comp === 'Face Detections'){
      this.BoundingBoxPresent = true;
      this.detect = true;
      if(this.info){
        if(this.info.length === 1) {//if the response has single track
          this.multiple = false;
          this.info[0].tracks.forEach(
            (track : any) => {
              track.timestamped_objects.forEach(
                (data : any) => {
                  this.timeStamp.push({
                    time: data.time_offset,
                    bounding_poly: data.normalized_bounding_box[0],
                    text : ''
                  });
                }
              );
            }
          );
          this.sort(this.timeStamp);
        }
        else {//if the response has multiple tracks
          this.multiple = true;
          this.info.forEach(
            (tracks : any)=> {
              tracks.tracks[0].timestamped_objects.forEach(
                (data : any) => {
                  this.timeStamp.push({
                    time: data.time_offset,
                    bounding_poly: data.normalized_bounding_box[0],
                    text: ''
                  });
                }
              );
            }
          );
          this.sort(this.timeStamp);
          const len = this.timeStamp.length;
          for(let i = 0; i < len - 1; i++ ){
            var temp = [];
            while(this.timeStamp[i].time === this.timeStamp[i+1].time){
              temp.push(this.timeStamp[i]);
              i++;
              if(i === len - 2 || i === len - 1) {
                break;
              }
            }
            temp.push(this.timeStamp[i]);
            this.timeStampCollective.push(temp);
            if(i === len - 2){
              temp = [];
              temp.push(this.timeStamp[i + 1]);
              this.timeStampCollective.push(temp)
            }
          }
        }
      }
    }
    //person Detections
    if(this.comp === 'Person Detections'){
      this.BoundingBoxPresent = true;
      this.detect = true;
      if(this.info){
        if(this.info[0].tracks.length === 1) {
          this.multiple = false;
          this.info[0].tracks.forEach(
            (track : any) => {
              track.timestamped_objects.forEach(
                (data : any) => {
                  this.timeStamp.push({
                    time: data.time_offset,
                    bounding_poly: data.normalized_bounding_box,
                    text : ''
                  });
                }
              );
            }
          );
          this.sort(this.timeStamp);
        }
        else {
          this.multiple = true;
          this.info[0].tracks.forEach(
            (tracks : any)=> {
              tracks.timestamped_objects.forEach(
                (data : any) => {
                  this.timeStamp.push({
                    time: data.time_offset,
                    bounding_poly: data.normalized_bounding_box,
                    text : ''
                  });
                }
              );
            }
          );
          this.sort(this.timeStamp);
          const len = this.timeStamp.length;
          for(let i = 0; i < len - 1; i++ ){
            var temp = [];
            while(this.timeStamp[i].time === this.timeStamp[i+1].time){
              temp.push(this.timeStamp[i]);
              i++;
              if(i === len - 2 || i === len - 1) {
                break;
              }
            }
            temp.push(this.timeStamp[i]);
            this.timeStampCollective.push(temp);
            if(i === len - 2){
              temp = [];
              temp.push(this.timeStamp[i + 1]);
              this.timeStampCollective.push(temp)
            }
          }
        }
      }
    }
    //Object Tracking
    if(this.comp === 'Object Tracking'){
      this.BoundingBoxPresent = true;
      this.detect = true;
      if(this.info){
        if(this.info.length === 1) {
          this.multiple = false;
          this.info[0].tracks.forEach(
            (tracks : any)=> {
              tracks.frame.forEach(
                (data : any) => {
                  this.timeStamp.push({
                    time: data.time_offset,
                    bounding_poly: data.normalized_bounding_box[0],
                    text: tracks.entity[0].description
                  });
                }
              );
            }
          );
          this.sort(this.timeStamp);
        }
        else {
          this.multiple = true;
          this.info.forEach(
            (tracks : any)=> {
              tracks.frame.forEach(
                (data : any) => {
                  this.timeStamp.push({
                    time: data.time_offset,
                    bounding_poly: data.normalized_bounding_box[0],
                    text: tracks.entity[0].description
                  });
                }
              );
            }
          );
          this.sort(this.timeStamp);
          const len = this.timeStamp.length;
          for(let i = 0; i < len - 1; i++ ){
            var temp = [];
            while(this.timeStamp[i].time === this.timeStamp[i+1].time){
              temp.push(this.timeStamp[i]);
              i++;
              if(i === len - 2 || i === len - 1) {
                break;
              }
            }
            temp.push(this.timeStamp[i]);
            this.timeStampCollective.push(temp);
            if(i === len - 2){
              temp = [];
              temp.push(this.timeStamp[i + 1]);
              this.timeStampCollective.push(temp)
            }
          }
        }
      }
    }
    //logo detection
    if(this.comp === 'Logo Detections'){
      this.BoundingBoxPresent = true;
      this.detect = true;
      if(this.info){
        if(this.info.length === 1) {
          this.multiple = false;
          this.info.forEach(
            (logo : any) => {
              logo.tracks.forEach(
                  (track : any) => {
                    track.timestamped_objects.forEach(
                      (data : any) => {
                        this.timeStamp.push({
                          time: data.time_offset,
                          bounding_poly: data.normalized_bounding_box,
                          text : logo.description
                        });
                      }
                    );
                  }
                );
              }
            );
          this.sort(this.timeStamp);
        }
        else {
          this.multiple = true;
          this.info.forEach(
            (logo : any) => {
              logo.tracks.forEach(
                  (track : any) => {
                    track.timestamped_objects.forEach(
                      (data : any) => {
                        this.timeStamp.push({
                          time: data.time_offset,
                          bounding_poly: data.normalized_bounding_box,
                          text : logo.description
                        });
                      }
                    );
                  }
                );
            }
          );
          this.sort(this.timeStamp);
          const len = this.timeStamp.length;
          for(let i = 0; i < len - 1; i++ ){
            var temp = [];
            while(this.timeStamp[i].time === this.timeStamp[i+1].time){
              temp.push(this.timeStamp[i]);
              i++;
              if(i === len - 2 || i === len - 1) {
                break;
              }
            }
            temp.push(this.timeStamp[i]);
            this.timeStampCollective.push(temp);
            if(i === len - 2){
              temp = [];
              temp.push(this.timeStamp[i + 1]);
              this.timeStampCollective.push(temp)
            }
          }
        }
      }
    }
    //text detection
    if(this.comp === 'Text Detections'){
      this.BoundingBoxPresent = true;
      this.detect = true;
      if(this.info){
        if(this.info.length === 1) {
          this.multiple = false;
          this.info[0].tracks.forEach(
            (tracks : any)=> {
              tracks.frames.forEach(
                (data : any) => {
                  this.pushDataIntoTimeStamp(data, tracks.text);
                }
              );
            }
          );
          this.sort(this.timeStamp);
        }
        else {
          this.multiple = true;
          this.info.forEach(
            (track : any)=> {
              track.frames.forEach(
                (data : any) => {
                  this.pushDataIntoTimeStamp(data, track.text);
                }
              );
            }
          );
          
          this.sort(this.timeStamp);
          const len = this.timeStamp.length;
          for(let i = 0; i < len - 1; i++ ){
            var temp = [];
            while(this.timeStamp[i].time === this.timeStamp[i+1].time){
              temp.push(this.timeStamp[i]);
              i++;
              if(i === len - 2 || i === len - 1) {
                break;
              }
            }
            
            temp.push(this.timeStamp[i]);
            this.timeStampCollective.push(temp);
            if(i === len - 2){
              temp = [];
              temp.push(this.timeStamp[i + 1]);
              this.timeStampCollective.push(temp)
            }
          }
        }
      }
    }
  }
  
  sort(list : any){
    const len = list.length;
    for (let i = 0; i < len-1; i++) {
      for (let j = 0; j < len-i-1; j++) {
        if (list[j].time > list[j+1].time) 
          { 
            const temp = list[j]; 
            list[j] = list[j+1]; 
            list[j+1] = temp; 
          } 
      }  
    }
  }
  
  ngOnChanges(): void {//detect change
    this.timeStamp = [];
    this.timeStampCollective = [];
    this.detect = false;
    this.multiple = false;
    if(!this.showSpinner){
      this.SetTimeStamps();
    }
    let svg : any[] = [document.getElementById('svg1'),document.getElementById('svg2'),document.getElementById('svg3'),document.getElementById('svg4'),document.getElementById('svg5'),document.getElementById('svg6')];
    for(let i = 0; i < 6; i++){
      if(svg[i]){
        svg[i].innerHTML = '';
      }
    }
  }
  
  //if single element present
  CreateBoundingBoxSVG(data : any){
    this.timer = setInterval(
      () => {
        const video = <HTMLMediaElement>document.querySelector("#player");
        const time = video.currentTime;
        let counter = this.counter;
        
        if(time === video.duration) {
          clearInterval(this.timer);
          return;
        }
        if(counter === 1){
          const svg: HTMLVideoElement = <HTMLVideoElement>document.getElementById('svg1');
          const x = data[counter-1].bounding_poly.left;
          const y = data[counter-1].bounding_poly.top;
          const w = data[counter-1].bounding_poly.right - data[counter-1].bounding_poly.left;
          const h = data[counter-1].bounding_poly.bottom - data[counter-1].bounding_poly.top;
          svg.innerHTML = '<g>'+
                        `<rect x="${x*100}%" y="${y*100}%" width="${w*100}%" height="${h*100}%" style="fill:rgba(0,0,0,0);stroke-width:3;stroke:green;"/>`+
                      '</g>';
          this.counter+=1;
        }
        
        if(data[counter]){
          while(time.toFixed(1) > data[counter].time.toFixed(1)){
            counter+=1;
            this.counter+=1;
          }
          if(time.toFixed(1) === data[counter].time.toFixed(1)){
            const x = data[counter].bounding_poly.left;
            const y = data[counter].bounding_poly.top;
            const w = data[counter].bounding_poly.right - data[counter].bounding_poly.left;
            const h = data[counter].bounding_poly.bottom - data[counter].bounding_poly.top;
            const svg: HTMLVideoElement = <HTMLVideoElement>document.getElementById('svg1');
            svg.innerHTML = '<g>'+
                      `<rect x="${x*100}%" y="${y*100}%" width="${w*100}%" height="${h*100}%" style="fill:rgba(0,0,0,0);stroke-width:3;stroke:green;"/>`+
                    '</g>';
            
            this.counter+=1;
          }
        }
        if(data.length - 1 === counter){
          const svg: HTMLVideoElement = <HTMLVideoElement>document.getElementById('svg1');
          svg.innerHTML = '';
        }
      }, 40
    )
  }
  // if multiple element present 
  CreateMulitpleBoundingBoxSVG(data : any) {
    this.timer = setInterval(
      () => {
        const video = <HTMLMediaElement>document.querySelector("#player");
        const time = video.currentTime; 
        let svg : any[] = [document.getElementById('svg1'),document.getElementById('svg2'),document.getElementById('svg3'),document.getElementById('svg4'),document.getElementById('svg5'),document.getElementById('svg6')];
        if(parseFloat(video.currentTime.toFixed(1)) < parseFloat(data[this.counter][0].time.toFixed(1))){
          this.counter = 1;
        }
        let counter = this.counter;
        if(time === video.duration) {
          clearInterval(this.timer);
          return;
        }
        if(counter === 1){
          var innerLength = data[counter - 1].length;    
          if(innerLength > 6){
            innerLength = 6;
          }      
          for(let i = 0; i < innerLength - 1; i++){    
            const x = data[counter-1][i].bounding_poly.left;
            const y = data[counter-1][i].bounding_poly.top;
            const w = data[counter-1][i].bounding_poly.right - data[counter-1][i].bounding_poly.left;
            const h = data[counter-1][i].bounding_poly.bottom - data[counter-1][i].bounding_poly.top;
            svg[i].innerHTML = `<rect x="${x*100}%" y="${y*100}%" width="${w*100}%" height="${h*100}%" style="fill:rgba(0,0,0,0);stroke-width:3;stroke:green;"/>`;
          }
          this.counter+=1;
        }
        if(data[counter]){
          var innerLength = data[counter].length;    
          if(innerLength > 6){
            innerLength = 6;
          } 
          let x = [];
          let y = [];
          let w = [];
          let h = [];
          if(parseFloat(video.currentTime.toFixed(1)) > parseFloat(data[counter][0].time.toFixed(1))){
              while(parseFloat(video.currentTime.toFixed(1)) > parseFloat(data[counter][0].time.toFixed(1))){
                counter += 1;
              }
          }
          for(let i = 0; i < innerLength; i++){   
            if(data[counter][i]){
              if(parseFloat(data[counter][i].time.toFixed(1)) - parseFloat(time.toFixed(1)) > 0.75  ){
                for(let i = 0; i < 6; i++){
                  svg[i].innerHTML = '';
                }
              }   
              if(parseFloat(video.currentTime.toFixed(1)) === parseFloat(data[counter][0].time.toFixed(1))){
                x.push(data[counter][i].bounding_poly.left);
                y.push(data[counter][i].bounding_poly.top);
                w.push(data[counter][i].bounding_poly.right - data[counter][i].bounding_poly.left);
                h.push(data[counter][i].bounding_poly.bottom - data[counter][i].bounding_poly.top);
                for(let i = 0; i < innerLength; i++){
                  if(svg.length > innerLength){
                    let c = innerLength;
                    while(c != svg.length){
                      svg[c].innerHTML = '';
                      c++;
                    }
                  }
                  if(!isNaN(x[i]) && !isNaN(y[i]) && !isNaN(h[i]) && !isNaN(w[i])){
                    svg[i].innerHTML = '<g>' + `<text x="${x[i]*100}%" y="${y[i]*100}%" fill="red">${data[counter][i].text}</text> <rect x="${x[i]*100}%" y="${y[i]*100}%" width="${w[i]*100}%" height="${h[i]*100}%" style="fill:rgba(0,0,0,0);stroke-width:3;stroke:green;"/>` + '</g>';
                  }
                  
                }
                this.counter+=1;
              }
            }
            
            if(data.length - 1 === counter){
              for(let i = 0; i < 6; i++){
                svg[i].innerHTML = '';
              }
            }
          } 
        }
      }, 40
    )
  }  
  
  //play video
  playVideo() {
    if(!this.isplaying){
      this.isplaying = true;
      const video = <HTMLMediaElement>document.querySelector("#player");
      video.play();
      if(video.currentTime === 0){
        this.counter = 1;
      }
      if(this.detect){
        if(this.multiple){
          this.CreateMulitpleBoundingBoxSVG(this.timeStampCollective);
        }
        else{
          this.CreateBoundingBoxSVG(this.timeStamp);
        }
      }      
    }
    else {
      this.isplaying = false;
      const video = <HTMLMediaElement>document.querySelector("#player");
      video.pause();
      clearInterval(this.timer);
    }
  }
  //convert seconds to minutes and hours
  convertTime(seconds: any, minutes: number, hours: number) {
    if(seconds > 60){
      minutes = Math.floor(seconds / 60);
      seconds = seconds - minutes * 60;     
    }
    if(minutes > 60){
      hours = Math.floor(minutes / 60);
      minutes = minutes - hours * 60
    }
    seconds = seconds.toFixed(0);
    var ss = `0${seconds}`;
    if(seconds > 9){
      ss = `${seconds}`;
    }
    var mm = `0${minutes}`;
    if(minutes > 9){
      mm = `${minutes}`
    }
    var hh = `0${hours}`;
    if(hours > 9){
      hh = `${hours}`
    }
    return [ss, mm, hh];
  }

  ToggleShowVolumeSlider(){
    this.showVolumeSlider = !this.showVolumeSlider;
  }

  Jumptime(){
    var seconds = -1;
    var video = <HTMLMediaElement>document.querySelector("#player");
    const split = new Promise((resolve)=>{
     setTimeout(() => {
      const hh = parseInt(this.Jump_Time.split(':')[0]);
      const mm = parseInt(this.Jump_Time.split(':')[1]);
      const ss = parseInt(this.Jump_Time.split(':')[2]);
      seconds = ss + (mm * 60) + (hh * 60 * 60);
      video.currentTime = seconds;
      this.counter += 1;
      resolve('success');
     }, 100);
    });
    
    split.then(()=>{
      const progress = <HTMLElement>document.querySelector("#progress");
      const progressPercent = ( seconds / video.duration ) * 100;
      progress.style.width = `${progressPercent}%`;
      const returnTime = this.convertTime(seconds, 0, 0);    
      this.time = `${returnTime[2]}:${returnTime[1]}:${returnTime[0]}`;
      let svg : any[] = [document.getElementById('svg1'),document.getElementById('svg2'),document.getElementById('svg3'),document.getElementById('svg4'),document.getElementById('svg5'),document.getElementById('svg6')];
      for(let i = 0; i < 6; i++){
        svg[i].innerHTML = '';
      }
    });
  }
  //updated video time
  timeUpdated() {
    const video = <HTMLMediaElement>document.querySelector("#player");
    const progress = <HTMLElement>document.querySelector("#progress");
    let svg : any[] = [document.getElementById('svg1'),document.getElementById('svg2'),document.getElementById('svg3'),document.getElementById('svg4'),document.getElementById('svg5'),document.getElementById('svg6')];
    if(this.isplaying){
      const progressPercent = ( video.currentTime / video.duration ) * 100;
      progress.style.width = `${progressPercent}%`;    
      if(video.currentTime === video.duration){
        this.isplaying = false;
        video.pause();

        for(let i = 0; i < 6; i++){
          svg[i].innerHTML = '';
        }
        clearInterval(this.timer);
        video.currentTime = 0;
        progress.style.width = `0%`; 
      }     
    }
    var seconds = video.currentTime;
    var minutes = 0;
    var hours = 0;
    const returnTime = this.convertTime(seconds, minutes, hours);    
    this.time = `${returnTime[2]}:${returnTime[1]}:${returnTime[0]}`;
  }

  ChangeProgress(event : any){
    const split = new Promise((resolve)=>{
      const video = <HTMLMediaElement>document.querySelector("#player");
      this.counter += 1;
      resolve('success');
     });
     
     split.then(()=>{
      const video = <HTMLMediaElement>document.querySelector("#player");
      const progress = <HTMLElement>document.querySelector("#progress")
      const totalWidth = this.progressBar.nativeElement.clientWidth;
      const offsetXNew = event.offsetX;
      let newWidth = (offsetXNew / totalWidth) * 100;
      const newVideoPosition = (newWidth / 100) * video.duration;
      video.currentTime = newVideoPosition;
      progress.style.width = `${newWidth}%`;
      const returnTime = this.convertTime(video.currentTime, 0, 0);    
      this.time = `${returnTime[2]}:${returnTime[1]}:${returnTime[0]}`;
      // this.counter = 1;
      let svg : any[] = [document.getElementById('svg1'),document.getElementById('svg2'),document.getElementById('svg3'),document.getElementById('svg4'),document.getElementById('svg5'),document.getElementById('svg6')];
      for(let i = 0; i < 6; i++){
        svg[i].innerHTML = '';
      }
     });
    
  }
  @ViewChild('progressBar') progressBar! : ElementRef;
  SeekTime(event : any) {
    this.showSeekTime = !this.showSeekTime;
    if(this.showSeekTime){
      const pos = event.clientX - this.progressBar.nativeElement.getBoundingClientRect().left;
      const video = <HTMLMediaElement>document.querySelector("#player");
      // set seek icon position
      this.seekLeft = {'left': `calc(${pos}px + 30px)`};
      const seekProgress = ( (pos) / this.progressBar.nativeElement.offsetWidth) * 100;
      const seektime = (seekProgress * video.duration) / 100;
      const returnTime = this.convertTime(seektime, 0, 0);
      this.seekTime = `${returnTime[2]}:${returnTime[1]}:${returnTime[0]}`;
    }    
  }

  ChangeVolume(event :any){//method to change volume
    const video = <HTMLMediaElement>document.querySelector("#player");
    video.volume = event.target.value / 100;
  }
  @ViewChild('video1') video1!: ElementRef;
  @ViewChild('svg_wrapper') svg_wrapper!: ElementRef;
  ToggleFullscreen() {//method to toggle fullscreen
    this.fullscreen = !this.fullscreen;
    const video = <HTMLVideoElement>document.querySelector("#player");
    let elem = <HTMLElement>document.querySelector('#wrapper-all');
    let svg = <HTMLElement>document.querySelector('#svg-wrapper');
    let video_wrapper = <HTMLElement>document.querySelector('#video1');
    if(this.fullscreen){
      if (elem.requestFullscreen) {
        video.setAttribute("style", "object-fit: contain;");
        video.setAttribute("width", "");
        video.setAttribute("height", "");
        this.svgWidth = (video.videoWidth).toString() + 'px';
        this.svgHeight = video.videoHeight.toString() + 'px';
        if(video.videoHeight > screen.height){
          this.svgWidth = '100vw';
          this.svgHeight = '100vh';
          video.setAttribute("style", "object-fit: contain;width:100vw;height:100vh");
        }
        video.classList.add('fullscreen');
        svg.classList.add('fullscreen');
        video_wrapper.classList.add('fullscreen');
        elem.requestFullscreen();
      }
    }
    else{
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      video.setAttribute("style", "object-fit: contain;");
      this.svgWidth = ((315 / video.videoHeight) * video.videoWidth).toString() + 'px';
      this.svgHeight = '315px';
      video.setAttribute("width", "840");
      video.setAttribute("height", "315");
      
      video.classList.remove('fullscreen');
      svg.classList.remove('fullscreen');
      video_wrapper.classList.remove('fullscreen');
    }
  }

  ngOnDestroy(): void {
    // this.videoservice.LoadVideo().unsubscribe();
    this.isplaying = false;
    const video = <HTMLMediaElement>document.querySelector("#player");
    if(video){
      video.pause();
    }
    clearInterval(this.timer);
  }

}
