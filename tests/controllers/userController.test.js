const request = require('supertest');
const app = require('../../src/app');
const dbService = require('../../src/services/dbService');

jest.mock('../../src/services/dbService');

describe('UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /usuarios', () => {
    it('should create a new user', async () => {
      const mockUser = { id: 5, name: 'NuevoUsuario', created: true };
      dbService.createOrGetUser.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/usuarios')
        .send({ name: 'NuevoUsuario' })
        .expect(201);

      expect(response.body).toEqual(mockUser);
      expect(dbService.createOrGetUser).toHaveBeenCalledWith('NuevoUsuario');
    });

    it('should return existing user if already exists', async () => {
      const mockUser = { id: 1, name: 'Manolito', created: false };
      dbService.createOrGetUser.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/usuarios')
        .send({ name: 'Manolito' })
        .expect(200);

      expect(response.body).toEqual(mockUser);
      expect(response.body.created).toBe(false);
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/usuarios')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /usuarios', () => {
    it('should get all users', async () => {
      const mockUsers = [
        { id: 1, name: 'Manolito' },
        { id: 2, name: 'Pepe' }
      ];
      dbService.getAllUsers.mockResolvedValue(mockUsers);

      const response = await request(app)
        .get('/usuarios')
        .expect(200);

      expect(response.body).toHaveProperty('count', 2);
      expect(response.body).toHaveProperty('users', mockUsers);
    });
  });
});
