import { Component, OnInit } from '@angular/core';
import { ToggleAlertService } from '../dashboard/shared/toggle-alert.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  message = '';
  show = false;
  constructor(private _ToggleAlert : ToggleAlertService) { }

  ngOnInit(): void {
    this._ToggleAlert.IsAlerted().subscribe((msg : any)=>{//Toggle Alert
      this.message = msg[0];
      this.show = true;
      setTimeout(() => {
        this.show = false;
      }, 3000);
    });
  }

}
