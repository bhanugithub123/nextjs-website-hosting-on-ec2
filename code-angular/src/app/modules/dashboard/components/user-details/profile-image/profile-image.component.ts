import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserDetailsService } from '../../../shared/user-details.service';


@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss']
})
export class ProfileImageComponent implements OnInit, OnChanges {

  @Output() uploadNotify : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() uploadedFile : EventEmitter<File | null> = new EventEmitter<File | null>();
  @Input() clearFile: boolean = false; 
  imageSrc = '../../../../../../assets/images/ben-sweet-2LowviVHZ-E-unsplash.jpg';
  file! : File | null;
  message = '';
  show = false;
  UserHadCustomProfileImage = false;
  imageLoading = false;
  constructor(private userDetailsService : UserDetailsService) { }

  ngOnChanges(): void {
    if(this.clearFile){
      this.file = null;
      const input = <HTMLInputElement>document.querySelector("#file1");
      input!.value = "";
      this.getProfileImage();
      if(!this.UserHadCustomProfileImage){
        this.imageSrc = '../../../../../../assets/images/ben-sweet-2LowviVHZ-E-unsplash.jpg';
      }
    }
  }

  ngOnInit(): void {
    this.getProfileImage();
    this.userDetailsService.refreshNeeded$.subscribe(
      () => {
        this.getProfileImage();
      }
    )
  }
  uploadClicked(){
    let element : HTMLElement | null = document.querySelector('#file1');
    element?.click();
  }
  onChange(event :any) { 
    this.UserHadCustomProfileImage = true;
    this.file = event.target.files[0];
    if(this.file?.type.includes('image')){
      const file1 = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e:any) => {
        this.imageSrc = e.target.result;
        this.uploadNotify.emit(true);
        this.uploadedFile.emit(this.file);
      }
      reader.readAsDataURL(file1);
    }
    else{
      this.ThrowMessage("Please upload a valid file!")
      this.file = null;
    }
    
    
  } 
  ThrowMessage(msg: string){
    this.message = msg;
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 3000);
  }
  remove() {
    this.userDetailsService.Remove_Image().subscribe(
      (data) => {
        const input = <HTMLInputElement>document.querySelector("#file1");
        input!.value = "";
        this.ThrowMessage("Profile Pic Removed Successfully!");
      },
      (err : HttpErrorResponse) => {
        if(err.error.message === "Image Does not exist."){
          this.ThrowMessage("Please Upload A Profile Image First.")
        }
        else if(err.error.non_field_errors){
          this.ThrowMessage(err.error.non_field_errors[0]);
        }
        else if(err.status === 0){
          this.ThrowMessage("Address Not Reachable.Please Try Again!")
        }
        else if(err.status === 504){
          this.ThrowMessage("Server Not Responding.Please Try Again!")
        }
        else if(err.status === 500){
          this.ThrowMessage("Internal Server Error.Please Try Again!")
        }
        else if(err.status === 400){
          this.ThrowMessage("Bad Request!")
        }
        else{
          this.ThrowMessage("Oops Something Went Wrong. Please Try Again!");
        }
      }
    )
  }
  
  getProfileImage() {
    this.imageSrc = '';
    this.imageLoading = true;
    this.userDetailsService.Get_Image().subscribe(
      (data : any) => {
        if(data['image_url'].length > 0){
          if(localStorage.getItem('User_id')){
            this.imageSrc =  environment.API_URL_HEAD + 'render-profile-image?path=' + data['image_url'] + '&user_id='+localStorage.getItem('User_id')+'&file_type=profile';
          }
          if(sessionStorage.getItem('User_id')){
            this.imageSrc =  environment.API_URL_HEAD + 'render-profile-image?path=' + data['image_url'] + '&user_id='+sessionStorage.getItem('User_id')+'&file_type=profile';
          }
          this.UserHadCustomProfileImage = true;
        }
        else {
          this.imageSrc = '../../../../../../assets/images/ben-sweet-2LowviVHZ-E-unsplash.jpg';
        }
        this.imageLoading = false;
      },
      (err : HttpErrorResponse) => {
        this.imageLoading = false;
        if(err.error.non_field_errors){
          this.ThrowMessage(err.error.non_field_errors[0]);
        }
        else if(err.status === 0){
          this.ThrowMessage("Address Not Reachable.Please Try Again!")
        }
        else if(err.status === 504){
          this.ThrowMessage("Server Not Responding.Please Try Again!")
        }
        else if(err.status === 500){
          this.ThrowMessage("Internal Server Error.Please Try Again!")
        }
        else if(err.status === 400){
          this.ThrowMessage("Bad Request!")
        }
        else{
          this.ThrowMessage("Oops Something Went Wrong. Please Try Again!");
        }
      }
    )
  }

}
