import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './dashboard.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { SidebarModule } from 'ng-sidebar';
import { HeaderComponent } from './layout/header/header.component';
import { VideoComponent } from './components/home/video/video.component';
import { ProfileImageComponent } from './components/user-details/profile-image/profile-image.component';
import { UserLoginDetailsComponent } from './components/user-details/user-login-details/user-login-details.component';
import { UserPasswordComponent } from './components/user-details/user-password/user-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageComponent } from './components/home/image/image.component';
import { VideoCardComponent } from './components/home/video/components/video-card/video-card.component';
import { VideoCardListComponent } from './components/home/video/components/video-card-list/video-card-list.component';
import { DateComponent } from './components/home/video/components/date/date.component';
import { ImageCardComponent } from './components/home/image/components/image-card/image-card.component';
import { ImageCardListComponent } from './components/home/image/components/image-card-list/image-card-list.component';
import { UploadComponent } from './components/upload/upload.component';
import { UploadVideoComponent } from './components/upload/upload-video/upload-video.component';
import { UploadImageComponent } from './components/upload/upload-image/upload-image.component';
import { VideoDescriptionComponent } from './components/home/video/components/video-description/video-description.component';
import { LabelsComponent } from './components/home/video/components/video-description/components/labels/labels.component';
import { TimelineComponent } from './components/home/video/components/video-description/components/timeline/timeline.component';
import { LabelDetectionComponent } from './components/home/video/components/video-description/components/label-detection/label-detection.component';
import { ShotDetectionComponent } from './components/home/video/components/video-description/components/shot-detection/shot-detection.component';
import { ExplicitContentComponent } from './components/home/video/components/video-description/components/explicit-content/explicit-content.component';
import { SpeechTranscriptionComponent } from './components/home/video/components/video-description/components/speech-transcription/speech-transcription.component';
import { ObjectTrackingComponent } from './components/home/video/components/video-description/components/object-tracking/object-tracking.component';
import { TextDetectionComponent } from './components/home/video/components/video-description/components/text-detection/text-detection.component';
import { LogoDetectionComponent } from './components/home/video/components/video-description/components/logo-detection/logo-detection.component';
import { FaceDetectionComponent } from './components/home/video/components/video-description/components/face-detection/face-detection.component';
import { PersonDetectionComponent } from './components/home/video/components/video-description/components/person-detection/person-detection.component';
import { ImageDescriptionComponent } from './components/home/image/components/image-description/image-description.component';
import { OtherImagesCardListComponent } from './components/home/image/components/image-description/other-images-card-list/other-images-card-list.component';
import { OtherImageCardComponent } from './components/home/image/components/image-description/other-images-card-list/other-image-card/other-image-card.component';
import { ImageInfoComponent } from './components/home/image/components/image-description/image-info/image-info.component';
import { ImageFaceDetectionComponent } from './components/home/image/components/image-description/image-face-detection/image-face-detection.component';
import { ImageTextDetectionComponent } from './components/home/image/components/image-description/image-text-detection/image-text-detection.component';
import { ImageLogoDetectionsComponent } from './components/home/image/components/image-description/image-logo-detections/image-logo-detections.component';
import { ImageObjectDetectionsComponent } from './components/home/image/components/image-description/image-object-detections/image-object-detections.component';
import { ImageLabelDetectionsComponent } from './components/home/image/components/image-description/image-label-detections/image-label-detections.component';
import { ImagePropertiesComponent } from './components/home/image/components/image-description/image-properties/image-properties.component';
import { ImageWebDetectionsComponent } from './components/home/image/components/image-description/image-web-detections/image-web-detections.component';
import { VideoPlayerComponent } from './components/home/video/components/video-description/video-player/video-player.component';
import { TimelineVideoCardComponent } from './components/home/video/components/video-description/components/timeline/timeline-video-card/timeline-video-card.component';
import { ExplicitContentsComponent } from './components/home/image/components/image-description/explicit-contents/explicit-contents.component';
import { ImageLandmarksComponent } from './components/home/image/components/image-description/image-landmarks/image-landmarks.component';
import { DragScrollModule } from 'ngx-drag-scroll';
import { DeletedComponent } from './components/deleted/deleted.component';
import { DeletedImagesComponent } from './components/deleted/deleted-images/deleted-images.component';
import { DeletedVideosComponent } from './components/deleted/deleted-videos/deleted-videos.component';
import { DeletedImagesCardsComponent } from './components/deleted/deleted-images/deleted-images-cards/deleted-images-cards.component';
import { DeletedImagesCardComponent } from './components/deleted/deleted-images/deleted-images-card/deleted-images-card.component';
import { DeletedVideosCardsComponent } from './components/deleted/deleted-videos/deleted-videos-cards/deleted-videos-cards.component';
import { DeletedVideosCardComponent } from './components/deleted/deleted-videos/deleted-videos-card/deleted-videos-card.component';
import { DefaultImageComponent } from './components/home/image/components/image-description/default-image/default-image.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FaceCardComponent } from './components/home/video/components/video-description/components/face-detection/face-card/face-card.component';
import { ImageUploadingComponent } from './components/upload/upload-image/image-uploading/image-uploading.component';
import { ImageUploadedComponent } from './components/upload/upload-image/image-uploaded/image-uploaded.component';
import { VideoUploadedComponent } from './components/upload/upload-video/video-uploaded/video-uploaded.component';
import { VideoUploadingComponent } from './components/upload/upload-video/video-uploading/video-uploading.component';
import { PersonCardComponent } from './components/home/video/components/video-description/components/person-detection/person-card/person-card.component';
import { ObjectCardsComponent } from './components/home/video/components/video-description/components/object-tracking/object-cards/object-cards.component';
import { TermsOfServiceComponent } from './components/user-details/terms-of-service/terms-of-service.component';
import { ShippingPolicyComponent } from './components/user-details/shipping-policy/shipping-policy.component';
import { CancellationPolicyComponent } from './components/user-details/cancellation-policy/cancellation-policy.component';
import { ReturnPolicyComponent } from './components/user-details/return-policy/return-policy.component';
import { TransactionalPolicyComponent } from './components/user-details/transactional-policy/transactional-policy.component';
import { PrivacyPolicyComponent } from './components/user-details/privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from './components/user-details/refund-policy/refund-policy.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      {
        path: '', component: HomeComponent,
        children: [
          {
            path: 'video', component: VideoComponent            
          }, 
          {
            path: 'videoDetails/:id', component: VideoDescriptionComponent
          }, 
          {
            path: 'image', component: ImageComponent
          },
          {
            path: 'imageDetails/:id', component: ImageDescriptionComponent
          }      
        ]
      },
      {
        path: 'upload', component:UploadVideoComponent
      }   
    ]
  },
  {
    path: 'deleted', component: DeletedComponent
  }
]

