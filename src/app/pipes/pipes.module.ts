import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusLookupPipe } from './status-lookup.pipe';
import { AccountsFilterPipe } from './accounts-filter.pipe';
import { ChargesFilterPipe } from './charges-filter.pipe';
import { ChargesPenaltyFilterPipe } from './charges-penalty-filter.pipe';
import { FindPipe } from './find.pipe';
import { UrlToStringPipe } from './url-to-string.pipe';
import { DateFormatPipe } from './date-format.pipe';
import { TranslatePipe } from './translate.pipe';
import { DateArrayFormatPipe } from './date-array-format.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    StatusLookupPipe,
    AccountsFilterPipe,
    ChargesFilterPipe,
    ChargesPenaltyFilterPipe,
    FindPipe,
    UrlToStringPipe,
    DateFormatPipe,
    DateArrayFormatPipe,
    TranslatePipe,
  ],
  providers: [
    StatusLookupPipe,
    AccountsFilterPipe,
    ChargesFilterPipe,
    ChargesPenaltyFilterPipe,
    FindPipe,
    UrlToStringPipe,
    DateFormatPipe,
    DateArrayFormatPipe,
    TranslatePipe,
  ],
  exports: [
    StatusLookupPipe,
    AccountsFilterPipe,
    ChargesFilterPipe,
    ChargesPenaltyFilterPipe,
    FindPipe,
    UrlToStringPipe,
    DateFormatPipe,
    DateArrayFormatPipe,
    TranslatePipe,
  ],
})
export class PipesModule {}
