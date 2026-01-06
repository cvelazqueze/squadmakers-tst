const request = require('supertest');
const app = require('../../src/app');
const dbService = require('../../src/services/dbService');

jest.mock('../../src/services/dbService');

describe('ThemeController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /tematicas', () => {
    it('should create a new theme', async () => {
      const mockTheme = { id: 4, name: 'nueva tematica', created: true };
      dbService.createOrGetTheme.mockResolvedValue(mockTheme);

      const response = await request(app)
        .post('/tematicas')
        .send({ name: 'nueva tematica' })
        .expect(201);

      expect(response.body).toEqual(mockTheme);
      expect(dbService.createOrGetTheme).toHaveBeenCalledWith('nueva tematica');
    });

    it('should return existing theme if already exists (upsert)', async () => {
      const mockTheme = { id: 1, name: 'humor negro', created: false };
      dbService.createOrGetTheme.mockResolvedValue(mockTheme);

      const response = await request(app)
        .post('/tematicas')
        .send({ name: 'humor negro' })
        .expect(200);

      expect(response.body).toEqual(mockTheme);
      expect(response.body.created).toBe(false);
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/tematicas')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /tematicas', () => {
    it('should get all themes', async () => {
      const mockThemes = [
        { id: 1, name: 'humor negro' },
        { id: 2, name: 'humor amarillo' }
      ];
      dbService.getAllThemes.mockResolvedValue(mockThemes);

      const response = await request(app)
        .get('/tematicas')
        .expect(200);

      expect(response.body).toHaveProperty('count', 2);
      expect(response.body).toHaveProperty('themes', mockThemes);
    });
  });
});
