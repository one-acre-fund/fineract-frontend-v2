import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder } from '@angular/forms';

import { OrganizationService } from '../../organization.service';
import { ProductsService } from 'app/products/products.service';
import { BaseExportDownloadComponent } from '../base-export-download.class';

@Component({
  selector: 'mifosx-non-pickers-download',
  templateUrl: './non-pickers-download.component.html',
  styleUrls: ['./non-pickers-download.component.scss']
})
export class NonPickersDownloadComponent extends BaseExportDownloadComponent {
  readonly exportType = 'nonPickers';

  constructor(
    route: ActivatedRoute,
    formBuilder: UntypedFormBuilder,
    organizationService: OrganizationService,
    productsService: ProductsService
  ) {
    super(route, formBuilder, organizationService, productsService);
  }
}
