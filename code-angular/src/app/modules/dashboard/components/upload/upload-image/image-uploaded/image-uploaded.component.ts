import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'image-uploaded',
  templateUrl: './image-uploaded.component.html',
  styleUrls: ['./image-uploaded.component.scss']
})
export class ImageUploadedComponent implements OnInit {

  @Input() Thumbnail !: string;
  @Input() Name !: string;
  @Input() Progress : any = {value : 0};
  constructor() { }

  ngOnInit(): void {}

}
