import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrderIntegrationComponent } from './edit-order-integration.component';

describe('EditOrderIntegrationComponent', () => {
  let component: EditOrderIntegrationComponent;
  let fixture: ComponentFixture<EditOrderIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOrderIntegrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOrderIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
