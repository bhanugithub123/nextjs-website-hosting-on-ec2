import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDetailsService } from '../../shared/user-details.service';

@Component({
  selector: 'app-deleted',
  templateUrl: './deleted.component.html',
  styleUrls: ['./deleted.component.scss']
})
export class DeletedComponent implements OnInit, AfterViewChecked {

  @ViewChild('video') video!: ElementRef;
  @ViewChild('image') image!: ElementRef;

  setImageActive = false;

  constructor(
    private _Router : Router,
    private _ActivateRoute : ActivatedRoute,
    private cdRef:ChangeDetectorRef,
    private _UserDetailsService : UserDetailsService
    ) {}

  ngOnInit(): void {
    this._UserDetailsService.setShowUpload$();
  }

  setVideoVisibilty() {
    this.video.nativeElement.classList.add('active');
    this.image.nativeElement.classList.remove('active');
    this.setImageActive = false;
  }

  routeToImage() {
    this.image.nativeElement.classList.add('active');
    this.video.nativeElement.classList.remove('active');
    this.setImageActive = true;
  }

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    if(this._ActivateRoute.snapshot.url.join('') === '' && this._Router.url === '/deleted'){
      this.image.nativeElement.classList.add('active');
      this.video.nativeElement.classList.remove('active');
    }
    if(this._ActivateRoute.snapshot.url.join('') === '' && this._Router.url === '/deleted/images'){
      this.video.nativeElement.classList.add('active');
      this.image.nativeElement.classList.remove('active');
    }
  }
  
  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }

}
