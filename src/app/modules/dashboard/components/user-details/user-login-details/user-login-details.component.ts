import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-login-details',
  templateUrl: './user-login-details.component.html',
  styleUrls: ['./user-login-details.component.scss']
})
export class UserLoginDetailsComponent implements OnInit {

  userDetailsForm!: FormGroup;
  LastNamePresent = false;

  constructor() { }

  ngOnInit(): void {
    this.createForm();
    var nameArray: any
    if(sessionStorage.getItem('user_Name') === null) {
      nameArray = localStorage.getItem('user_Name')?.split(" ");
      if(nameArray.length > 1){
        this.LastNamePresent = true;
      }
      this.userDetailsForm.patchValue({
        firstname : nameArray[0],
        lastname : nameArray[1],
        email : localStorage.getItem('email')
      })
    }
    else {
      nameArray = sessionStorage.getItem('user_Name')?.split(" ");
      if(nameArray.length > 1){
        this.LastNamePresent = true;
      }
      this.userDetailsForm.patchValue({
        firstname : nameArray[0],
        lastname : nameArray[1],
        email : sessionStorage.getItem('email')
      })
    }
    
    
  }

  get firstname() {
    return this.userDetailsForm.get('firstname')
  }
  get lastname() {
    return this.userDetailsForm.get('lastname')
  }
  get email() {
    return this.userDetailsForm.get('email')
  }

  createForm() {
    this.userDetailsForm = new FormGroup({
      firstname : new FormControl({value: '', disabled: true}, Validators.required),
      lastname : new FormControl({value: '', disabled: true}, Validators.required),
      email : new FormControl({value: '', disabled: true}, Validators.required)
    })
  }
}
