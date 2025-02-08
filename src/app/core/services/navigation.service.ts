import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

type NavigationRoute = 'order-entry';
@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  public navigateToOrderEntry(): Promise<boolean> {
    return this.navigate('order-entry');
  }

  private navigate(...routes: NavigationRoute[]): Promise<boolean> {
    return this.router.navigate([routes.join('/')], { queryParams: { }});
  }
}
