import { Component, OnInit } from '@angular/core';
import { ToggleAlertService } from '../dashboard/shared/toggle-alert.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

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
    }
    );
  }

}
