import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.scss']
})
export class VerifyUserComponent implements OnInit {

  constructor(
    private _Activatedroute:ActivatedRoute,
    private _AuthService : AuthService,
    private router : Router
    ) { }

  token!: string | null;
  loading = true;

  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe(params => { 
      this.token = params.get('token'); 
    });
    this._AuthService.Verify_User(this.token).subscribe(
      (data:any) => {
        this.loading = false;
        this.router.navigate(['/user/verified/true']);
      },
      (err : HttpErrorResponse) => {
        this.loading = false;
        this.router.navigate(['/user/verified/true']);
      }
    )
  }

}
