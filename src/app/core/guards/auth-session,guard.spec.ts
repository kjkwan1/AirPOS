import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AuthSessionGuard } from './auth-session.guard';

describe('AuthSessionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => AuthSessionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
