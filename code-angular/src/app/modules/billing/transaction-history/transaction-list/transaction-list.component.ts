import { Component, Input } from '@angular/core';

@Component({
  selector: 'transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent {

  @Input() data !: any[];
  @Input() data_loaded: boolean = false;
  @Input() filter: string = '';

  constructor() { }

}
