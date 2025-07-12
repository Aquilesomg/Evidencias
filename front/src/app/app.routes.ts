import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SellerLayoutComponent } from './layouts/seller-layout/seller-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { roleGuard } from './auth/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'registro', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
    ]
  },
  {
    path: 'vendedor',
    component: SellerLayoutComponent,
    canActivate: [roleGuard],
    data: { expectedRole: 'vendedor' },
    children: [
      { path: '', redirectTo: 'resumen', pathMatch: 'full' },
      { path: 'resumen', loadComponent: () => import('./pages/seller/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'productos', loadComponent: () => import('./pages/seller/products-list/products-list.component').then(m => m.ProductsListComponent) },
      { path: 'productos/crear', loadComponent: () => import('./pages/product-create/product-create.component').then(m => m.ProductCreateComponent) },
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [roleGuard],
    data: { expectedRole: 'admin' },
    children: [
      { path: '', redirectTo: 'resumen', pathMatch: 'full' },
      { path: 'resumen', loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'aprobacion', loadComponent: () => import('./pages/admin/product-approval/product-approval.component').then(m => m.ProductApprovalComponent) },
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'producto/:id', loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
      { 
        path: 'carrito', 
        loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'user' }
      },
      { 
    path: 'checkout', 
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [roleGuard],
    data: { expectedRole: 'user' }
  },
      { 
    path: 'pedido-exitoso', 
    loadComponent: () => import('./pages/order-success/order-success.component').then(m => m.OrderSuccessComponent),
    canActivate: [roleGuard],
    data: { expectedRole: 'user' }
  },
  { 
        path: 'perfil', 
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [roleGuard],
        data: { expectedRole: ['user', 'vendedor', 'admin', 'soporte'] } // Todos los usuarios logueados pueden ver su perfil
      },
    ]
  },
  { path: '**', redirectTo: '' }
];
