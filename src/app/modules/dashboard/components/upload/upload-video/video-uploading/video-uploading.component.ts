import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'video-uploading',
  templateUrl: './video-uploading.component.html',
  styleUrls: ['./video-uploading.component.scss']
})
export class VideoUploadingComponent {

  @Input() Thumbnail !: string;
  @Input() Name !: string;
  @Input() Progress : any = {value : 0};
  @Output('Delete') delete : EventEmitter<void> = new EventEmitter<void>();
  Delete(){
    this.delete.emit();
  }

}
