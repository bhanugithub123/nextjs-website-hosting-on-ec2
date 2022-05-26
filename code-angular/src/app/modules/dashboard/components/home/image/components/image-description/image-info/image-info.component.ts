import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ImageService } from 'src/app/modules/dashboard/shared/image/image.service';
import { ToggleAlertService } from 'src/app/modules/dashboard/shared/toggle-alert.service';
@Component({
  selector: 'app-image-info',
  templateUrl: './image-info.component.html',
  styleUrls: ['./image-info.component.scss']
})
export class ImageInfoComponent implements OnChanges, AfterViewInit {

  @Input('imageData') imageData: any;//iput image response from description component
  @Input('imageName') imageName: any;//input image name from description component
  @Output() feature : EventEmitter<string> = new EventEmitter<string>(); //output current selected feature to description component
  @Output() label : EventEmitter<number> = new EventEmitter<number>();//output label id to description component
  @Output() face : EventEmitter<number> = new EventEmitter<number>();//output face id to description component
  @Output() object : EventEmitter<number> = new EventEmitter<number>();//output object id to description component
  @Output() landmark : EventEmitter<number> = new EventEmitter<number>();//output landmark id to description component
  @Output() logo : EventEmitter<number> = new EventEmitter<number>();//output logo id to description component
  ExplicitContent : any = [];//store explicit content response
  landMarks : any = [];//store landmark response
  imageProperty : any = [];//store image imageproperty response
  labelDetects : any = [];//store label response
  objectDetects : any = [];//store onjects detected
  logoDetects : any = [];//store logo detected
  textDetects : any = [];//store text detected
  webDetects : any = [];//store web info detected
  Display = 'none';//store css of modal
  showModal = false;// boolean to toggle modal
  EnableFeature = '';//store feature that requires to be enabled
  @Input('available_Features') available_Features: any[] = [];// stores selected features
  @Input('not_available_Features') not_available_Features: any[] = [];//stores not selected features
  identicalUrls : any[] = [];// store identical urls
  PageUrls : any[] = [];//store page urls
  SimilarImageUrls: any[] = [];//store similar image urls
  PartialMatchingUrls : any[] = [];//store partial matching image url;
  FaceContent : any [] = [];// store features of face
  currentImageName = ''; // name of the image
  currentImageFormat = ''; // type of image
  bestGuessLabel = '';//store best gues label value from web detection
  loadSpinner = true;//boolean for spinner
  currentColor = '';//store active color hex and rbg value
  prevIndex = -1;//store previndex for active web label
  prevColorIndex = 0;//store previndex for active color label
  currentConfidence = '';// store active web confidence value
  showWebDetectsConfidence = false;// boolean for active web confidence value
  prevObjectIndex = -1;//index to previous active object
  prevFaceIndex = -1;//index to previous active face
  prevLandmarkIndex = -1;//index to previous active landmark
  currentLogoConfidence = '';//store value of active logo confidence
  prevLogoIndex = -1;//stores index to previous active logo
  currentObjectConfidence = '';//store active object confidence value
  currentLabelConfidence = '';//store value of active label confidence
  currentTopicality = '';//store value to active label topicality
  prevLabelIndex = -1;//stores index to previous active label
  prevTextIndex = -1;//store index to previous active text
  currentLandConfidence = '';//stores active landmark confidence value
  currentLatitude = '';//stores active value of latitude of landmark
  currentLongitude = '';//stores active value of latitude of landmark
  currentColorConfidence = '';//store active color property confidence
  currentColorFraction = '';//store active color property fraction
  features = [
    {
      label: 'Web Detection',
      switch : false,
      count: '00',
      feature:'web_detection',
      processing : false,
      price : 0.1
    },
    {
      label: 'Logo Detection',
      switch : false,
      count: '00',
      feature:'logo_detection',
      processing : false,
      price : 0.1
    },
    {
      label: 'Text',
      switch : false,
      count: '00',
      feature:'text_detection',
      processing : false,
      price : 0.1
    },
    {
      label: 'Objects',
      switch : false,
      count: '00',
      feature:'object_localization',
      processing : false,
      price : 0.1
    },
    {
      label: 'Label Detection',
      switch : false,
      count: '00',
      feature:'label_detection',
      processing : false,
      price : 0.1
    },
    {
      label: 'Face',
      switch : false,
      count: '00',
      feature:'facial_detection',
      processing : false,
      price : 0.1
    },
    {
      label: 'Image Properties',
      switch : false,
      count: '00',
      feature:'image_properties',
      processing : false,
      price : 0.1
    },
    {
      label: 'Explicit Contents',
      switch : false,
      count: '00',
      feature:'safe_search_detection',
      processing : false,
      price : 0.1
    },
    {
      label: 'Landmarks',
      switch : false,
      count: '00',
      feature:'landmark_detection',
      processing : false,
      price : 0.1
    }
  ]
  toggleOn_Off = [
    {
      element : 'Web',
      switch : false
    },
    {
      element : 'Logo',
      switch : false
    },
    {
      element : 'Text',
      switch : false
    },
    {
      element : 'Landmarks',
      switch : false
    },
    {
      element : 'Explicit',
      switch : false
    },
    {
      element : 'Image',
      switch : false
    },
    {
      element : 'Face',
      switch : false
    },
    {
      element : 'Label',
      switch : false
    },
    {
      element : 'Objects',
      switch : false
    }
  ];
  
