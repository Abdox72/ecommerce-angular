import { Routes } from '@angular/router';
import { authGuard } from './gaurds/auth.guard';
export const routes: Routes = [
    {
        path: '' ,
        canActivate:[authGuard],
        loadComponent: () => import('./layouts/blank-layout/blank-layout.component').then(m => m.BlankLayoutComponent),
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
            },
            {
                path: 'home',
                loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
            },
            {
                path: 'products',
                loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent),
            },
            {
                path: 'productDetails/:id',
                loadComponent: () => import('./components/product-details/product-details.component').then(m => m.ProductDetailsComponent),
            },
            {
                path: 'cart',
                loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent)
            },
            {
                path: 'wishlist',
                loadComponent: () => import('./components/wishlist/wishlist.component').then(m => m.WishlistComponent)
            },
            {
                path: 'orders',
                loadComponent: () => import('./components/orders/orders.component').then(m => m.OrdersComponent)
            },
            {
                path: 'orders/:id',
                loadComponent: () => import('./components/order-details/order-details.component').then(m => m.OrderDetailsComponent)
            }
        ]
    },
    {
        path: '',
        loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
            },
            {
                path: 'login',
                loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'signup',
                loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent)
            },
        ]
    },
    { path: 'forgot-password', loadComponent: ()=> import('./components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)},
    { path: 'reset-password', loadComponent:()=> import('./components/reset-password/reset-password.component').then(m=>m.ResetPasswordComponent) },
    {
        path: '**',
        loadComponent: () => import('./components/page-not-found404/page-not-found404.component').then(m => m.PageNotFound404Component),
    },
];
