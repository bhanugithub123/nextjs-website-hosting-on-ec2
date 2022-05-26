import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.scss']
})
export class FilterDropdownComponent implements OnInit {

  dropdownList = ["All", "Storage buyed", "Amount added", "Videos", "Images"];
  selectedFilterName = "All";
  showDropDownMenu = false;
  @Output() dropdown_filter : EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  ToggleDropDown(){
    this.showDropDownMenu = !this.showDropDownMenu;
  }
  setName(name : string) {
    this.selectedFilterName = name;
    this.dropdown_filter.emit(name);
    this.showDropDownMenu = false;
  }

}
