import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingComponent } from './billing.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { FilterBarComponent } from './transaction-history/filter-bar/filter-bar.component';
import { FilterDropdownComponent } from './transaction-history/filter-bar/filter-dropdown/filter-dropdown.component';
import { FilterdateRangeComponent } from './transaction-history/filter-bar/filterdate-range/filterdate-range.component';
import { TransactionListComponent } from './transaction-history/transaction-list/transaction-list.component';
import { TransactionCardComponent } from './transaction-history/transaction-list/transaction-card/transaction-card.component';
import { TransactionCardModalComponent } from './transaction-history/transaction-list/transaction-card/transaction-card-modal/transaction-card-modal.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RouterModule, Routes } from '@angular/router';
import { SidebarModule } from 'ng-sidebar';
import { ModalCardsComponent } from './transaction-history/transaction-list/transaction-card/transaction-card-modal/modal-cards/modal-cards.component';
import { StorageDetailsComponent } from './storage-details/storage-details.component';
import { StorageCardsListComponent } from './storage-details/storage-cards-list/storage-cards-list.component';
import { StorageCardComponent } from './storage-details/storage-cards-list/storage-card/storage-card.component';
import { CommonStorageDetailsComponent } from './common-storage-details/common-storage-details.component';
import { AmountAvailableComponent } from './transaction-history/amount-available/amount-available.component';
import { StorageDetailsModalComponent } from './common-storage-details/storage-details-modal/storage-details-modal.component';
const routes : Routes = [
  {
    path: '', component: BillingComponent,
    children: [
      {
        path: 'transactions', component: TransactionHistoryComponent
      },
      {
        path: 'storage', component: StorageDetailsComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    BillingComponent, 
    TransactionHistoryComponent, 
    FilterBarComponent, 
    FilterDropdownComponent, 
    FilterdateRangeComponent, 
    TransactionListComponent, 
    TransactionCardComponent, 
    TransactionCardModalComponent, 
    HeaderComponent, 
    SidebarComponent, 
    ModalCardsComponent,
    StorageDetailsComponent,
    StorageCardsListComponent,
    StorageCardComponent,
    CommonStorageDetailsComponent,
    AmountAvailableComponent,
    StorageDetailsModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SidebarModule.forRoot()
  ]
})
export class BillingModule { }
