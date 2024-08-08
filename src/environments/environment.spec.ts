import { environment } from './environment';

describe('Environment Configuration', () => {
  
    it('should have the correct loan submit button timeout in seconds', () => {
      expect(environment.loanSubmitButtonDisabledTimeOut).toBe(5);
    });
  
  
  });