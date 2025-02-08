import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteAuthenticationComponent } from './site-authentication.component';

describe('SiteAuthenticationComponent', () => {
  let component: SiteAuthenticationComponent;
  let fixture: ComponentFixture<SiteAuthenticationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteAuthenticationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
