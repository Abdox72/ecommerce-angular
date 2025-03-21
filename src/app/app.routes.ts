import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '' ,
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
                path: 'cart',
                loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent)
            },
            {
                path: 'wishlist',
                loadComponent: () => import('./components/wishlist/wishlist.component').then(m => m.WishlistComponent)
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
    }
];
