import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAuthenticationComponent } from './company-authentication.component';

describe('CompanyAuthenticationComponent', () => {
  let component: CompanyAuthenticationComponent;
  let fixture: ComponentFixture<CompanyAuthenticationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyAuthenticationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
