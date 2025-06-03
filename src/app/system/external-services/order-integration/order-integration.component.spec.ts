import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderIntegrationComponent } from './order-integration.component';

describe('OrderIntegrationComponent', () => {
  let component: OrderIntegrationComponent;
  let fixture: ComponentFixture<OrderIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderIntegrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
