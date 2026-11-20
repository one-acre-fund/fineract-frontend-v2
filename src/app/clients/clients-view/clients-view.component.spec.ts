import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { EMPTY, of } from 'rxjs';

import { ClientsService } from '../clients.service';
import { SystemService } from 'app/system/system.service';
import { ClientsViewComponent } from './clients-view.component';

@Pipe({ name: 'statusLookup' })
class StatusLookupPipeStub implements PipeTransform {
  transform(value: any) { return value; }
}

@Pipe({ name: 'dateFormat' })
class DateFormatPipeStub implements PipeTransform {
  transform(value: any) { return value; }
}

describe('ClientsViewComponent', () => {
  let component: ClientsViewComponent;
  let fixture: ComponentFixture<ClientsViewComponent>;
  let router: Router;
  let route: ActivatedRoute;
  let overlayContainer: OverlayContainer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientsViewComponent, StatusLookupPipeStub, DateFormatPipeStub],
      imports: [MatMenuModule, NoopAnimationsModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ClientsService, useValue: {
          getClientProfileImage: () => EMPTY,
          getKycFields: () => of([]),
          getClientQualificationData: () => of([])
        } },
        { provide: MatDialog, useValue: {} },
        { provide: MatomoTracker, useValue: { setDocumentTitle: () => {} } },
        { provide: SystemService, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    overlayContainer = TestBed.inject(OverlayContainer);
    Object.assign(route, {
      data: of({
        clientViewData: { id: 1, countryId: 2, status: { value: 'Active' } },
        clientDatatables: []
      })
    });
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    fixture = TestBed.createComponent(ClientsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function openActions(status: string): HTMLButtonElement[] {
    component.clientViewData.status.value = status;
    fixture.detectChanges();
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    buttons.find(button => button.textContent.trim() === 'labels.buttons.Actions').click();
    fixture.detectChanges();
    flush();
    return Array.from(overlayContainer.getContainerElement().querySelectorAll('button'));
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens the existing Accept Transfer route for a transfer in progress', fakeAsync(() => {
    const acceptButton = openActions('Transfer in progress')
      .find(button => button.textContent.trim() === 'labels.buttons.Accept Transfer');

    acceptButton.click();
    flush();

    expect(router.navigate).toHaveBeenCalledWith(['actions/Accept Transfer/2'], { relativeTo: route });
  }));

  ['Transfer in progress', 'Transfer on hold'].forEach(status => {
    it(`shows Undo Transfer and preserves Accept/Reject eligibility for ${status}`, fakeAsync(() => {
      const labels = openActions(status).map(button => button.textContent.trim());

      expect(labels).toContain('labels.buttons.Undo Transfer');
      expect(labels.includes('labels.buttons.Accept Transfer')).toBe(status === 'Transfer in progress');
      expect(labels.includes('labels.buttons.Reject transfer')).toBe(status === 'Transfer in progress');
    }));

    it(`opens the existing Undo Transfer route for ${status}`, fakeAsync(() => {
      const undoButton = openActions(status).find(button => button.textContent.trim() === 'labels.buttons.Undo Transfer');

      undoButton.click();
      flush();

      expect(router.navigate).toHaveBeenCalledWith(['actions/Undo Transfer/2'], { relativeTo: route });
    }));
  });

  ['Active', 'Pending', 'Closed', 'Rejected', 'Withdrawn'].forEach(status => {
    it(`hides all three transfer response actions for ${status}`, fakeAsync(() => {
      const labels = openActions(status).map(button => button.textContent.trim());

      expect(labels).not.toContain('labels.buttons.Undo Transfer');
      expect(labels).not.toContain('labels.buttons.Accept Transfer');
      expect(labels).not.toContain('labels.buttons.Reject transfer');
    }));
  });
});
