import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserAgentService {
  private userAgent: string;

  constructor() {
    this.userAgent = this.generateUserAgent();
  }

  private generateUserAgent(): string {
    return `${environment.appName}`;
  }

  getUserAgent(): string {
    return this.userAgent;
  }
}
