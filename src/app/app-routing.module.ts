import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { OtaAvailabilityComponent } from './component/ratesAandAvailability/ota-availability/ota-availability.component';
import { OtaRatesComponent } from './component/ratesAandAvailability/ota-rates/ota-rates.component';
import { EditRatesComponent } from './component/ratesAandAvailability/edit-rates/edit-rates.component';
import { AuditReportComponent } from './component/audit-report/audit-report.component';
import { AuditOrderReportComponent } from './component/audit-order-report/audit-order-report.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: '', loadChildren: './pages/walkthrough/walkthrough.module#WalkthroughPageModule' },
   { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
   { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
   { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
   { path: 'edit-profile', loadChildren: './pages/edit-profile/edit-profile.module#EditProfilePageModule' },
   { path: 'resetPassword/:routeid', loadChildren: './pages/reset-password/reset-password.module#ResetPasswordPageModule' },
   { path: 'booking', loadChildren: './pages/booking/booking.module#BookingPageModule' },
   { path: 'booking-list', loadChildren: './pages/booking-list/booking-list.module#BookingListPageModule' },
   { path: 'booking-list-details', loadChildren: './pages/booking-list-details/booking-list-details.module#BookingListDetailsPageModule' },
   { path: 'booking-list-details/bookingTab', loadChildren: './pages/tab-booking/tab-booking.module#TabBookingPageModule' },
   { path: 'booking-list-details/customerTab', loadChildren: './pages/customer-details/customer-details.module#CustomerDetailsPageModule' },
   { path: 'tab-booking', loadChildren: './pages/tab-booking/tab-booking.module#TabBookingPageModule' },
   { path: 'tab-payments', loadChildren: './pages/tab-payments/tab-payments.module#TabPaymentsPageModule' },
   { path: 'tab-service', loadChildren: './pages/tab-service/tab-service.module#TabServicePageModule' },
   { path: 'tab-expence', loadChildren: './pages/tab-expence/tab-expence.module#TabExpencePageModule' },
   { path: 'rate-and-availability', loadChildren: './pages/rate-and-availability/rate-and-availability.module#RateAndAvailabilityPageModule' },
   { path: 'manage-payment', loadChildren: './pages/manage-payment/manage-payment.module#ManagePaymentPageModule' },
   { path: 'payment-list', loadChildren: './pages/payment-list/payment-list.module#PaymentListPageModule' },
   { path: 'manage-expence', loadChildren: './pages/manage-expence/manage-expence.module#ManageExpencePageModule' },
   { path: 'expence-list', loadChildren: './pages/expence-list/expence-list.module#ExpenceListPageModule' },
   { path: 'todays-rate-and-availability', loadChildren: './pages/todays-rate-and-availability/todays-rate-and-availability.module#TodaysRateAndAvailabilityPageModule' },
   { path: 'recentbooking', loadChildren: './pages/recentbooking/recentbooking.module#RecentbookingPageModule' },
   { path: 'guest-checkout-today', loadChildren: './pages/guest-checkout-today/guest-checkout-today.module#GuestCheckoutTodayPageModule' },
   { path: 'guest-check-in-today', loadChildren: './pages/guest-check-in-today/guest-check-in-today.module#GuestCheckInTodayPageModule' },
   { path: 'external-reservation', loadChildren: './pages/external-reservation/external-reservation.module#ExternalReservationPageModule' },
   { path: 'in-house-guest', loadChildren: './pages/in-house-guest/in-house-guest.module#InHouseGuestPageModule' },
   { path: 'manage-room', loadChildren: './pages/manage-room/manage-room.module#ManageRoomPageModule' },
   { path: 'menu-action-booking', loadChildren: './pages/menu-action-booking/menu-action-booking.module#MenuActionBookingPageModule' },
   { path: 'user-service', loadChildren: './pages/user-service/user-service.module#UserServicePageModule' },
   { path: 'checkout-detail', loadChildren: './pages/checkout-detail/checkout-detail.module#CheckoutDetailPageModule' },
   { path: 'checkout-payment', loadChildren: './pages/checkout-payment/checkout-payment.module#CheckoutPaymentPageModule' },
   { path: 'edit-rate', loadChildren: './pages/edit-rate/edit-rate.module#EditRatePageModule' },
   { path: 'manage-customer', loadChildren: './pages/manage-customer/manage-customer.module#ManageCustomerPageModule' },
   { path: 'add-customer-details', loadChildren: './pages/add-customer-details/add-customer-details.module#AddCustomerDetailsPageModule' },
   { path: 'add-customer-address', loadChildren: './pages/add-customer-address/add-customer-address.module#AddCustomerAddressPageModule' },
   { path: 'customer-details', loadChildren: './pages/customer-details/customer-details.module#CustomerDetailsPageModule' },
   { path: 'customer-status', loadChildren: './pages/customer-status/customer-status.module#CustomerStatusPageModule' },
   { path: 'customer-loyality', loadChildren: './pages/customer-loyality/customer-loyality.module#CustomerLoyalityPageModule' },
   { path: 'customer-nextstay', loadChildren: './pages/customer-nextstay/customer-nextstay.module#CustomerNextstayPageModule' },
   { path: 'customer-laststay', loadChildren: './pages/customer-laststay/customer-laststay.module#CustomerLaststayPageModule' },
   { path: 'manage-service', loadChildren: './pages/manage-service/manage-service.module#ManageServicePageModule' },
   { path: 'customer-kyc', loadChildren: './pages/customer-kyc/customer-kyc.module#CustomerKycPageModule' },
   { path: 'manage-order', loadChildren: './pages/order/manage-order/manage-order.module#ManageOrderPageModule' },
   { path: 'order-details', loadChildren: './pages/order/order-details/order-details.module#OrderDetailsPageModule' },
   { path: 'service-dashboard', loadChildren: './pages/master-service/service-dashboard/service-dashboard.module#ServiceDashboardPageModule' },
   { path: 'add-reservation', loadChildren: './pages/master-service/add-reservation/add-reservation.module#AddReservationPageModule' },
   { path: 'reservation-list', loadChildren: './pages/master-service/reservation-list/reservation-list.module#ReservationListPageModule' },
 
   { path: 'invoice-list', loadChildren: './pages/invoice-module/invoice-list/invoice-list.module#InvoiceListPageModule' },
   { path: 'product-group', loadChildren: './pages/order/product-group/product-group.module#ProductGroupPageModule' },
   { path: 'add-to-cart', loadChildren: './pages/order/add-to-cart/add-to-cart.module#AddToCartPageModule' },
   { path: 'checkout', loadChildren: './pages/order/checkout/checkout.module#CheckoutPageModule' },
   { path: 'setting', loadChildren: './pages/setting/setting.module#SettingPageModule' },
   { path: 'business-profile', loadChildren: './pages/business-setting/business-profile/business-profile.module#BusinessProfilePageModule' },
   { path: 'business-logo', loadChildren: './pages/business-setting/business-logo/business-logo.module#BusinessLogoPageModule' },
   { path: 'business-manager', loadChildren: './pages/business-setting/business-manager/business-manager.module#BusinessManagerPageModule' },
   { path: 'change-password', loadChildren: './pages/business-setting/change-password/change-password.module#ChangePasswordPageModule' },
   { path: 'business-address/:id', loadChildren: './pages/business-setting/business-address/business-address.module#BusinessAddressPageModule' },
   { path: 'add-to-slot', loadChildren: './pages/master-service/add-to-slot/add-to-slot.module#AddToSlotPageModule' },
   { path: 'slot-checkout', loadChildren: './pages/master-service/slot-checkout/slot-checkout.module#SlotCheckoutPageModule' },
   { path: 'notification', loadChildren: './pages/notification/notification.module#NotificationPageModule' },

   { path: 'product-group-list', loadChildren: './pages/product/product-group/list/list.module#ListPageModule' },
   { path: 'product-group-create', loadChildren: './pages/product/product-group/create-group/create-group.module#CreateGroupPageModule' },
   { path: 'manage-product', loadChildren: './pages/product/manage-product/manage-product.module#ManageProductPageModule' },
   { path: 'create-product', loadChildren: './pages/product/create-product/create-product.module#CreateProductPageModule' },

   { path: 'create-variation', loadChildren: './pages/product/variation/variation-create/variation-create.module#VariationCreatePageModule' },
   { path: 'variation-list', loadChildren: './pages/product/variation/variation-list/variation-list.module#VariationListPageModule' },

  {
    path: 'reservation-details/:id',
    loadChildren: () => import('./pages/master-service/reservation-details/reservation-details.module').then( m => m.ReservationDetailsPageModule)
  },
  {
    path: 'ota-availability',
   component:OtaAvailabilityComponent
  },
  {
    path: 'ota-rates',
   component:OtaRatesComponent
  },
  {
    path: 'edit-rates',
   component:EditRatesComponent
  },

  {
    path: 'audit-report-order',
   component:AuditOrderReportComponent
  },
  

  {
    path: 'audit-report',
   component:AuditReportComponent
  },
  {
    path: 'bank-details',
    loadChildren: () => import('./pages/business-setting/bank-details/bank-details.module').then( m => m.BankDetailsPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'wallet-details',
    loadChildren: () => import('./pages/business-setting/wallet-details/wallet-details.module').then( m => m.WalletDetailsPageModule)
  },
  {
    path: 'invoice-details',
    loadChildren: () => import('./pages/invoice-module/invoice-details/invoice-details.module').then( m => m.InvoiceDetailsPageModule)
  },
  {
    path: 'room-status-change',
    loadChildren: () => import('./pages/room-status-change/room-status-change.module').then( m => m.RoomStatusChangePageModule)
  },
  {
    path: 'product-dashboard',
    loadChildren: () => import('./pages/product/product-dashboard/product-dashboard.module').then( m => m.ProductDashboardPageModule)
  },
  {
    path: 'manage-property',
    loadChildren: () => import('./pages/property/manage-property/manage-property.module').then( m => m.ManagePropertyPageModule)
  },
  {
    path: 'room-list',
    loadChildren: () => import('./pages/property/room-list/room-list.module').then( m => m.RoomListPageModule)
  },
  {
    path: 'room-details',
    loadChildren: () => import('./pages/property/room-details/room-details.module').then( m => m.RoomDetailsPageModule)
  },
  {
    path: 'manage-room-plan',
    loadChildren: () => import('./pages/property/manage-room-plan/manage-room-plan.module').then( m => m.ManageRoomPlanPageModule)
  },
  {
    path: 'add-room-plan',
    loadChildren: () => import('./pages/property/add-room-plan/add-room-plan.module').then( m => m.AddRoomPlanPageModule)
  },
  {
    path: 'room-rate-and-availability',
    loadChildren: () => import('./pages/property/room-rate-and-availability/room-rate-and-availability.module').then( m => m.RoomRateAndAvailabilityPageModule)
  },
  {
    path: 'add-inventory',
    loadChildren: () => import('./pages/property/add-inventory/add-inventory.module').then( m => m.AddInventoryPageModule)
  },
  {
    path: 'update-inventory',
    loadChildren: () => import('./pages/property/update-inventory/update-inventory.module').then( m => m.UpdateInventoryPageModule)
  },
  {
    path: 'kot',
    loadChildren: () => import('./pages/order/kot/kot.module').then( m => m.KotPageModule)
  },
  {
    path: 'add-or-update-plan',
    loadChildren: () => import('./pages/property/add-or-update-plan/add-or-update-plan.module').then( m => m.AddOrUpdatePlanPageModule)
  },
  {
    path: 'todos-list',
    loadChildren: () => import('./pages/todos/todos-list/todos-list.module').then( m => m.TodosListPageModule)
  },
  {
    path: 'todos-create',
    loadChildren: () => import('./pages/todos/todos-create/todos-create.module').then( m => m.TodosCreatePageModule)
  },
  {
    path: 'night-audit-report',
    loadChildren: () => import('./pages/report/night-audit-report/night-audit-report.module').then( m => m.NightAuditReportPageModule)
  },
  {
    path: 'order-dashboard',
    loadChildren: () => import('./pages/order/order-dashboard/order-dashboard.module').then( m => m.OrderDashboardPageModule)
  },
  {
    path: 'order-payment-details',
    loadChildren: () => import('./pages/order/order-payment-details/order-payment-details.module').then( m => m.OrderPaymentDetailsPageModule)
  },
  {
    path: 'order-complete',
    loadChildren: () => import('./pages/order/order-complete/order-complete.module').then( m => m.OrderCompletePageModule)
  },
  {
    path: 'daily-report',
    loadChildren: () => import('./pages/report/daily-report/daily-report.module').then( m => m.DailyReportPageModule)
  },
  {
    path: 'report-dashboard',
    loadChildren: () => import('./pages/report/report-dashboard/report-dashboard.module').then( m => m.ReportDashboardPageModule)
  },
  {
    path: 'customer-kyc-list',
    loadChildren: () => import('./pages/customer-kyc-list/customer-kyc-list.module').then( m => m.CustomerKycListPageModule)
  },
  {
    path: 'multibookinglist',
    loadChildren: () => import('./pages/multibookinglist/multibookinglist.module').then( m => m.MultibookinglistPageModule)
  },
  {
    path: 'kot-generate/:id',
    loadChildren: () => import('./pages/order/kot-generate/kot-generate.module').then( m => m.KotGeneratePageModule)
  },
  {
    path: 'kom',
    loadChildren: () => import('./pages/order/kom/kom.module').then( m => m.KomPageModule)
  },
  {
    path: 'accomodation-dashboard',
    loadChildren: () => import('./pages/accomodation-dashboard/accomodation-dashboard.module').then( m => m.AccomodationDashboardPageModule)
  },
  {
    path: 'booking-view',
    loadChildren: () => import('./pages/booking-view/booking-view.module').then( m => m.BookingViewPageModule)
  },
  {
    path: 'availability-update',
    loadChildren: () => import('./pages/availability-update/availability-update.module').then( m => m.AvailabilityUpdatePageModule)
  },
  {
    path: 'master-rates-update',
    loadChildren: () => import('./pages/master-rates-update/master-rates-update.module').then( m => m.MasterRatesUpdatePageModule)
  },
  {
    path: 'master-rates-and-availability',
    loadChildren: () => import('./pages/master-rates-and-availability/master-rates-and-availability.module').then( m => m.MasterRatesAndAvailabilityPageModule)
  },
  {
    path: 'cm-rates-and-availability',
    loadChildren: () => import('./pages/cm-rates-and-availability/cm-rates-and-availability.module').then( m => m.CmRatesAndAvailabilityPageModule)
  },
  {
    path: 'stop-sell',
    loadChildren: () => import('./pages/stop-sell/stop-sell.module').then( m => m.StopSellPageModule)
  },
  {
    path: 'order-invoice',
    loadChildren: () => import('./pages/order-invoice/order-invoice.module').then( m => m.OrderInvoicePageModule)
  },  {
    path: 'service-order-report',
    loadChildren: () => import('./pages/service-order-report/service-order-report.module').then( m => m.ServiceOrderReportPageModule)
  },
  {
    path: 'order-reports',
    loadChildren: () => import('./pages/order-reports/order-reports.module').then( m => m.OrderReportsPageModule)
  },
  {
    path: 'order-report-dashboard',
    loadChildren: () => import('./pages/order-report-dashboard/order-report-dashboard.module').then( m => m.OrderReportDashboardPageModule)
  },





 



 
  // {
  //   path: '',
  //   redirectTo: 'folder/Inbox',
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'folder/:id',
  //   loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)//, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
