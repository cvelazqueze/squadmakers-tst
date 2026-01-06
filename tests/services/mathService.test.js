const mathService = require('../../src/services/mathService');

describe('MathService', () => {
  describe('gcd', () => {
    it('should calculate GCD correctly', () => {
      expect(mathService.gcd(48, 18)).toBe(6);
      expect(mathService.gcd(17, 13)).toBe(1);
      expect(mathService.gcd(100, 25)).toBe(25);
    });
  });

  describe('lcmTwo', () => {
    it('should calculate LCM of two numbers', () => {
      expect(mathService.lcmTwo(4, 6)).toBe(12);
      expect(mathService.lcmTwo(5, 7)).toBe(35);
      expect(mathService.lcmTwo(12, 18)).toBe(36);
    });
  });

  describe('calculateLCM', () => {
    it('should calculate LCM of an array of numbers', () => {
      expect(mathService.calculateLCM([4, 6])).toBe(12);
      expect(mathService.calculateLCM([2, 3, 4])).toBe(12);
      expect(mathService.calculateLCM([5, 10, 15])).toBe(30);
      expect(mathService.calculateLCM([3, 5, 7])).toBe(105);
    });

    it('should return the number itself for single element array', () => {
      expect(mathService.calculateLCM([5])).toBe(5);
    });

    it('should throw error for empty array', () => {
      expect(() => mathService.calculateLCM([])).toThrow('Numbers must be a non-empty array');
    });

    it('should throw error for non-array input', () => {
      expect(() => mathService.calculateLCM('not an array')).toThrow('Numbers must be a non-empty array');
    });

    it('should throw error for non-integer numbers', () => {
      expect(() => mathService.calculateLCM([1.5, 2])).toThrow('All numbers must be positive integers');
    });

    it('should throw error for negative numbers', () => {
      expect(() => mathService.calculateLCM([-1, 2])).toThrow('All numbers must be positive integers');
    });

    it('should throw error for zero', () => {
      expect(() => mathService.calculateLCM([0, 2])).toThrow('All numbers must be positive integers');
    });
  });

  describe('addOne', () => {
    it('should add 1 to a number', () => {
      expect(mathService.addOne(5)).toBe(6);
      expect(mathService.addOne(0)).toBe(1);
      expect(mathService.addOne(-5)).toBe(-4);
      expect(mathService.addOne(100)).toBe(101);
    });

    it('should throw error for non-integer', () => {
      expect(() => mathService.addOne(5.5)).toThrow('Number must be an integer');
      expect(() => mathService.addOne('5')).toThrow('Number must be an integer');
    });
  });
});
