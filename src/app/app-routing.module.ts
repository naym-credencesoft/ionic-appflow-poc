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
{ path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule) },
{ path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
{ path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule) },
{ path: 'edit-profile', loadChildren: () => import('./pages/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule) },
{ path: 'resetPassword/:routeid', loadChildren: () => import('./pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule) },
{ path: 'booking', loadChildren: () => import('./pages/booking/booking.module').then(m => m.BookingPageModule) },
{ path: 'booking-list', loadChildren: () => import('./pages/booking-list/booking-list.module').then(m => m.BookingListPageModule) },
{ path: 'booking-list-details', loadChildren: () => import('./pages/booking-list-details/booking-list-details.module').then(m => m.BookingListDetailsPageModule) },
{ path: 'booking-list-details/bookingTab', loadChildren: () => import('./pages/tab-booking/tab-booking.module').then(m => m.TabBookingPageModule) },
{ path: 'booking-list-details/customerTab', loadChildren: () => import('./pages/customer-details/customer-details.module').then(m => m.CustomerDetailsPageModule) },
{ path: 'tab-booking', loadChildren: () => import('./pages/tab-booking/tab-booking.module').then(m => m.TabBookingPageModule) },
{ path: 'tab-payments', loadChildren: () => import('./pages/tab-payments/tab-payments.module').then(m => m.TabPaymentsPageModule) },
{ path: 'tab-service', loadChildren: () => import('./pages/tab-service/tab-service.module').then(m => m.TabServicePageModule) },
{ path: 'tab-expence', loadChildren: () => import('./pages/tab-expence/tab-expence.module').then(m => m.TabExpencePageModule) },
{ path: 'rate-and-availability', loadChildren: () => import('./pages/rate-and-availability/rate-and-availability.module').then(m => m.RateAndAvailabilityPageModule) },
{ path: 'manage-payment', loadChildren: () => import('./pages/manage-payment/manage-payment.module').then(m => m.ManagePaymentPageModule) },
{ path: 'payment-list', loadChildren: () => import('./pages/payment-list/payment-list.module').then(m => m.PaymentListPageModule) },
{ path: 'manage-expence', loadChildren: () => import('./pages/manage-expence/manage-expence.module').then(m => m.ManageExpencePageModule) },
{ path: 'expence-list', loadChildren: () => import('./pages/expence-list/expence-list.module').then(m => m.ExpenceListPageModule) },
{ path: 'todays-rate-and-availability', loadChildren: () => import('./pages/todays-rate-and-availability/todays-rate-and-availability.module').then(m => m.TodaysRateAndAvailabilityPageModule) },
{ path: 'recentbooking', loadChildren: () => import('./pages/recentbooking/recentbooking.module').then(m => m.RecentbookingPageModule) },
{ path: 'guest-checkout-today', loadChildren: () => import('./pages/guest-checkout-today/guest-checkout-today.module').then(m => m.GuestCheckoutTodayPageModule) },
{ path: 'guest-check-in-today', loadChildren: () => import('./pages/guest-check-in-today/guest-check-in-today.module').then(m => m.GuestCheckInTodayPageModule) },
{ path: 'external-reservation', loadChildren: () => import('./pages/external-reservation/external-reservation.module').then(m => m.ExternalReservationPageModule) },
{ path: 'in-house-guest', loadChildren: () => import('./pages/in-house-guest/in-house-guest.module').then(m => m.InHouseGuestPageModule) },
{ path: 'manage-room', loadChildren: () => import('./pages/manage-room/manage-room.module').then(m => m.ManageRoomPageModule) },
{ path: 'menu-action-booking', loadChildren: () => import('./pages/menu-action-booking/menu-action-booking.module').then(m => m.MenuActionBookingPageModule) },
{ path: 'user-service', loadChildren: () => import('./pages/user-service/user-service.module').then(m => m.UserServicePageModule) },
{ path: 'checkout-detail', loadChildren: () => import('./pages/checkout-detail/checkout-detail.module').then(m => m.CheckoutDetailPageModule) },
{ path: 'checkout-payment', loadChildren: () => import('./pages/checkout-payment/checkout-payment.module').then(m => m.CheckoutPaymentPageModule) },
{ path: 'edit-rate', loadChildren: () => import('./pages/edit-rate/edit-rate.module').then(m => m.EditRatePageModule) },
{ path: 'manage-customer', loadChildren: () => import('./pages/manage-customer/manage-customer.module').then(m => m.ManageCustomerPageModule) },
{ path: 'add-customer-details', loadChildren: () => import('./pages/add-customer-details/add-customer-details.module').then(m => m.AddCustomerDetailsPageModule) },
{ path: 'add-customer-address', loadChildren: () => import('./pages/add-customer-address/add-customer-address.module').then(m => m.AddCustomerAddressPageModule) },
{ path: 'customer-details', loadChildren: () => import('./pages/customer-details/customer-details.module').then(m => m.CustomerDetailsPageModule) },
{ path: 'customer-status', loadChildren: () => import('./pages/customer-status/customer-status.module').then(m => m.CustomerStatusPageModule) },
{ path: 'customer-loyality', loadChildren: () => import('./pages/customer-loyality/customer-loyality.module').then(m => m.CustomerLoyalityPageModule) },
{ path: 'customer-nextstay', loadChildren: () => import('./pages/customer-nextstay/customer-nextstay.module').then(m => m.CustomerNextstayPageModule) },
{ path: 'customer-laststay', loadChildren: () => import('./pages/customer-laststay/customer-laststay.module').then(m => m.CustomerLaststayPageModule) },
{ path: 'manage-service', loadChildren: () => import('./pages/manage-service/manage-service.module').then(m => m.ManageServicePageModule) },
{ path: 'customer-kyc', loadChildren: () => import('./pages/customer-kyc/customer-kyc.module').then(m => m.CustomerKycPageModule) },
{ path: 'manage-order', loadChildren: () => import('./pages/order/manage-order/manage-order.module').then(m => m.ManageOrderPageModule) },
{ path: 'order-details', loadChildren: () => import('./pages/order/order-details/order-details.module').then(m => m.OrderDetailsPageModule) },
{ path: 'service-dashboard', loadChildren: () => import('./pages/master-service/service-dashboard/service-dashboard.module').then(m => m.ServiceDashboardPageModule) },
{ path: 'add-reservation', loadChildren: () => import('./pages/master-service/add-reservation/add-reservation.module').then(m => m.AddReservationPageModule) },
{ path: 'reservation-list', loadChildren: () => import('./pages/master-service/reservation-list/reservation-list.module').then(m => m.ReservationListPageModule) },
{ path: 'invoice-list', loadChildren: () => import('./pages/invoice-module/invoice-list/invoice-list.module').then(m => m.InvoiceListPageModule) },
{ path: 'product-group', loadChildren: () => import('./pages/order/product-group/product-group.module').then(m => m.ProductGroupPageModule) },
{ path: 'add-to-cart', loadChildren: () => import('./pages/order/add-to-cart/add-to-cart.module').then(m => m.AddToCartPageModule) },
{ path: 'checkout', loadChildren: () => import('./pages/order/checkout/checkout.module').then(m => m.CheckoutPageModule) },
{ path: 'setting', loadChildren: () => import('./pages/setting/setting.module').then(m => m.SettingPageModule) },
{ path: 'business-profile', loadChildren: () => import('./pages/business-setting/business-profile/business-profile.module').then(m => m.BusinessProfilePageModule) },
{ path: 'business-logo', loadChildren: () => import('./pages/business-setting/business-logo/business-logo.module').then(m => m.BusinessLogoPageModule) },
{ path: 'business-manager', loadChildren: () => import('./pages/business-setting/business-manager/business-manager.module').then(m => m.BusinessManagerPageModule) },
{ path: 'change-password', loadChildren: () => import('./pages/business-setting/change-password/change-password.module').then(m => m.ChangePasswordPageModule) },
{ path: 'business-address/:id', loadChildren: () => import('./pages/business-setting/business-address/business-address.module').then(m => m.BusinessAddressPageModule) },
{ path: 'add-to-slot', loadChildren: () => import('./pages/master-service/add-to-slot/add-to-slot.module').then(m => m.AddToSlotPageModule) },
{ path: 'slot-checkout', loadChildren: () => import('./pages/master-service/slot-checkout/slot-checkout.module').then(m => m.SlotCheckoutPageModule) },
{ path: 'notification', loadChildren: () => import('./pages/notification/notification.module').then(m => m.NotificationPageModule) },
{ path: 'product-group-list', loadChildren: () => import('./pages/product/product-group/list/list.module').then(m => m.ListPageModule) },
{ path: 'product-group-create', loadChildren: () => import('./pages/product/product-group/create-group/create-group.module').then(m => m.CreateGroupPageModule) },
{ path: 'manage-product', loadChildren: () => import('./pages/product/manage-product/manage-product.module').then(m => m.ManageProductPageModule) },
{ path: 'create-product', loadChildren: () => import('./pages/product/create-product/create-product.module').then(m => m.CreateProductPageModule) },
{ path: 'create-variation', loadChildren: () => import('./pages/product/variation/variation-create/variation-create.module').then(m => m.VariationCreatePageModule) },
{ path: 'variation-list', loadChildren: () => import('./pages/product/variation/variation-list/variation-list.module').then(m => m.VariationListPageModule) },


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
    path: 'kot-list',
    loadChildren: () => import('./pages/order/kot-list/kot-list.module').then( m => m.KotListPageModule)
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
  },
  {
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
