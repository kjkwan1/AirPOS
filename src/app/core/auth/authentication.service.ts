import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _authenticated = new BehaviorSubject(false);

  constructor() {
    const authInfo = localStorage.getItem('auth');

    if (!authInfo) {
      return;
    }
    
    const item = JSON.parse(authInfo);
    const now = new Date();

    if (now.getTime() < item.expires) {
      this._authenticated.next(true);
    } else {
      localStorage.removeItem('auth');
    }
  }

  get isAuthenticated$() {
    return this._authenticated.asObservable();
  }

  get isAuthenticated() {
    return this._authenticated.getValue();
  }

  public async authenticate(email: string, password: string): Promise<boolean> {
    await this.signIn({ username: email, password });
    const authInfo = {
      expires: new Date().getTime() + (24  * 60 * 70 * 1000),
      sessionId: Symbol
    };

    localStorage.setItem('auth', JSON.stringify(authInfo));
    this._authenticated.next(true);
    return true;
  }

  private signIn(deets: any) {
    return new Promise((resolve) => setTimeout(resolve, 1200));
  }

  public logout(): Promise<boolean> {
    this._authenticated.next(false);
    return Promise.resolve(true);
  }
}
