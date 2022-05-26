import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { GlobalResultComponent } from './global-result/global-result.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { OverviewComponent } from './global-result/overview/overview.component';
import { OverviewCardsComponent } from './global-result/overview/overview-cards/overview-cards.component';
import { PriceComparisonComponent } from './global-result/price-comparison/price-comparison.component';
import { ProfitEarnedComponent } from './global-result/price-comparison/profit-earned/profit-earned.component';
import { GoogleSpentComponent } from './global-result/price-comparison/google-spent/google-spent.component';
import { MostUsedImageFeatureComponent } from './global-result/most-used-image-feature/most-used-image-feature.component';
import { MostUsedVideoFeatureComponent } from './global-result/most-used-video-feature/most-used-video-feature.component';
import { ProfitLossChartComponent } from './global-result/profit-loss-chart/profit-loss-chart.component';
import { RouterModule, Routes } from '@angular/router';
import { UserResultComponent } from './user-result/user-result.component';
import { SidebarModule } from 'ng-sidebar';
import { UserDetailsCardsComponent } from './user-result/user-details-cards/user-details-cards.component';
import { UserDetailsCardComponent } from './user-result/user-details-cards/user-details-card/user-details-card.component';
import { PaginationComponent } from './user-result/user-details-cards/pagination/pagination.component';
import { FeatureDropdownComponent } from './global-result/price-comparison/feature-dropdown/feature-dropdown.component';
import { VideoFeatureDetailsComponent } from './user-result/user-details-cards/user-details-card/video-feature-details/video-feature-details.component';
import { ImageFeatureDetailsComponent } from './user-result/user-details-cards/user-details-card/image-feature-details/image-feature-details.component';
import { HighchartsChartModule } from 'highcharts-angular';
const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children : [
      {
        path:'' , component: GlobalResultComponent
      },
      {
        path:'user-details' , component: UserResultComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    AdminComponent, 
    GlobalResultComponent, 
    HeaderComponent, 
    SidebarComponent, 
    OverviewComponent, 
    OverviewCardsComponent, 
    PriceComparisonComponent, 
    ProfitEarnedComponent, 
    GoogleSpentComponent, 
    MostUsedImageFeatureComponent, 
    MostUsedVideoFeatureComponent, 
    ProfitLossChartComponent, 
    UserResultComponent, 
    UserDetailsCardsComponent, 
    UserDetailsCardComponent, 
    PaginationComponent, FeatureDropdownComponent, VideoFeatureDetailsComponent, ImageFeatureDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SidebarModule.forRoot(),
    HighchartsChartModule
  ]
})
export class AdminModule { }
