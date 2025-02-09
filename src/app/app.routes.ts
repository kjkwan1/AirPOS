import { Routes } from '@angular/router';
import { AuthSessionGuard } from '@core/guards/auth-session.guard';
import { AuthenticationComponent } from '@features/authentication/authentication.component';
import { OrderEntryComponent } from '@features/order-entry/order-entry.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'login',
        component: AuthenticationComponent,
    },
    {
        path: 'order-entry',
        component: OrderEntryComponent,
        canActivate: [AuthSessionGuard]
    }
];
