import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentProviderComponent } from './add-payment-provider.component';

describe('AddPaymentProviderComponent', () => {
  let component: AddPaymentProviderComponent;
  let fixture: ComponentFixture<AddPaymentProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPaymentProviderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPaymentProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
