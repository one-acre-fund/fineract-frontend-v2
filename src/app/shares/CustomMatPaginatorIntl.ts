import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  constructor(private translate: TranslateService) {
    super();
    this.getAndSetTranslations();
    this.translate.onLangChange.subscribe(() => this.getAndSetTranslations());
  }

  getAndSetTranslations() {
    this.itemsPerPageLabel = this.translate.instant('labels.oaf.ItemsPerPage');
    this.nextPageLabel = this.translate.instant('labels.oaf.NextPage');
    this.previousPageLabel = this.translate.instant('labels.oaf.PreviousPage');
    this.firstPageLabel = this.translate.instant('labels.oaf.FirstPage');
    this.lastPageLabel = this.translate.instant('labels.oaf.LastPage');
     this.changes.next(); 
  }
}
