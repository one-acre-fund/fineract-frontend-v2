/** Angular Imports */
import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Custom file upload component based on angular material.
 */
@Component({
  selector: 'mifosx-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  /** Form field flex dimension */
  @Input() flex: any;
  /** Selected file name */
  fileName: string = '';

  constructor() { }

  /**
   * Sets the file name.
   * @param {any} event File input change event.
   */
  onFileSelect($event: any) {
    const file = $event?.target?.files && $event.target.files.length > 0 ? $event.target.files[0] : null;
    this.fileName = file ? file.name : '';
  }

}
