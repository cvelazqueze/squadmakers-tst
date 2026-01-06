const request = require('supertest');
const app = require('../../src/app');
const jokeService = require('../../src/services/jokeService');
const dbService = require('../../src/services/dbService');

jest.mock('../../src/services/jokeService');
jest.mock('../../src/services/dbService');

describe('JokeController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /chistes', () => {
    it('should return random joke when no source specified', async () => {
      jokeService.getRandomJoke.mockResolvedValue('Random joke');

      const response = await request(app)
        .get('/chistes')
        .expect(200);

      expect(response.body).toHaveProperty('joke');
      expect(response.body).toHaveProperty('source');
    });

    it('should return Chuck Norris joke when source is Chuck', async () => {
      jokeService.getRandomJoke.mockResolvedValue('Chuck Norris joke');

      const response = await request(app)
        .get('/chistes/Chuck')
        .expect(200);

      expect(response.body.joke).toBe('Chuck Norris joke');
      expect(response.body.source).toBe('Chuck');
    });

    it('should return Dad joke when source is Dad', async () => {
      jokeService.getRandomJoke.mockResolvedValue('Dad joke');

      const response = await request(app)
        .get('/chistes/Dad')
        .expect(200);

      expect(response.body.joke).toBe('Dad joke');
      expect(response.body.source).toBe('Dad');
    });

    it('should return 400 for invalid source', async () => {
      const response = await request(app)
        .get('/chistes/Invalid')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /chistes', () => {
    it('should save a joke with user and theme', async () => {
      const mockJoke = { 
        id: 1, 
        text: 'Test joke',
        user: { id: 1, name: 'Manolito' },
        theme: { id: 1, name: 'humor negro' }
      };
      dbService.saveJoke.mockResolvedValue(mockJoke);

      const response = await request(app)
        .post('/chistes')
        .send({ 
          text: 'Test joke',
          usuario: 'Manolito',
          tematica: 'humor negro'
        })
        .expect(201);

      expect(response.body).toEqual(mockJoke);
      expect(dbService.saveJoke).toHaveBeenCalledWith('Test joke', 'Manolito', 'humor negro');
    });

    it('should return 400 if text is missing', async () => {
      const response = await request(app)
        .post('/chistes')
        .send({ usuario: 'Manolito', tematica: 'humor negro' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if usuario is missing', async () => {
      const response = await request(app)
        .post('/chistes')
        .send({ text: 'Test joke', tematica: 'humor negro' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if tematica is missing', async () => {
      const response = await request(app)
        .post('/chistes')
        .send({ text: 'Test joke', usuario: 'Manolito' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /chistes/:number', () => {
    it('should update a joke', async () => {
      const mockJoke = { id: 1, text: 'Updated joke' };
      dbService.updateJoke.mockResolvedValue(mockJoke);

      const response = await request(app)
        .put('/chistes/1')
        .send({ text: 'Updated joke' })
        .expect(200);

      expect(response.body).toEqual(mockJoke);
      expect(dbService.updateJoke).toHaveBeenCalledWith(1, 'Updated joke');
    });

    it('should return 404 if joke not found', async () => {
      dbService.updateJoke.mockRejectedValue(new Error('Joke with ID 999 not found'));

      const response = await request(app)
        .put('/chistes/999')
        .send({ text: 'Updated joke' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /chistes/:number', () => {
    it('should delete a joke', async () => {
      const mockResult = { id: 1, deleted: true };
      dbService.deleteJoke.mockResolvedValue(mockResult);

      const response = await request(app)
        .delete('/chistes/1')
        .expect(200);

      expect(response.body).toEqual(mockResult);
      expect(dbService.deleteJoke).toHaveBeenCalledWith(1);
    });

    it('should return 404 if joke not found', async () => {
      dbService.deleteJoke.mockRejectedValue(new Error('Joke with ID 999 not found'));

      const response = await request(app)
        .delete('/chistes/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /chistes/emparejados', () => {
    it('should return paired jokes', async () => {
      const mockPairedJokes = [
        {
          chuck: 'Chuck joke 1',
          dad: 'Dad joke 1',
          combinado: 'Chuck joke 1 Also, dad joke 1'
        }
      ];
      jokeService.getPairedJokes.mockResolvedValue(mockPairedJokes);

      const response = await request(app)
        .get('/chistes/emparejados')
        .expect(200);

      expect(response.body).toEqual(mockPairedJokes);
    });
  });
});
