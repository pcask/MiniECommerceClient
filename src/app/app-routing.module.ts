import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { LayoutComponent } from './admin/layout/layout.component';
import { AdminAuthGuard } from './guards/admin/admin-auth.guard';
import { UiAuthGuard } from './guards/ui/ui-auth.guard';
import { HomeComponent } from './ui/components/home/home.component';

const routes: Routes = [
  {
    path: "admin", component: LayoutComponent, children:
      [
        { path: "", component: DashboardComponent, canActivate: [AdminAuthGuard] },
        { path: "products", loadChildren: () => import("./admin/components/products/products.module").then(module => module.ProductsModule), canActivate: [AdminAuthGuard] },
        { path: "customers", loadChildren: () => import("./admin/components/customers/customers.module").then(module => module.CustomersModule), canActivate: [AdminAuthGuard] },
        { path: "orders", loadChildren: () => import("./admin/components/orders/orders.module").then(module => module.OrdersModule), canActivate: [AdminAuthGuard] }
      ],
    canActivate: [AdminAuthGuard]
  },
  { path: "", component: HomeComponent, canActivate: [UiAuthGuard] },
  { path: "my-cart", loadChildren: () => import("./ui/components/carts/carts.module").then(module => module.CartsModule), canActivate: [UiAuthGuard] },
  { path: "products", loadChildren: () => import("./ui/components/products/products.module").then(module => module.ProductsModule), canActivate: [UiAuthGuard] },
  { path: "product/:brand/:productName&id", loadChildren: () => import("./ui/components/product-details/product-details.module").then(module => module.ProductDetailsModule), canActivate: [UiAuthGuard] },
  { path: "register", loadChildren: () => import("./ui/components/register/register.module").then(module => module.RegisterModule), canActivate: [UiAuthGuard] },
  { path: "login", loadChildren: () => import("./ui/components/login/login.module").then(module => module.LoginModule), canActivate: [UiAuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
