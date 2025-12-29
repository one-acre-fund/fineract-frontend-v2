import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from 'app/organization/organization.service';
import { CountryTreeViewComponent } from 'app/shared/country-tree-view/country-tree-view.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mifosx-create-or-update-country-consent',
  templateUrl: './create-or-update-country-consent.component.html',
  styleUrls: ['./create-or-update-country-consent.component.scss']
})
export class CreateOrUpdateCountryConsentComponent implements OnInit {

    consentMessageToEdit: any;
    consentMessageToEditId: any;
    isSubmitting = false;
    previewHtml: SafeHtml = '';
    formattedHtml: string = '';
    showPreview = false;
    categories: any[] = [];

    editorModules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link']
      ]
    };
    private readonly destroy$ = new Subject<void>();
  
    constructor(
      private formBuilder: UntypedFormBuilder,
      private organizationService: OrganizationService,
      private sanitizer: DomSanitizer,
      private router: Router,
      private route: ActivatedRoute,
    ) { 
      this.getCountries();
      this.getConsentCategories();
      this.route.data
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: { consentMessage: any }) => {
        this.consentMessageToEdit = data.consentMessage;
      });
    }
  
    listCountries: any = [];
      consentForm: UntypedFormGroup;
      treeDataSource: any = [];
      @ViewChild(CountryTreeViewComponent) countryTreeComponent: CountryTreeViewComponent;
    
      ngOnInit(): void {
        this.consentForm = this.formBuilder.group({
          countryId: [null, Validators.required],
          consentName: ['', Validators.required],
          category: [null, Validators.required],
          consentMessage: ['', Validators.required],
        });
        if (this.consentMessageToEdit) {
          this.consentMessageToEditId = this.consentMessageToEdit.id;
          this.populateFormForEdit();
        }
      }
      
  populateFormForEdit() {
    if (this.consentMessageToEdit) {
      this.consentForm.patchValue({
        countryId: this.consentMessageToEdit.countryId,
        consentName: this.consentMessageToEdit.consentName,
        category: this.consentMessageToEdit.categoryValue,
        consentMessage: this.consentMessageToEdit.consentMessage,
      });
    }
  }

      togglePreview(action: string): void {
      this.showPreview = 'preview' === action;
      if (this.showPreview) {
        const html = this.consentForm.get('consentMessage')?.value;
        this.previewHtml = this.sanitizer.bypassSecurityTrustHtml(html) || '';
        this.formattedHtml = this.formatHtml(html);
      }
    }
  
    private formatHtml(html: string): string {
      if (!html) return '';
      
      // Simple formatting - add line breaks and indentation
      let formatted = html
        .replace(/></g, '>\n<')  // Add line breaks between tags
        .replace(/<(\w+)([^>]*)>/g, '<$1$2>')  // Keep opening tags
        .replace(/<\/(\w+)>/g, '</$1>\n');  // Add line break after closing tags
      
      // Add indentation
      let indent = 0;
      const lines = formatted.split('\n');
      formatted = lines.map(line => {
        line = line.trim();
        if (!line) return '';
        
        // Decrease indent for closing tags
        if (line.startsWith('</')) {
          indent = Math.max(0, indent - 2);
        }
        
        const indentedLine = ' '.repeat(indent) + line;
        
        // Increase indent for opening tags (but not self-closing)
        if (line.startsWith('<') && !line.startsWith('</') && !line.endsWith('/>')) {
          indent += 2;
        }
        
        return indentedLine;
      }).join('\n');
      
      return formatted;
    }
    
      getCountries() {
        this.organizationService.getCountries()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.listCountries = res;
        });
      }

      getConsentCategories() {
        this.organizationService.getCountryConsentMessageCategories()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.categories = res;
        });
      }
  
      search(event: any) {
         console.log('Search event:', event);
        }

        private convertQuillClassesToInlineStyles(html: string): string {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          // Convert alignment classes
          doc.querySelectorAll('.ql-align-center').forEach(el => {
            (el as HTMLElement).style.textAlign = 'center';
            el.classList.remove('ql-align-center');
          });
          
          doc.querySelectorAll('.ql-align-right').forEach(el => {
            (el as HTMLElement).style.textAlign = 'right';
            el.classList.remove('ql-align-right');
          });
          
          doc.querySelectorAll('.ql-align-left').forEach(el => {
            (el as HTMLElement).style.textAlign = 'left';
            el.classList.remove('ql-align-left');
          });
          
          doc.querySelectorAll('.ql-align-justify').forEach(el => {
            (el as HTMLElement).style.textAlign = 'justify';
            el.classList.remove('ql-align-justify');
          });
          
          // Convert indent classes
          for (let i = 1; i <= 8; i++) {
            doc.querySelectorAll(`.ql-indent-${i}`).forEach(el => {
              (el as HTMLElement).style.paddingLeft = `${i * 3}em`;
              el.classList.remove(`ql-indent-${i}`);
            });
          }
          
          return doc.body.innerHTML;
        }
  
        submit() {
          const consentFormData = this.consentForm.value;
          // Convert Quill classes to inline styles
          let htmlContent = consentFormData.consentMessage;
          htmlContent = this.convertQuillClassesToInlineStyles(htmlContent);
          let bgColor = 'white';
          const finalHtml = `<div style="background-color: ${bgColor}; padding: 20px;">${htmlContent}</div>`;
          const payload = {
            countryId: consentFormData.countryId,
            consentName: consentFormData.consentName,
            category: consentFormData.category,
            consentMessage: finalHtml
          };
  
          if (this.consentMessageToEditId) {
            this.organizationService.updateCountryConsentMessage(this.consentMessageToEditId, payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe((resp) => {
              this.router.navigate(['../'], { relativeTo: this.route });
            });
            return;
          }
          this.organizationService.createCountryConsentMessage(payload)
          .pipe(takeUntil(this.destroy$))
          .subscribe((resp) => {
            this.router.navigate(['../'], { relativeTo: this.route });
          });
        }
  
        ngOnDestroy(): void {
          this.destroy$.next();
          this.destroy$.complete();
        }
}
