import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { of, Subject } from 'rxjs';

import { ClientsService } from 'app/clients/clients.service';
import { Dates } from 'app/core/utils/dates';
import { SettingsService } from 'app/settings/settings.service';
import { TransferClientComponent } from './transfer-client.component';

describe('TransferClientComponent', () => {
  let component: TransferClientComponent;
  let clientsService: jasmine.SpyObj<ClientsService>;
  let dateUtils: jasmine.SpyObj<Dates>;
  let tracker: jasmine.SpyObj<MatomoTracker>;
  let response: Subject<object>;

  beforeEach(() => {
    clientsService = jasmine.createSpyObj('ClientsService', ['executeClientCommand', 'redirectToClient']);
    dateUtils = jasmine.createSpyObj('Dates', ['formatDate']);
    tracker = jasmine.createSpyObj('MatomoTracker', ['setDocumentTitle', 'trackEvent']);
    response = new Subject<object>();
    clientsService.executeClientCommand.and.returnValue(response);
    dateUtils.formatDate.and.returnValue('17 November 2026');
    TestBed.configureTestingModule({
      providers: [
        TransferClientComponent,
        UntypedFormBuilder,
        { provide: ClientsService, useValue: clientsService },
        { provide: Dates, useValue: dateUtils },
        { provide: SettingsService, useValue: { language: { code: 'en' }, dateFormat: 'dd MMMM yyyy' } },
        { provide: ActivatedRoute, useValue: {
          data: of({ clientActionData: [{ id: 2, officeHierarchyPath: 'Head Office / Branch' }] }),
          parent: { snapshot: { params: { clientId: '42' } } }
        } },
        { provide: Router, useValue: {} },
        { provide: MatomoTracker, useValue: tracker }
      ]
    });
    component = TestBed.inject(TransferClientComponent);
    component.ngOnInit();
  });

  afterEach(() => {
    response.complete();
  });

  it('requires an office and transfer date, but not a note', () => {
    expect(component.transferClientForm.valid).toBe(false);
    component.transferClientForm.patchValue({ destinationOfficeId: 2 });
    expect(component.transferClientForm.valid).toBe(false);
    component.transferClientForm.patchValue({ destinationOfficeId: '', transferDate: new Date(2026, 10, 17) });
    expect(component.transferClientForm.valid).toBe(false);
    component.transferClientForm.patchValue({ destinationOfficeId: 2 });
    expect(component.transferClientForm.valid).toBe(true);
  });

  it('proposes and accepts in one command with the existing payload and redirects only on success', () => {
    const transferDate = new Date(2026, 10, 17);
    component.transferClientForm.setValue({ destinationOfficeId: 2, transferDate, note: 'Move to branch' });

    component.submit();

    expect(dateUtils.formatDate).toHaveBeenCalledWith(transferDate, 'dd MMMM yyyy');
    expect(clientsService.executeClientCommand).toHaveBeenCalledTimes(1);
    expect(clientsService.executeClientCommand).toHaveBeenCalledWith('42', 'proposeAndAcceptTransfer', {
      destinationOfficeId: 2,
      transferDate: '17 November 2026',
      note: 'Move to branch',
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    });
    expect(tracker.trackEvent).toHaveBeenCalledWith('clients', 'proposeAndAcceptTransfer', '42');
    expect(clientsService.redirectToClient).not.toHaveBeenCalled();

    response.next({});

    expect(clientsService.redirectToClient).toHaveBeenCalledWith('42');
  });

  it('preserves an already formatted date and an empty note', () => {
    component.transferClientForm.setValue({ destinationOfficeId: 2, transferDate: '17 November 2026', note: '' });

    component.submit();
    response.complete();

    expect(dateUtils.formatDate).not.toHaveBeenCalled();
    expect(clientsService.executeClientCommand).toHaveBeenCalledWith('42', 'proposeAndAcceptTransfer', {
      destinationOfficeId: 2,
      transferDate: '17 November 2026',
      note: '',
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    });
    expect(clientsService.redirectToClient).not.toHaveBeenCalled();
  });

  it('surfaces a failed transfer without redirecting', fakeAsync(() => {
    component.transferClientForm.setValue({
      destinationOfficeId: 2, transferDate: new Date(2026, 10, 17), note: ''
    });
    const error = new Error('Transfer failed');

    component.submit();
    response.error(error);

    expect(() => tick()).toThrow(error);
    expect(clientsService.redirectToClient).not.toHaveBeenCalled();
  }));
});
