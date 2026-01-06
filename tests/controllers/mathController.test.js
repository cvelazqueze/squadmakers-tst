const request = require('supertest');
const app = require('../../src/app');
const mathService = require('../../src/services/mathService');

jest.mock('../../src/services/mathService');

describe('MathController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /matematico?numbers=...', () => {
    it('should calculate LCM', async () => {
      mathService.calculateLCM.mockReturnValue(12);

      const response = await request(app)
        .get('/matematico?numbers=4,6')
        .expect(200);

      expect(response.body).toHaveProperty('lcm', 12);
      expect(response.body).toHaveProperty('numbers');
      expect(mathService.calculateLCM).toHaveBeenCalledWith(['4', '6']);
    });

    it('should return 400 if numbers parameter is missing', async () => {
      const response = await request(app)
        .get('/matematico')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /matematico?number=...', () => {
    it('should add 1 to number', async () => {
      mathService.addOne.mockReturnValue(6);

      const response = await request(app)
        .get('/matematico?number=5')
        .expect(200);

      expect(response.body).toHaveProperty('result', 6);
      expect(response.body).toHaveProperty('number', 5);
      expect(mathService.addOne).toHaveBeenCalledWith('5');
    });

    it('should return 400 if number parameter is missing', async () => {
      const response = await request(app)
        .get('/matematico')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});
