import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';
import { GlobalResultService } from '../../shared/global-result.service';

@Component({
  selector: 'profit-loss-chart',
  templateUrl: './profit-loss-chart.component.html',
  styleUrls: ['./profit-loss-chart.component.scss']
})
export class ProfitLossChartComponent implements OnInit, AfterViewInit {
  chartOptions = {};
  Highcharts = Highcharts;
  Amount = [0, 0, 0, 0, 0];
  Years : string[] = [];
  ReqMonth = 0;
  Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
  @ViewChild('month') month !: ElementRef;
  @ViewChild('year') year !: ElementRef;
  constructor(
    private _GlobalResultService : GlobalResultService,//reference to global result service
    private _ToggleAlert : ToggleAlertService// reference to toggle alert service
  ) { }

  ngOnInit(): void {
    let [month, date, year]    = new Date().toLocaleDateString("en-US").split("/");
    if(parseInt(month) < 10){
      month = '0' + month;
    }
    for(let i = 21 ; i < 70; i++){
      this.Years.push(`20${i}`)
      if(`20${i}` === `${year}`){
        break;
      }
    }
    this.ReqMonth = parseInt(month);
    this.LoadChart(year, month);
    this.CreateChart();
  }
  ngAfterViewInit(): void {
    let [month, date, year]    = new Date().toLocaleDateString("en-US").split("/");
    this.month.nativeElement.selectedIndex = parseInt(month) - 1;//by default selected option is current month
    this.year.nativeElement.selectedIndex = parseInt(year) - 2021;//by default selected option is current year
    
  }

  onDateChange(){
    const year = `${this.year.nativeElement.value}`;
    let month = '';
    if(this.month.nativeElement.value < 10){
      month = `0${this.month.nativeElement.value}`;
    }
    else{
      month = `${this.month.nativeElement.value}`;
    }
    this.LoadChart(year, month);
  }
  
  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }

  CreateChart() {
    this.chartOptions =  {
      chart: {
        type: 'column'
      },
      title: {
        style: {
          "color": '#B4B4B4',
          font: '15px "Open Sans", sans-serif'
        },
        text: '',
        align: 'left',
        x: 24
      },
      yAxis: {
        labels: {
            format: '{value} $' // The $ is literally a dollar unit
        },
        title: {
            text: ''
        }
      },
      tooltip: {
        shared : true,
        useHTML: true,
        headerFormat: '<table>',
        pointFormat: '<tr>' +
        '<td style="text-align: right"><b>{point.y} $</b></td></tr>',
        footerFormat: '</table>',
        valueDecimals: 2        
      },
      legend: {
        enabled: false
      },
      xAxis: {
        categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
      },
      credits: {
        enabled: false
      },
      series: [{
        name: '',
        data: this.Amount,
        zonesAxis: 'y',
        zones: [
          {
            value: 0,
            color: '#ff4948',
          },
          {
            color: '#5be551',
          }
        ]
      }]
    }
  }

  LoadChart(year : string, month : string){
    this._GlobalResultService.GetChartInfo(year, month).subscribe(
      (res : any) => {
        if(res.success){
          if(res.amount[0]){
            this.Amount[0] = res.amount[0].week1_amount;
            this.Amount[1] = res.amount[0].week2_amount;
            this.Amount[2] = res.amount[0].week3_amount;
            this.Amount[3] = res.amount[0].week4_amount;
            this.Amount[4] = res.amount[0].week5_amount;
          }
          else{
            this.Amount[0] = 0;
            this.Amount[1] = 0;
            this.Amount[2] = 0;
            this.Amount[3] = 0;
            this.Amount[4] = 0;
          }
          this.CreateChart();
        }
      },
      (err : HttpErrorResponse) => {
        if(err.error.non_field_errors){
          this.ThrowErrorMessage(err.error.non_field_errors[0]);
        }
        else if(err.status === 0){
          this.ThrowErrorMessage("Address Not Reachable.Please Try Again!")
        }
        else if(err.status === 504){
          this.ThrowErrorMessage("Server Not Responding.Please Try Again!")
        }
        else if(err.status === 500){
          this.ThrowErrorMessage("Internal Server Error.Please Try Again!")
        }
        else if(err.status === 400){
          this.ThrowErrorMessage("Bad Request!")
        }
        else{
          this.ThrowErrorMessage("Oops Something Went Wrong. Please Try Again!");
        };
      }
    );
  }

}
