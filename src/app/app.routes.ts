import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';


export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login').then
                (m => m.Login)
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./layout/main-layout/main-layout').then
                (m => m.MainLayout),
        children: [
            {
                path: 'products',
                loadComponent: () =>
                    import('./features/products/product-list/product-list').then
                        (m => m.ProductList)
            },
            {
                path: 'products/:id',
                loadComponent: () =>
                    import('./features/product-detail/product-detail/product-detail').then(m => m.ProductDetail)
            },
            { path: '', redirectTo: 'products', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'login' }

];
