import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() sample!:boolean;
  @ViewChild('sampleDiv') sampleDiv!:ElementRef;

  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges(): void {
  }
  ngAfterViewInit(): void {
    if(this.sample){
      this.sampleDiv.nativeElement.classList.add('bigger');
    } 
  }

}
