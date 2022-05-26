import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {

  constructor() { }
  @Output('date_range') date_range : EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output('reload') reload : EventEmitter<void> = new EventEmitter<void>();
  @Output() filter : EventEmitter<string> = new EventEmitter<string>();
  ngOnInit(): void {
  }
  EmitDate(event : string[]){
    this.date_range.emit(event);
  }
  onReload(){
    this.reload.emit();
  }

  Filter(name : string){
    this.filter.emit(name);
  }
}
