import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'image-uploading',
  templateUrl: './image-uploading.component.html',
  styleUrls: ['./image-uploading.component.scss']
})
export class ImageUploadingComponent implements OnInit {

  @Input() Thumbnail !: string;
  @Input() Name !: string;
  @Input() Progress : any = {value : 0};
  @Output('Delete') delete : EventEmitter<void> = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {}

  Delete(){
    this.delete.emit();
  }

}
