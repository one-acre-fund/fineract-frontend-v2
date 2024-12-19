import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaymentProviderComponent } from './edit-payment-provider.component';

describe('EditPaymentProviderComponent', () => {
  let component: EditPaymentProviderComponent;
  let fixture: ComponentFixture<EditPaymentProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPaymentProviderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPaymentProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
