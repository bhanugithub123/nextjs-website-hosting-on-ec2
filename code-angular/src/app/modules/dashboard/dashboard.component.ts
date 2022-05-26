import { Component, OnInit } from '@angular/core';
import { ToggleAlertService } from './shared/toggle-alert.service';
import * as Amqp from "amqplib/callback_api";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  message = '';
  show = false;
  constructor(private _ToggleAlert : ToggleAlertService) { }

  ngOnInit(): void {
    // this.recieve();
    this._ToggleAlert.IsAlerted().subscribe((msg : any)=>{//Toggle Alert
      this.message = msg[0];
      this.show = true;
      setTimeout(() => {
        this.show = false;
      }, 3000);
    }
    );
  }
}
