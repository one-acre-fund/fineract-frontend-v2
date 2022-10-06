import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  ActivatedRoute,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { OrganizationService } from '../organization.service';

@Injectable({
  providedIn: 'root'
})
export class EditRetailOutletResolver implements Resolve<object> {
  constructor(private organizationService: OrganizationService,private route:ActivatedRoute) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    debugger
    const retailOutletId  = route.paramMap.get('id');
    return this.organizationService.getRuralOutletByOutletId(retailOutletId);
  }
}
