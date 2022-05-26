import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-verified',
  templateUrl: './user-verified.component.html',
  styleUrls: ['./user-verified.component.scss']
})
export class UserVerifiedComponent implements OnInit {


  status : string | null = 'true';
  constructor(private _Activatedroute : ActivatedRoute) { }

  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe(params => { 
      this.status = params.get('status'); 
    });
  }

}
