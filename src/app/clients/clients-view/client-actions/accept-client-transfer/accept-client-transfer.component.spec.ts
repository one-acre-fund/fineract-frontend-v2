import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { of, Subject } from 'rxjs';

import { ClientsService } from 'app/clients/clients.service';
import { Dates } from 'app/core/utils/dates';
import { SettingsService } from 'app/settings/settings.service';
import { AcceptClientTransferComponent } from './accept-client-transfer.component';

describe('AcceptClientTransferComponent', () => {
  let component: AcceptClientTransferComponent;
  let clientsService: jasmine.SpyObj<ClientsService>;
  let response: Subject<object>;

  beforeEach(() => {
    clientsService = jasmine.createSpyObj('ClientsService', ['executeClientCommand', 'redirectToClient']);
    response = new Subject<object>();
    clientsService.executeClientCommand.and.returnValue(response);
    TestBed.configureTestingModule({
      providers: [
        AcceptClientTransferComponent,
        UntypedFormBuilder,
        { provide: ClientsService, useValue: clientsService },
        { provide: Dates, useValue: jasmine.createSpyObj('Dates', ['formatDate']) },
        { provide: SettingsService, useValue: { language: { code: 'en' }, dateFormat: 'dd MMMM yyyy' } },
        { provide: ActivatedRoute, useValue: {
          data: of({ clientActionData: '2026-11-17' }),
          parent: { snapshot: { params: { clientId: '42' } } }
        } },
        { provide: Router, useValue: {} },
        { provide: MatomoTracker, useValue: jasmine.createSpyObj('MatomoTracker', ['trackEvent']) }
      ]
    });
    component = TestBed.inject(AcceptClientTransferComponent);
    component.ngOnInit();
  });

  afterEach(() => {
    response.complete();
  });

  it('keeps the existing proposal date read-only', () => {
    expect(component.acceptClientTransferForm.controls.transferDate.disabled).toBe(true);
    expect(component.acceptClientTransferForm.controls.transferDate.value).toEqual(new Date('2026-11-17'));
  });

  ['', 'Accept existing transfer'].forEach(note => {
    it(`accepts a legacy transfer with note "${note}" and redirects only on success`, () => {
      component.acceptClientTransferForm.patchValue({ note });

      component.submit();

      expect(clientsService.executeClientCommand).toHaveBeenCalledTimes(1);
      expect(clientsService.executeClientCommand).toHaveBeenCalledWith('42', 'acceptTransfer', { note });
      expect(clientsService.redirectToClient).not.toHaveBeenCalled();

      response.next({});

      expect(clientsService.redirectToClient).toHaveBeenCalledWith('42');
    });
  });

  it('does not redirect without a successful response', () => {
    component.submit();
    response.complete();

    expect(clientsService.redirectToClient).not.toHaveBeenCalled();
  });

  it('surfaces a failed legacy acceptance without redirecting', fakeAsync(() => {
    const error = new Error('Acceptance failed');

    component.submit();
    response.error(error);

    expect(() => tick()).toThrow(error);
    expect(clientsService.redirectToClient).not.toHaveBeenCalled();
  }));
});
