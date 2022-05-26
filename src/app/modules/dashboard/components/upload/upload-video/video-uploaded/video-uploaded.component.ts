import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'video-uploaded',
  templateUrl: './video-uploaded.component.html',
  styleUrls: ['./video-uploaded.component.scss']
})
export class VideoUploadedComponent implements OnInit {

  @Input() Thumbnail !: string;
  @Input() Name !: string;
  @Input() Progress : any = {value : 0}
  constructor() { }

  ngOnInit(): void {
  }

}
