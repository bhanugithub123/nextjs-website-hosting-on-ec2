import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { UserResultService } from '../../../shared/user-result.service';


@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input('pages') pages !: number;
  @Output() changePage : EventEmitter<number> = new EventEmitter<number>();//event emitter about current page number status
  Pages : any[] = [];
  pagenumber = 1;
  constructor(
    private _UserResultService : UserResultService //reference to user result service
  ) { }

  ngOnInit(): void {
    this.changePage.emit(1);
    this._UserResultService.CurrentPageNumber = 1;
    this._UserResultService.refereshNeeded$.subscribe(
      () => {
        this.Pages = [];
        this.pagenumber = 1;
        for(let i = 0; i < this.pages; i++){
          this.Pages.push({
            pagenumber : i,
            active: false
          });
          this.Pages[0].active = true;
        }
      }
    );
  }
  ngOnChanges(): void {
    if(this.pages){
      for(let i = 0; i < this.pages; i++){
        this.Pages.push({
          pagenumber : i,
          active: false
        });
        this.Pages[0].active = true;
      }
    }
  }

  DetectPageChange(pagenumber : number){
    this.Pages.forEach(
      (page : any) => {
        page.active = false;
      }
    );
    this.Pages[pagenumber - 1].active = true;
    if(this.pagenumber != pagenumber){
      this.pagenumber = pagenumber;
      this._UserResultService.CurrentPageNumber = pagenumber;
      this.changePage.emit(pagenumber);
    }
  }

  JumpToPage(){
    const element: any = <HTMLElement>document.querySelector("#page-input");
    element.value = '';
    if(this.Pages[this.pagenumber - 1]){
      if(this.pagenumber <= this.pages + 1){
        this.Pages.forEach(
          (page : any) => {
            page.active = false;
          }
        );
        this.Pages[this.pagenumber - 1].active = true;
        this._UserResultService.CurrentPageNumber = this.pagenumber;
        this.changePage.emit(this.pagenumber);
      }
    }
  }

  setPageNumber(event : any){
    if(event.target.value.length < 1){
      event.target.value = '';
    }
    this.pagenumber = parseInt(event.target.value);
    if(this.pagenumber === NaN){
      this.pagenumber = 1;
    }
  }

}
