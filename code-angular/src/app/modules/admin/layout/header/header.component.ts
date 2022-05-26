import { HostListener,Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadFileService } from 'src/app/modules/dashboard/shared/upload/upload-file.service';
import { UserResultService } from '../../shared/user-result.service';

@Component({
  selector: 'admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  profileurl: string="url('/assets/images/ben-sweet-2LowviVHZ-E-unsplash.jpg')";
  userName !:string | null;
  showSearchInput = true;
  innerWidth! : number;
  minWidth = '0';
  showModals = false;
  constructor(private _Router : Router, private _UserResultService : UserResultService,private _UploadFileService : UploadFileService) { }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth < 989){
      this.minWidth = '1095px';
    }
  }
  ngOnInit(): void {
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

    if(sessionStorage.getItem('user_Name') === null) {
      this.userName = localStorage.getItem('user_Name');
    }
    else{
      this.userName = sessionStorage.getItem('user_Name');
    }
  }

  onSearchInput(event : any){
    this._UserResultService.onSearchInput(event.target.value);
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
