import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { RouteService } from '../../components/home/shared/route.service';
import { ImageService } from '../../shared/image/image.service';
import { ToggleAlertService } from '../../shared/toggle-alert.service';
import { UploadFileService } from '../../shared/upload/upload-file.service';
import { UserDetailsService } from '../../shared/user-details.service';
import { VideosService } from '../../shared/video/videos.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  closeResult = '';
  userName! : any;
  _menuOpened = false;
  term = '';
  profileurl: string="url('/assets/images/ben-sweet-2LowviVHZ-E-unsplash.jpg')";
  profilePic = {'background-image' : this.profileurl };
  images : any[] = [];
  display = {'display': 'none'};
  setImageActive = false;
  videos:any[] = [];
  filteredVideos:any[] = [];
  filteredImages : any [] = [];
  searchVisible = {'display': 'none'};
  showUploadElements = true;
  showModals = false;
  minWidth = '0px';
  innerWidth! : number;
  UploadComp = false;
  imageLoading = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth < 989){
      this.minWidth = '1095px';
    }
  }
  constructor(
    private router : Router, 
    private _UserDetailsService:UserDetailsService,
    private _VideoService : VideosService,
    private _ImageService : ImageService,
    private _UploadFileService: UploadFileService,
    private _Router : Router,
    private _ToggleAlert : ToggleAlertService
    ) { }  

  ThrowMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ngOnInit(): void {
    this._UploadFileService.Done$().subscribe(
      () => {
        this.close();
      }
    );
    if(this.router.url.includes('image')) {
      this.setImageActive = true;
    }
    else{
      this.setImageActive = false;
    }
    if(this.innerWidth < 989){
      this.minWidth = '1095px';
    }
    if(localStorage.getItem('showUpload') === "false"){
         this.showUploadElements = false;
    }
    else{
      this.showUploadElements = true;
    }
    this._UserDetailsService.hideUpload$.subscribe(
      () => {
        this.showUploadElements = false;
      }
    );
    this._UserDetailsService.showUpload$.subscribe(
      () => {
        this.showUploadElements = true;
      }
    );
    if(sessionStorage.getItem('user_Name') === null) {
      this.userName = localStorage.getItem('user_Name');
    }
    else{
      this.userName = sessionStorage.getItem('user_Name');
    }
    if(this._UserDetailsService.profile_image_url.length > 0){
      this.profilePic = {'background-image' : this._UserDetailsService.profile_image_url };
    }
    else{
      this.getProfileImage();
    }
    
    this._UserDetailsService.refreshNeeded$.subscribe(
      () => {
        this.getProfileImage();
      }
    )
  }
  
  upload() {
    this.display = {'display': 'block'};
    this.UploadComp = true;
  }

  close() {
    if(sessionStorage.getItem('fileUploading') === "uploading"){
      this.ThrowMessage('Upload in progress');
    } else {
      this.UploadComp = false;
      this._UploadFileService.videoFiles  = [];
      this._UploadFileService.UploadedVideoFiles =[];
      this._UploadFileService.videoFeatures = [];
      this._UploadFileService.selectedVideoLabels = [];
      this._UploadFileService.totalPriceVideos = 0;
      this._UploadFileService.uploadVideoBtn = false;
      this._UploadFileService.imageFiles  = [];
      this._UploadFileService.UploadedImageFiles =[];
      this._UploadFileService.imageFeatures = [];
      this._UploadFileService.selectedImageLabels = [];
      this._UploadFileService.totalPriceImages = 0;
      this._UploadFileService.uploadImageBtn = false;
      if(this._UploadFileService.currentComponentImage && !this.router.url.includes('imageDetails')){
        this.router.navigate(['./home/image'])
      }
      if(this._UploadFileService.currentComponentVideo && !this.router.url.includes('videoDetails')){
        this.router.navigate(['./home/video'])
      }
      this._UploadFileService.Close();
      this.UploadComp = false;
      this.display = {'display': 'none'};
    }
  }

  CloseModal(event : any){
    if(event.target === document.getElementById('modal-wrapper')){
      this.close();
    }
  }

  getProfileImage() {
    const url = environment.API_URL_HEAD + 'render-profile-image?path=';;
    this.profileurl = '';
    this.imageLoading = true;
    this._UserDetailsService.Get_Image().subscribe(
      (data : any) => {
        if(data['image_url'].length > 0){
          if(localStorage.getItem('User_id')){
            this.profileurl = `url('${url}${data['image_url']}&user_id=${localStorage.getItem('User_id')}&file_type=profile')`;
          }
          if(sessionStorage.getItem('User_id')){
            this.profileurl = `url('${url}${data['image_url']}&user_id=${sessionStorage.getItem('User_id')}&file_type=profile')`;
          }
          this.profilePic = {'background-image' : this.profileurl };
        }
        else {
          this.profileurl = "url('/assets/images/ben-sweet-2LowviVHZ-E-unsplash.jpg')"; 
          this.profilePic = {'background-image' : this.profileurl };
        }
        this._UserDetailsService.profile_image_url = this.profileurl;
        this.imageLoading = false;
      },
      (err : HttpErrorResponse) => {
        this.imageLoading = false;
      }
    )
  }

  storeInVideoList(obj : any, isSample : boolean){
    this.videos.push({
      name : obj.original_name,
      id : obj.id,
      thumbnail : obj.thumbnail_video,
      date : obj.date,
      url_name : `${obj.name.split('/')[obj.name.split('/').length - 1]}`,
      isSample : isSample
    })
  }
  storeInImageList(obj : any, isSample : boolean){
    this.images.push({
      name : `${obj.name.split('/')[obj.name.split('/').length - 1]}`,
      id : obj.id,
      thumbnail : obj.thumbnail_image,
      date : obj.date,
      url : obj.image_url,
      isSample : isSample
    })
  }

  loadVideos(){
    this.videos = [];
    this._VideoService.GetVideo().subscribe(
      (res : any) => {
        res.video_data.forEach((videos : any) => {
          videos.videos.forEach(
            (video : any) => {
              this.storeInVideoList(video, false);
            }
          );
        });
        res.sample_video_data.forEach((video : any) => {
          this.storeInVideoList(video, true);
        });
      }
    );
  }
  
  loadImages(){
    this.images = [];
    this._ImageService.GetImages().subscribe(
      (res : any) => {
        if(res['success']){
          res.image_data.forEach((images : any) => {
            images.images.forEach(  
              (image : any) => {
                this.storeInImageList(image, false);
              }
            );
          });

          res.sample_image_data.forEach((image : any) => {
            this.storeInImageList(image, true);
          });          
        }      
      }
    );
  }

  ToggleVideo(){
    this.setImageActive = false;
  }
  ToggleImage(){
    this.setImageActive = true;
  }
  
  Search(event : any) {
    this.term = event.target.value;
    this.filteredVideos = [];
    this.filteredImages = [];
    if(this.router.url.includes('image')){
      this.setImageActive = true;
    }
    else{
      this.setImageActive = false;
    }
    if(this.term.length > 1){
      this.searchVisible = {'display': 'block'};
    }
    else{
      this.searchVisible = {'display': 'none'};
    }
    if(this.term.length > 0){
      this.videos.forEach(
        (vid : any) => {
          if(vid.name.toLowerCase().includes(this.term.toLowerCase())){
            this.filteredVideos.push(vid);
          }
        }
      );
      this.images.forEach(
        (img : any) => {
          if(img.name.toLowerCase().includes(this.term.toLowerCase())){
            this.filteredImages.push(img);
          }
        }
      );
    }
  }
  
  ToggleSearch(){
    this.loadVideos();
    this.loadImages();
  }

  closeSearch(e : any){
    if(e.target == document.getElementById('modal')) {
      this.term = ''
      this.searchVisible = {'display': 'none'};
    }    
  }
  dropdownVisible = {'display': 'none'};

  toggleDropdown(){
    this.showModals = !this.showModals;
  }


  logout() {
    this._UploadFileService.videoFiles = [];
    this._UploadFileService.UploadedVideoFiles =[];
    this._UploadFileService.videoFeatures = [];
    this._UploadFileService.selectedVideoLabels = [];
    this._UploadFileService.totalPriceVideos = 0;
    this._UploadFileService.uploadVideoBtn = false;
    this._UploadFileService.currentComponentVideo = true;
    // Image data 
    this._UploadFileService.UploadedImageFiles = [];
    this._UploadFileService.imageFiles = [];
    this._UploadFileService.imageFeatures = [];
    this._UploadFileService.selectedImageLabels = [];
    this._UploadFileService.totalPriceImages = 0;
    this._UploadFileService.uploadImageBtn = false;
    this._UploadFileService.currentComponentImage = false;
    sessionStorage.removeItem('Token');
    localStorage.removeItem('Token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('user_name');
    localStorage.removeItem('Date');
    localStorage.removeItem('imageUrl');
    localStorage.removeItem('imageID');
    localStorage.removeItem('imageName');
    localStorage.removeItem('isSample');
    localStorage.removeItem('OpenVideoTitle');
    localStorage.removeItem('OpenVideoDate');
    localStorage.removeItem('OpenVideoID');
    sessionStorage.removeItem('admin');
    localStorage.removeItem('admin');
    sessionStorage.clear();
    localStorage.clear();
    setTimeout(() => {
      this.router.navigate(['']);
    }, 500);
  }

  OpenVideo(id : number, name : string, date : string, isSample : boolean){
    localStorage.setItem('OpenVideoID', `${id}`);//stores video id to local storage
    localStorage.setItem('OpenVideoTitle', `${name}`);
    localStorage.setItem('OpenVideoDate', `${date}`);
    if(isSample){
      localStorage.setItem('isSample', 'true')
    }
    else{
      localStorage.setItem('isSample', 'false')
    }
    this._Router.navigate([`/home/videoDetails/${localStorage.getItem('OpenVideoID')}`]);
    this._Router.routeReuseStrategy.shouldReuseRoute = function () { //important reload function
      return false;
    };
  }
  OpenImage(id : number, name : string, date : string, url : string, isSample : boolean){
    localStorage.setItem('Date', `${date}`);
    localStorage.setItem('imageUrl', url);
    localStorage.setItem('imageID', `${id}`);
    localStorage.setItem('imageName', name);
    if(isSample){
      localStorage.setItem('isSample', 'true')
    }
    else{
      localStorage.setItem('isSample', 'false')
    }
    this._Router.navigate([`/home/imageDetails/${localStorage.getItem('imageID')}`]);
    this._Router.routeReuseStrategy.shouldReuseRoute = function () { //important reload function
      return false;
    };
  }


}
