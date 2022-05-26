import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaction-status',
  templateUrl: './transaction-status.component.html',
  styleUrls: ['./transaction-status.component.scss']
})
export class TransactionStatusComponent implements OnInit {

  status : string | null = 'true';
  token : string | null = '';
  constructor(private _Activatedroute : ActivatedRoute) { }

  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe(params => { 
      this.status = params.get('status'); 
      this.token = params.get('token'); 
    });
  }

}
