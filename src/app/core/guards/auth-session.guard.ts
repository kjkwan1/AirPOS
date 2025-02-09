import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '@core/auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthSessionGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) { }

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (this.authService.isAuthenticated) {
      return true;
    }

    return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }
}