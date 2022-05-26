import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './modules/admin/shared/admin.guard';
import { AuthGuard } from './modules/auth/shared/auth.guard';
import { CancellationPolicyComponent } from './modules/dashboard/components/user-details/cancellation-policy/cancellation-policy.component';
import { PrivacyPolicyComponent } from './modules/dashboard/components/user-details/privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from './modules/dashboard/components/user-details/refund-policy/refund-policy.component';
import { ReturnPolicyComponent } from './modules/dashboard/components/user-details/return-policy/return-policy.component';
import { ShippingPolicyComponent } from './modules/dashboard/components/user-details/shipping-policy/shipping-policy.component';
import { TermsOfServiceComponent } from './modules/dashboard/components/user-details/terms-of-service/terms-of-service.component';
import { TransactionalPolicyComponent } from './modules/dashboard/components/user-details/transactional-policy/transactional-policy.component';
import { UserDetailsComponent } from './modules/dashboard/components/user-details/user-details.component';
import { NotFoundComponent } from './not-found.component';
import { TransactionStatusComponent } from './status/transaction-status/transaction-status.component';


const routes: Routes = [
  {
    path:'', 
    loadChildren: () => import('./modules/homepage/homepage.module').then(m => m.HomepageModule)
  },
  {
    path:'user', 
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'billing',
    loadChildren: () => import('./modules/billing/billing.module').then(m => m.BillingModule),
    canLoad:[AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canLoad:[AdminGuard],
    canActivate: [AdminGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    canLoad:[AuthGuard],
    canActivate: [AuthGuard]
  },  
  {
    path: 'user-details', component: UserDetailsComponent,
    canLoad:[AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'terms-of-service', component: TermsOfServiceComponent,
  },
  {
    path: 'return-policy', component: ReturnPolicyComponent,
  },
  {
    path: 'transactional-currency', component: TransactionalPolicyComponent,
  },
  {
    path: 'shipping-policy', component: ShippingPolicyComponent,
  },
  {
    path: 'cancellation-policy', component: CancellationPolicyComponent,
  },
  {
    path: 'privacy-policy', component: PrivacyPolicyComponent,
  },
  {
    path: 'refund-policy', component: RefundPolicyComponent,
  },
  {
    path: 'status/:status/:token', component: TransactionStatusComponent,
  },
  {
    path: '**', component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
