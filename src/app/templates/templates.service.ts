/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';

/**
 * Templates service.
 */
@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * @returns {Observable<any>} Templates data
   */
  getTemplates(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get('/templates', { params: httpParams });
  }

  /**
   * @param templateId Template ID.
   * @returns {Observable<any>} Fetches Template.
   */
  getTemplate(templateId: string): Observable<any> {
    return this.http.get(`/templates/${templateId}`);
  }

  /**
   * @returns {Observable<any>}.
   */
  getCreateTemplateData(): Observable<any> {
    return this.http.get('/templates/template');
  }

  /**
   * @param templateId Template Id.
   * @returns {Observable<any>}.
   */
  getEditTemplateData(templateId: string): Observable<any> {
    return this.http.get(`/templates/${templateId}/template`);
  }

  /**
   * @param templateData Template to be created.
   * @param templateId Template Id.
   * @returns {Observable<any>}.
   */
  createTemplate(templateData: any): Observable<any>  {
    return this.http.post(`/templates`, templateData);
  }

  /**
   * @param templateData Templete Data to be edited.
   * @param templateId Template Id.
   * @returns {Observable<any>}.
   */
  updateTemplate(templateData: any, templateId: any): Observable<any>  {
    return this.http.put(`/templates/${templateId}`, templateData);
  }

  /**
   * Call API to activate/deactivate a template by id
   * @param templateId
   * @returns
   */
  activateOrDeactivateTemplate(templateId: string, isActivate: boolean): Observable<any> {
    return this.http.post(`/templates/${templateId}/status`, { isActivate });
  }

  /**
   * @param templateId Template ID.
   * @returns {Observable<any>}
   */
  deleteTemplate(templateId: string): Observable<any> {
    return this.http.delete(`/templates/${templateId}`);
  }

}
