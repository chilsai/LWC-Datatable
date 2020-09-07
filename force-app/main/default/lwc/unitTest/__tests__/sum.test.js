import { sum } from '../sum';
  
describe('sum()', () => {
  it('should add 1 and 2 returning 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});