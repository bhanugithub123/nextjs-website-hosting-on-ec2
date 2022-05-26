import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss']
})
export class LabelsComponent implements OnInit, OnChanges {

  @Input() features!:any;
  availableFeature:any[] = [];
  @Output() label : EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }
  
  ngOnChanges(): void {
      if(this.features){
        for(let i = 0;i < this.features.length; i++) {
          if(this.features[i].count > 0 || this.features[i].count === null){
            let label = '';
            let count = 0;
            if(this.features[i].label === "Explicit Contents"){
              if(this.features[i].count === null){
                count = 0;
                label = "Explicit Content"
              }
              else {
                count = this.features[i].count;
              }
              if(this.features[i].count === 1){
                label = "Explicit Content"
              }
              else if(this.features[i].count > 1){
                label = "Explicit Contents"
              }
            }
            if(this.features[i].label === "Label Detections"){
              if(this.features[i].count === null){
                count = 0;
                label = "Label"
              }
              else {
                count = this.features[i].count;
              }
              if(this.features[i].count === 1){
                label = "Label"
              }
              else if(this.features[i].count > 1){
                label = "Labels"
              }
            }

            if(this.features[i].label === "Shot Detections"){
              if(this.features[i].count === null){
                count = 0;
                label = "Shot"
              }
              else {
                count = this.features[i].count;
              }
              if(this.features[i].count === 1){
                label = "Shot"
              }
              else if(this.features[i].count > 1){
                label = "Shots"
              }
            }

            if(this.features[i].label === "Speech Transcription"){
              if(this.features[i].count === null){
                count = 0;
                label = "Speech"
              }
              else {
                count = this.features[i].count;
              }
              if(this.features[i].count === 1){
                label = "Speech"
              }
              else if(this.features[i].count > 1){
                label = "Speechs"
              }
            }
            if(this.features[i].label === "Object Tracking"){
              if(this.features[i].count === null){
                count = 0;
                label = "Object"
              }
              else {
                count = this.features[i].count;
              }
              if(this.features[i].count === 1){
                label = "Object"
              }
              else if(this.features[i].count > 1){
                label = "Objects"
              }
            }
            if(this.features[i].label === "Text Detections"){
              if(this.features[i].count === null){
                count = 0;
                label = "Text"
              }
              else {
                count = this.features[i].count;
              }
              if(this.features[i].count === 1){
                label = "Text"
              }
              else if(this.features[i].count > 1){
                label = "Texts"
              } 
            }

            if(this.features[i].label === "Logo Detections"){
              if(this.features[i].count === null){
                count = 0;
                label = "Logo"
              }
              else {
                count = this.features[i].count;
              }
              if(this.features[i].count === 1){
                label = "Logo"
              }
              else if(this.features[i].count > 1){
                label = "Logos"
              }              
            }

            if(this.features[i].label === "Face Detections"){
              if(this.features[i].count === null){
                count = 0;
                label = "Face"
              }
              else {
                count = this.features[i].count;
              }
              if(this.features[i].count === 1){
                label = "Face"
              }
              else if(this.features[i].count > 1){
                label = "Faces"
              }
            }

            if(this.features[i].label === "Person Detections"){
              if(this.features[i].count === null){
                count = 0;
                label = "Person"
              }
              else {
                count = this.features[i].count;
              }
              if(this.features[i].count === 1){
                label = "Person"
              }
              else if(this.features[i].count > 1){
                label = "People"
              }
            }
            this.availableFeature.push({
              label : label,
              count : count
            });
          }
        }
      }
    } 

    SwitchFeature(label : string){
      switch (label) {
        case "Explicit Content":
          this.label.emit("Explicit Contents");  
          break;
        case "Explicit Contents":
            this.label.emit("Explicit Contents");  
            break;
        case "Person":
          this.label.emit("Person Detections");  
          break;
        case "People":
          this.label.emit("Person Detections");  
          break;
        case "Faces":
          this.label.emit("Face Detections");  
          break;
        case "Face":
          this.label.emit("Face Detections");  
          break;
        case "Logos":
          this.label.emit("Logo Detections");  
          break;
        case "Logo":
          this.label.emit("Logo Detections");  
          break;
        case "Texts":
          this.label.emit("Text Detections");  
          break;
        case "Text":
          this.label.emit("Text Detections");  
          break;
        case "Objects":
          this.label.emit("Object Tracking");  
          break;
        case "Object":
          this.label.emit("Object Tracking");  
          break;
        case "Speechs":
          this.label.emit("Speech Transcription");  
          break;
        case "Speech":
          this.label.emit("Speech Transcription");  
          break;
        case "Shot":
          this.label.emit("Shot Detections");  
          break;
        case "Shots":
          this.label.emit("Shot Detections");  
          break;
        case "Label":
          this.label.emit("Label Detections");  
          break;
        case "Labels":
          this.label.emit("Label Detections");  
          break;

        default:
          break;
      }
      
    }  
  }
