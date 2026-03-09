import { FormControl, FormGroup, Validators } from '@angular/forms';
import { hasRequiredValidator } from './external-service.model';

describe('external-service.model', () => {
  it('hasRequiredValidator should return true when control has required validator', () => {
    const form = new FormGroup({
      name: new FormControl('', Validators.required),
    });

    expect(hasRequiredValidator(form, 'name')).toBe(true);
  });

  it('hasRequiredValidator should return false when control does not have required validator', () => {
    const form = new FormGroup({
      name: new FormControl(''),
    });

    expect(hasRequiredValidator(form, 'name')).toBe(false);
  });
});