@NgModule({
  declarations: [
    HomeComponent, 
    DashboardComponent, 
    UserDetailsComponent, 
    SidebarComponent, 
    HeaderComponent, 
    ProfileImageComponent, 
    UserLoginDetailsComponent, 
    UserPasswordComponent,
    VideoCardComponent,
    VideoComponent,
    VideoCardListComponent,
    DateComponent,
    ImageComponent,
    ImageCardComponent,
    ImageCardListComponent,
    UploadComponent,
    UploadVideoComponent,
    UploadImageComponent,
    VideoDescriptionComponent,
    LabelsComponent,
    TimelineComponent,
    LabelDetectionComponent,
    ShotDetectionComponent,
    ExplicitContentComponent,
    SpeechTranscriptionComponent,
    ObjectTrackingComponent,
    TextDetectionComponent,
    LogoDetectionComponent,
    FaceDetectionComponent,
    PersonDetectionComponent,
    ImageDescriptionComponent,
    OtherImagesCardListComponent,
    OtherImageCardComponent,
    ImageInfoComponent,
    ImageFaceDetectionComponent,
    ImageTextDetectionComponent,
    ImageLogoDetectionsComponent,
    ImageObjectDetectionsComponent,
    ImageLabelDetectionsComponent,
    ImagePropertiesComponent,
    ImageWebDetectionsComponent,
    VideoPlayerComponent,
    TimelineVideoCardComponent,
    ExplicitContentsComponent,
    ImageLandmarksComponent,
    DeletedComponent,
    DeletedImagesComponent,
    DeletedVideosComponent,
    DeletedImagesCardsComponent,
    DeletedImagesCardComponent,
    DeletedVideosCardsComponent,
    DeletedVideosCardComponent,
    DefaultImageComponent,
    FaceCardComponent,
    ImageUploadingComponent,
    ImageUploadedComponent,
    VideoUploadedComponent,
    VideoUploadingComponent,
    PersonCardComponent,
    ObjectCardsComponent,
    TermsOfServiceComponent,
    ShippingPolicyComponent,
    CancellationPolicyComponent,
    ReturnPolicyComponent,
    TransactionalPolicyComponent,
    PrivacyPolicyComponent,
    RefundPolicyComponent
    ],
  imports: [
    DragScrollModule,
    CommonModule,
    RouterModule.forChild(routes),
    SidebarModule.forRoot(),
    ReactiveFormsModule,
    NgbModule
  ]
})
export class DashboardModule { }
