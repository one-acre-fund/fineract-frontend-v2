import { createCsvContent, getStatusChipClass } from './group-removal-impact-requests.utils';

describe('GroupRemovalImpactRequestsUtils', () => {
  it('should map status to chip classes', () => {
    expect(getStatusChipClass('PENDING')).toBe('status-chip status-pending');
    expect(getStatusChipClass('APPROVED')).toBe('status-chip status-approved');
    expect(getStatusChipClass('REJECTED')).toBe('status-chip status-rejected');
  });

  it('should generate csv with union headers and escaped values', () => {
    const csv = createCsvContent([
      { a: 'value,1', b: '"quote"', c: null },
      { b: 'line\nbreak', d: 10 },
    ]);

    expect(csv.split('\n')[0]).toBe('a,b,c,d');
    expect(csv).toContain('"value,1"');
    expect(csv).toContain('"""quote"""');
    expect(csv).toContain('"line\nbreak"');
  });
});
