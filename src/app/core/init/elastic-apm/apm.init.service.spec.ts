import { TestBed } from '@angular/core/testing';

import { ApmInitService } from './apm.init.service';

describe('ApmInitService', () => {
  let service: ApmInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApmInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
