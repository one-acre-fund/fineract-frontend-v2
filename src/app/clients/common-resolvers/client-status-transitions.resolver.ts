/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { ClientsService } from '../clients.service';

/**
 * Client status transitions resolver.
 */
@Injectable()
export class ClientStatusTransitionsResolver implements Resolve<Object> {

  /**
   * @param {ClientsService} clientsService Clients service.
   */
  constructor(private clientsService: ClientsService) { }

  /**
   * Returns the Client's status transitions.
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const clientId = route.parent.paramMap.get('clientId');
    return this.clientsService.getClientStatusTransitions(clientId, 0, 50, 'statusChangedOn', 'DESC');
  }

}
