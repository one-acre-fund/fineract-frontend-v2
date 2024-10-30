import { Injectable } from '@angular/core';
import { VERSION } from '@angular/core';
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
    const appName = environment.appName;
    const appVersion = VERSION.full; 
    const isProdEnv = environment.production; 

    return `${appName}/${appVersion} (Production Environment: ${isProdEnv})`;
  }

  getUserAgent(): string {
    return this.userAgent;
  }
}