  constructor(
    private ImageService : ImageService,//reference to image service
    private _ToggleAlert: ToggleAlertService// reference to alert service
  ) { }

  ThrowSuccessMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, false);
  }
  ThrowErrorMessage(msg : string){
    this._ToggleAlert.ToggleAlert$(msg, true);
  }
  
  ToggleWebLabel(index : number){
    this.showWebDetectsConfidence = true;
    this.currentConfidence = Math.floor(this.webDetects[index].score*100) + '%';
    if(this.prevIndex != index){
      if(this.prevIndex != -1){
        this.webDetects[this.prevIndex].active = false;
      }
      this.webDetects[index].active = true;
      this.prevIndex = index;      
    }
  }
  
  ToggleLabel(index : number){
    this.currentLabelConfidence = this.labelDetects[index].score;
      this.currentTopicality = this.labelDetects[index].topicality;
      if(this.prevLabelIndex != index){
        if(this.prevLabelIndex != -1){
          this.labelDetects[this.prevLabelIndex].active = false;
        }
        this.labelDetects[index].active = true;
        this.prevLabelIndex = index;      
      }
  }

  ToggleLogo(index : number){
    this.logo.emit(index);
    this.currentLogoConfidence = Math.floor(this.logoDetects[index].score*100) + '%';
      if(this.prevLogoIndex != index){
        if(this.prevLogoIndex != -1){
          this.logoDetects[this.prevLogoIndex].active = false;
        }
        this.logoDetects[index].active = true;
        this.prevLogoIndex = index;
      }  
  }

  ToggleLogoOff(){
    this.logo.emit(-1);
  }

  CheckLikelihood(likelihood : string){
    if(likelihood === 'UNKNOWN'){
      return 0;
    }
    if(likelihood === 'VERY_UNLIKELY'){
      return 20;
    }
    if(likelihood === 'UNLIKELY'){
      return 40;
    }
    if(likelihood === 'POSSIBLE'){
      return 60;
    }
    if(likelihood === 'LIKELY'){
      return 80;
    }
    if(likelihood === 'VERY_LIKELY'){
      return 100;
    }
    else{
      return 0;
    }
  }

  componentToHex(c : any) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  ColorRGBtoHEX(color : any){
    return "#" + this.componentToHex(color.red) + this.componentToHex(color.green) + this.componentToHex(color.blue);
  }
  
  ToggleColor(index : number){
    this.currentColor = this.imageProperty[index].color + ', RGB(' + this.imageProperty[index].colorRGB + ')';
    this.currentColorConfidence = this.imageProperty[index].score;
    this.currentColorFraction = this.imageProperty[index].pixel_fraction;
    if(this.prevColorIndex != index){
      if(this.prevColorIndex != -1){
        this.imageProperty[this.prevColorIndex].active = false;
      }
      this.imageProperty[index].active = true;
      this.prevColorIndex = index;
    }    
  }
  openImage(ev : any){
    // ev.preventDefault();
  }
  setResponses(){
    if(this.imageData){
       //Web detection
      if(this.imageData.web_detection){
        if(this.imageData.web_detection.length > 0){
          let flag = false;
          let count = 0;
          let idx = 0;
          this.available_Features.forEach(
            (element : any, i : number) => {
              if(element.label === 'Web Detection') {
                if(this.imageData.web_detection[0].web_entities.length > 0){
                  if(this.imageData.web_detection[0].message){
                    this.available_Features[i].count = '0';
                  }
                  else{
                    flag = true;
                    if(this.imageData.web_detection[0].web_entities){
                      count += this.imageData.web_detection[0].web_entities.length;
                      if(this.imageData.web_detection[0].full_matching_images){
                        count += this.imageData.web_detection[0].full_matching_images.length;
                        if(this.imageData.web_detection[0].pages_with_matching_images){
                          count += this.imageData.web_detection[0].pages_with_matching_images.length;
                          if(this.imageData.web_detection[0].visually_similar_images){
                            count += this.imageData.web_detection[0].visually_similar_images.length;
                            if(this.imageData.web_detection[0].partial_matching_urls){
                              count += this.imageData.web_detection[0].partial_matching_urls;
                            }
                          }
                        }
                      }
                    }
                    idx = i;
                  }
                }
                this.available_Features[i].processing = false;                
              }          
            }
          )
          if(flag){
            this.bestGuessLabel = this.imageData.web_detection[0].best_guess_labels[0].Label;
            this.imageData.web_detection[0].web_entities.forEach(
              (element : any, i: number) => {
                if(element.Description.length > 0){
                  this.webDetects.push({
                    key : i,
                    label : element.Description,
                    score : element.Score.toFixed(2) > 1 ? 1 : element.Score.toFixed(2),
                    active : false
                  });
                } else {
                  count--;
                }       
              }
            );
            if(count < 10){
              this.available_Features[idx].count = `0${count}`;
            }
            else{
              this.available_Features[idx].count = `${count}`;
            }
            if(this.imageData.web_detection[0].full_matching_images){
              this.imageData.web_detection[0].full_matching_images.forEach(
                (url : any) => {
                  this.identicalUrls.push(url['Image Url']);
                }
              );
            }
            if(this.imageData.web_detection[0].pages_with_matching_images){
              this.imageData.web_detection[0].pages_with_matching_images.forEach(
                (url : any) => {
                  this.PageUrls.push(url['Image Url']);
                }
              );
            }
            if(this.imageData.web_detection[0].visually_similar_images){
              this.imageData.web_detection[0].visually_similar_images.forEach(
                (url : any) => {
                  this.SimilarImageUrls.push(url['Image Url']);
                }
              );
            }
            if(this.imageData.web_detection[0].partial_matching_urls){
              this.imageData.web_detection[0].partial_matching_urls.forEach(
                (url : any) => {
                  this.PartialMatchingUrls.push(url['Image Url']);
                }
              );
            }
          }
        }
      }
      //logo detection
      if(this.imageData.logo_detection){
        if(this.imageData.logo_detection.length > 0){
          let flag = false;
          let count = 0;
          let idx = 0;
          this.available_Features.forEach(
            (element : any, i : number) => {
              if(element.label === 'Logo Detection') {
                if(this.imageData.logo_detection.length > 0){
                  if(this.imageData.logo_detection[0].message){
                    this.available_Features[i].count = '0';
                  }
                  else{
                    flag = true;
                    idx = i;
                    
                  }
                }
                this.available_Features[i].processing = false;
              }
            }
          )
          if(flag){
            this.imageData.logo_detection.forEach(
              (element : any, i: number) => {
                if(element.description.length > 0){
                  this.logoDetects.push({
                    key : i,
                    label : element.description,
                    score: element.score
                  });
                } else {
                  count += 1;
                }
            });
            if(this.imageData.logo_detection.length - count < 10) {
              this.available_Features[idx].count = `0${this.imageData.logo_detection.length - count}`;
            }
            else {
              this.available_Features[idx].count = `${this.imageData.logo_detection.length - count}`;
            }
          }
        }
      }
      //text detection
      if(this.imageData.text_detection){
        if(this.imageData.text_detection.length > 0){
          let flag = false;
          let count = 0;
          let idx = 0;
          this.available_Features.forEach(
            (element : any, i : number) => {
              if(element.label === 'Text') {
                if(this.imageData.text_detection.length > 0){
                  if(this.imageData.text_detection[0].message){
                    this.available_Features[i].count = '0';
                  }
                  else{
                    flag = true;
                    idx=i;
                  }
                }
                this.available_Features[idx].processing = false;
              }
            }
          );
          if(flag){
            this.imageData.text_detection.forEach(
              (element : any, i: number) => {
                if(element.description){
                  if(element.description.length > 0){
                    this.textDetects.push({
                      key : i,
                      label : element.description,
                      active : false
                    })
                  } else {
                    count++;
                  }
                }
              }
            );
            if(this.imageData.text_detection.length - count < 10) {
              this.available_Features[idx].count = `0${this.imageData.text_detection.length - count}`;
            }
            else {
              this.available_Features[idx].count = `${this.imageData.text_detection.length - count}`;
            }
          }
        }
      }
      //Object detection
      if(this.imageData.object_localization){
        if(this.imageData.object_localization.length > 0){
          let flag = false;
          let count = 0;
          let idx = 0;
        this.available_Features.forEach(
          (element : any, i : number) => {
            if(element.label === 'Objects') {
              if(this.imageData.object_localization.length > 0){
                if(this.imageData.object_localization[0].message){
                  this.available_Features[i].count = '0';
                }
                else{
                  flag = true;
                  idx=i;
                }
              }
              this.available_Features[i].processing = false;
            }          
          }
        )
        if(flag){
          this.imageData.object_localization.forEach(
            (element : any, i: number) => {
              if(element.object_name.length > 0){
                this.objectDetects.push({
                  key : i,
                  label : element.object_name,
                  score : Math.floor(element.object_score*100) + '%',
                  active : false
                })
              } else {
                count++;
              }
            }
          );
          if(this.imageData.object_localization.length - count < 10) {
            this.available_Features[idx].count = `0${this.imageData.object_localization.length - count}`;
          }
          else {
            this.available_Features[idx].count = `${this.imageData.object_localization.length - count}`;
          }
        }
        }
      }
      //label detection
      if(this.imageData.label_detection){
        if(this.imageData.label_detection.length > 0){
          let count = 0;
          let idx = 0;
          this.available_Features.forEach(
            (element : any, i : number) => {
              if(element.label === 'Label Detection') {
                idx = i;
                this.available_Features[i].processing = false;
              }          
            }
          );
          this.imageData.label_detection.forEach(
            (element : any, i: number) => {
              if(element.description.length > 0){
                this.labelDetects.push({
                  key : i,
                  label : element.description,
                  score : Math.floor(element.score * 100) + '%',
                  topicality : Math.floor(element.topicality * 100) + '%',
                  active : false
                });
              } else {
                count++;
              }
            }
          );
          if(this.imageData.label_detection.length - count < 10) {

            this.available_Features[idx].count = `0${this.imageData.label_detection.length - count}`;
          }
          else {
            this.available_Features[idx].count = `${this.imageData.label_detection.length - count}`;
          }
        }
      }
      //facial detection
      if(this.imageData.facial_detection){
        if(this.imageData.facial_detection.length > 0){
          let flag = false;
          this.available_Features.forEach(
            (element : any, i : number) => {
              if(element.label === 'Face'){
                if(this.imageData.facial_detection.length > 0){
                  if(this.imageData.facial_detection[0].message){
                    this.available_Features[i].count = '0';
                  }
                  else{
                    flag = true;
                    if(this.imageData.facial_detection.length < 10) {
                      this.available_Features[i].count = `0${this.imageData.facial_detection.length}`;
                    }
                    else {
                      this.available_Features[i].count = `${this.imageData.facial_detection.length}`;
                    }
                  }
                }
                this.available_Features[i].processing = false;
              }
            }
          )
          if(flag){
            this.imageData.facial_detection.forEach(
              (face : any, i: number) => {
                this.FaceContent.push({
                  key: i,
                  anger : this.CheckLikelihood(face.anger_likelihood) + '%',
                  blurred : this.CheckLikelihood(face.blurred_likelihood) + '%',
                  head_wear : this.CheckLikelihood(face.headwear_likelihood) + '%',
                  sorrow : this.CheckLikelihood(face.sorrow_likelihood) + '%',
                  surprise : this.CheckLikelihood(face.surprise_likelihood) + '%',
                  joy : this.CheckLikelihood(face['joy_likelihood.name']) + '%',
                  under_exposed : this.CheckLikelihood(face.under_exposed_likelihood) + '%',
                  detection_confidence : Math.floor(face.detection_confidence*100) + '%',
                  landmarking_confidence : this.CheckLikelihood(face.landmarking_confidence) + '%',
                  pan_angle : face.pan_angle.toFixed(2),
                  roll_angle : face.roll_angle.toFixed(2),
                  tilt_angle : face.tilt_angle.toFixed(2),
                  active : false
                })
              }
            );
          }
        }
      }
      //Image Properties
      if(this.imageData.image_properties){
        if(this.imageData.image_properties.length > 0){
          let flag = false;
          this.available_Features.forEach(
            (element : any, i : number) => {
              if(element.label === 'Image Properties') {
                if(this.imageData.image_properties.length > 0){
                  if(this.imageData.image_properties[0].message){
                    this.available_Features[i].count = '0';
                  }
                  else{
                    flag = true;
                    if(this.imageData.image_properties.length < 10) {
                      this.available_Features[i].count = `0${this.imageData.image_properties.length}`;
                    }
                    else {
                      this.available_Features[i].count = `${this.imageData.image_properties.length}`;
                    }
                  }
                }
                this.available_Features[i].processing = false;
              }          
            }
          )
          if(flag){
            this.imageData.image_properties.forEach(
              (element : any, i: number) => {
                if(element.color[0]){
                  this.imageProperty.push({
                    key : i,
                    color : this.ColorRGBtoHEX(element.color[0]),
                    active: false,
                    colorRGB: element.color[0].red + ',' + element.color[0].green + ',' +element.color[0].blue,
                    score: Math.floor(element.score * 100) + '%',
                    pixel_fraction : Math.floor(element.pixel_fraction * 100) + '%'
                  })
                }                
              }
            );
            this.currentColorConfidence = this.imageProperty[0].score;
            this.currentColorFraction = this.imageProperty[0].pixel_fraction;
            this.imageProperty[0].active = true;
          }
        }
      }
      //Explicit Content
      if(this.imageData.safe_search_detection){
        if(this.imageData.safe_search_detection.length > 0){
          const len = Object.keys(this.imageData.safe_search_detection[0]).length;
          this.available_Features.forEach(
            (element : any, i : number) => {
              if(element.label === 'Explicit Contents') {
                if(len < 10) {
                  this.available_Features[i].count = `0${len}`;
                }
                else {
                  this.available_Features[i].count = `${len}`;
                }
                this.available_Features[i].processing = false;
              }  
                      
            }
          )
          this.ExplicitContent.push({
            adult : this.CheckLikelihood(this.imageData.safe_search_detection[0]['adult']) + '%',
            medical : this.CheckLikelihood(this.imageData.safe_search_detection[0]['medical']) + '%',
            racy : this.CheckLikelihood(this.imageData.safe_search_detection[0]['racy']) + '%',
            spoofed : this.CheckLikelihood(this.imageData.safe_search_detection[0]['spoofed']) + '%',
            violence : this.CheckLikelihood(this.imageData.safe_search_detection[0]['violence']) + '%'
          })
        }
      }
      //LandMarks
      if(this.imageData.landmark_detection){
        if(this.imageData.landmark_detection.length > 0){
          let flag = false;
          let count = 0;
          let idx = 0;
          this.available_Features.forEach(
            (element : any, i : number) => {
              if(element.label === 'Landmarks') {
                if(this.imageData.landmark_detection.length > 0){
                  if(this.imageData.landmark_detection[0].message){
                    this.available_Features[i].count = '0';
                  }
                  else{
                    flag = true;
                    idx = i;
                  }
                }
                this.available_Features[i].processing = false;
              }          
            }
          )
          if(flag){
            this.imageData.landmark_detection.forEach(
              (element : any, i : number) => {
                if(element.description.length > 0){
                  this.landMarks.push({
                    key : i,
                    label : element.description,
                    latitude : element.locations[0].latitude,
                    longitude : element.locations[0].longitude,
                    score: Math.floor(element.score * 100) + '%',
                    active: false
                  })
                } else {
                  count++;
                }
              }
            );
            if(this.imageData.landmark_detection.length - count < 10) {
              this.available_Features[idx].count = `0${this.imageData.landmark_detection.length - count}`;
            }
            else {
              this.available_Features[idx].count = `${this.imageData.landmark_detection.length - count}`;
            }
          }
        }
      }
      
      if(this.available_Features[0]){
        this.feature.emit('default');//emit first response
      }
    }
  }
  
  ngOnChanges(): void {
    if(this.imageData){
      this.setResponses();
    }
    this.loadSpinner = false;
  }

  ngAfterViewInit(): void {
    this.currentImageName = this.imageName;
    this.currentImageFormat = this.imageName.split('.')[this.imageName.split('.').length - 1];
  }
  
  showFeature(feature : string) {
    let flag = false;
    for(let i = 0; i < this.available_Features.length;i++){
      if(this.available_Features[i].label != feature){
        this.available_Features[i].switch = false;
      }
    }
    for(let i = 0; i < this.available_Features.length;i++){
      if(this.available_Features[i].label === feature){
        this.available_Features[i].switch = !this.available_Features[i].switch;
        break;
      }
    }
    for(let i = 0; i < this.available_Features.length;i++){
      if(this.available_Features[i].switch){
        flag = true;
      }
    }    
    if(flag){
      this.feature.emit(feature);
    }
    else{
      this.feature.emit("default");
    }
  }
  
  ToggleText(key: number){
    this.label.emit(key);
    if(this.prevTextIndex != key){
      if(this.prevTextIndex != -1){
        this.textDetects[this.prevTextIndex].active = false;
      }
      this.textDetects[key].active = true;
      this.prevTextIndex = key;
    }
  }
  ToggleTextOff(key : number){
    this.label.emit(-1);
    if(this.prevTextIndex != key){
      if(this.prevTextIndex != -1){
        this.textDetects[this.prevTextIndex].active = false;
      }
      this.textDetects[key].active = true;
      this.prevTextIndex = key;
    }
  }
  
  ToggleFace(key: number){
    this.face.emit(key);
    if(this.prevFaceIndex === key){
      this.FaceContent[key].active = false;
      this.prevFaceIndex = -1;
    }
    else if(this.prevFaceIndex != key){
      if(this.prevFaceIndex != -1){
        this.webDetects[this.prevFaceIndex].active = false;
      }
      this.FaceContent[key].active = true;
      this.prevFaceIndex = key;
    }
  }
  ToggleFaceOff(key: number){
    this.face.emit(-1);
  }
  
  ToggleObject(key : any){
    this.object.emit(key);
    this.currentObjectConfidence = this.objectDetects[key].score;
      if(this.prevObjectIndex === key){
        this.objectDetects[key].active = false;
        this.prevObjectIndex = -1;
      }
      else if(this.prevObjectIndex != key){
        if(this.prevObjectIndex != -1){
          this.objectDetects[this.prevObjectIndex].active = false;
        }
        this.objectDetects[key].active = true;
        this.prevObjectIndex = key;
      }    
  }
  ToggleObjectoff(key : any){
    this.object.emit(-1);    
  }
  
  ToggleLandmark(key : any){
    this.currentLatitude = this.landMarks[key].latitude;
    this.currentLongitude = this.landMarks[key].longitude;
    this.landmark.emit(key);
    this.currentLandConfidence = this.landMarks[key].score;
    if(this.prevLandmarkIndex === key){
      this.landMarks[key].active = false;
      this.prevLandmarkIndex = -1;
    }
    else if(this.prevLandmarkIndex != key){
      if(this.prevLandmarkIndex != -1){
        this.landMarks[this.prevLandmarkIndex].active = false;
      }
      this.landMarks[key].active = true;
      this.prevLandmarkIndex = key;
    }     
  }
  ToggleLandmarkoff(key : any){
    this.landmark.emit(-1);
  }
  
  Enable(Feature : any){
    this.EnableFeature = Feature;
    if(!this.showModal){
      this.Display = 'block';
    }
    else{
      this.Display = 'none';
    }
    this.showModal = !this.showModal;
  }

  Discard() {
    if(!this.showModal){
      this.Display = 'block';
    }
    else{
      this.Display = 'none';
    }
    this.showModal = !this.showModal;
  }

  AddFeature(feature : any){
    let enableFeature = '';
    switch (feature) {
      case 'Web Detection':
        enableFeature = 'web_detection';
        break;
      case 'Label Detection':
        enableFeature = 'label_detection';
        break;
      case 'Face':
        enableFeature = 'facial_detection';
        break;
      case 'Image Properties':
        enableFeature = 'image_properties';
        break;
      case 'Landmarks':
        enableFeature = 'landmark_detection';
        break;
      case 'Logo Detection':
        enableFeature = 'logo_detection';
        break;
      case 'Text':
        enableFeature = 'text_detection';
        break;
      case 'Objects':
        enableFeature = 'object_localization';
        break;
      case 'Explicit Contents':
        enableFeature = 'safe_search_detection';
        break;
    }
    const id = localStorage.getItem('imageID');
    if(enableFeature.length > 0){
      this.ImageService.AddFeature(id, enableFeature, '0.1').subscribe(
        (res :any)=>{
          this.ThrowSuccessMessage("Feature Enabled");
          if(!this.showModal){
            this.Display = 'block';
          }
          else{
            this.Display = 'none';
          }
          this.showModal = !this.showModal;
        },
        (err : HttpErrorResponse)=> {
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
}
