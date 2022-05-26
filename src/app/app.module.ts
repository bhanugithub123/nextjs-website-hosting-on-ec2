import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponent } from './not-found.component';
import { DragScrollModule } from 'ngx-drag-scroll';
import { HighchartsChartModule } from 'highcharts-angular';
import { TransactionStatusComponent } from './status/transaction-status/transaction-status.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    TransactionStatusComponent
  ],
  imports: [
    DragScrollModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HighchartsChartModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }