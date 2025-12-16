import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { SettingsService } from 'app/settings/settings.service';

@Pipe({
  name: 'dateArrayFormat',
})
export class DateArrayFormatPipe implements PipeTransform {

    constructor(private settingsService: SettingsService) {
      }

  transform(value: number[] | null | undefined, format: string = 'd MMMM y \'at\' HH:mm:ss', locale: string = 'en-US'): string {
    const defaultDateFormat = `${this.settingsService.dateFormat} 'at' HH:mm:ss`;
    if (!value || !Array.isArray(value) || value.length < 3) {
      return '';
    }

    const [year, month, day, hour = 0, minute = 0, second = 0] = value;

    // Create a JS Date object. 
    // IMPORTANT: Subtract 1 from the month because JS months are 0-11, 
    // but your input (11 for November) is likely 1-12.
    const dateObj = new Date(year, month - 1, day, hour, minute, second);

    // Use Angular's utility to format the date string
    const formatToUse = defaultDateFormat || format;
    return formatDate(dateObj, formatToUse, locale);
  }

}