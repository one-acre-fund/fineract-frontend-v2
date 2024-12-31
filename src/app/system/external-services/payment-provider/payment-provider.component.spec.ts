import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentProviderComponent } from './payment-provider.component';

describe('PaymentProviderComponent', () => {
  let component: PaymentProviderComponent;
  let fixture: ComponentFixture<PaymentProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentProviderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
