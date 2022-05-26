import { HttpErrorResponse } from '@angular/common/http';
import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadFileService } from 'src/app/modules/dashboard/shared/upload/upload-file.service';
import { UserDetailsService } from 'src/app/modules/dashboard/shared/user-details.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'billing-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  profileurl: string="url('/assets/images/ben-sweet-2LowviVHZ-E-unsplash.jpg')";
  profilePic = {'background-image' : this.profileurl };
  userName !:string | null;
  showSearchInput = true;
  innerWidth! : number;
  minWidth = '0';
  showModals = false;
  // imageLoading = false;
  constructor(private _Router : Router, private _UploadFileService : UploadFileService,private _UserDetailsService:UserDetailsService) { }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth < 989){
      this.minWidth = '1095px';
    }
  }
  ngOnInit(): void {
    if(sessionStorage.getItem('user_Name') === null) {
      this.userName = localStorage.getItem('user_Name');
    }
    else{
      this.userName = sessionStorage.getItem('user_Name');
    }
    this.innerWidth = window.innerWidth;
    if(this.innerWidth < 989){
      this.minWidth = '1095px';
    }
    if(this._Router.url.includes('user-details')){
      this.showSearchInput = true;
    }
    else{
      this.showSearchInput = false;
    }
    this._Router.events.subscribe(
      () => {
        if(this._Router.url.includes('user-details')){
          this.showSearchInput = true;
        }
        else{
          this.showSearchInput = false;
        }
      }
    );
    if(this._UserDetailsService.profile_image_url.length > 0){
      this.profilePic = {'background-image' : this._UserDetailsService.profile_image_url };
    }
    else{
      this.getProfileImage();
    }
  }
  getProfileImage() {
    this.profileurl = '';
    const url = environment.API_URL_HEAD + 'render-profile-image?path=';
    // this.imageLoading = true;
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
          this.profileurl = "url('assets/images/ben-sweet-2LowviVHZ-E-unsplash.jpg')"; 
          this.profilePic = {'background-image' : this.profileurl };
        }
        this._UserDetailsService.profile_image_url = this.profileurl;
        // this.imageLoading = false;
      },
      (err : HttpErrorResponse) => {
        // this.imageLoading = false;
      }
    )
  }
  ToggleMenu(){
    this.showModals = !this.showModals;
  }

  logout() {
    this._UploadFileService.videoFiles = [];
    this._UploadFileService.videoFeatures = [];
    this._UploadFileService.selectedVideoLabels = [];
    this._UploadFileService.totalPriceVideos = 0;
    this._UploadFileService.uploadVideoBtn = false;
    this._UploadFileService.currentComponentVideo = true;
    // Image data 
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
      this._Router.navigate(['']);
    }, 500);
  }
}
