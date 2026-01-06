const jokeService = require('../../src/services/jokeService');
const axios = require('axios');

jest.mock('axios');

describe('JokeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getChuckNorrisJoke', () => {
    it('should fetch a Chuck Norris joke', async () => {
      const mockJoke = { value: 'Chuck Norris can divide by zero.' };
      axios.get.mockResolvedValue({ data: mockJoke });

      const result = await jokeService.getChuckNorrisJoke();

      expect(result).toBe(mockJoke.value);
      expect(axios.get).toHaveBeenCalledWith('https://api.chucknorris.io/jokes/random');
    });

    it('should throw error on API failure', async () => {
      axios.get.mockRejectedValue(new Error('Network error'));

      await expect(jokeService.getChuckNorrisJoke()).rejects.toThrow('Failed to fetch Chuck Norris joke');
    });
  });

  describe('getDadJoke', () => {
    it('should fetch a Dad joke', async () => {
      const mockJoke = { joke: 'Why did the math book look sad? Because it had too many problems.' };
      axios.get.mockResolvedValue({ data: mockJoke });

      const result = await jokeService.getDadJoke();

      expect(result).toBe(mockJoke.joke);
      expect(axios.get).toHaveBeenCalledWith('https://icanhazdadjoke.com/', {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SquadMakers Jokes API'
        }
      });
    });

    it('should throw error on API failure', async () => {
      axios.get.mockRejectedValue(new Error('Network error'));

      await expect(jokeService.getDadJoke()).rejects.toThrow('Failed to fetch Dad joke');
    });
  });

  describe('getRandomJoke', () => {
    it('should get Chuck Norris joke when source is Chuck', async () => {
      const mockJoke = { value: 'Chuck Norris joke' };
      axios.get.mockResolvedValue({ data: mockJoke });

      const result = await jokeService.getRandomJoke('Chuck');

      expect(result).toBe(mockJoke.value);
    });

    it('should get Dad joke when source is Dad', async () => {
      const mockJoke = { joke: 'Dad joke' };
      axios.get.mockResolvedValue({ data: mockJoke });

      const result = await jokeService.getRandomJoke('Dad');

      expect(result).toBe(mockJoke.joke);
    });

    it('should throw error for invalid source', async () => {
      await expect(jokeService.getRandomJoke('Invalid')).rejects.toThrow('Invalid source');
    });
  });

  describe('getPairedJokes', () => {
    it('should fetch and pair 5 jokes from each API', async () => {
      const chuckJokes = Array(5).fill().map((_, i) => ({ value: `Chuck joke ${i + 1}` }));
      const dadJokes = Array(5).fill().map((_, i) => ({ joke: `Dad joke ${i + 1}` }));

      // Mock axios.get to return different jokes based on URL
      let chuckCallCount = 0;
      let dadCallCount = 0;
      axios.get.mockImplementation((url) => {
        if (url.includes('chucknorris')) {
          const joke = chuckJokes[chuckCallCount % 5];
          chuckCallCount++;
          return Promise.resolve({ data: joke });
        } else {
          const joke = dadJokes[dadCallCount % 5];
          dadCallCount++;
          return Promise.resolve({ data: joke });
        }
      });

      const result = await jokeService.getPairedJokes();

      expect(result).toHaveLength(5);
      expect(result[0]).toHaveProperty('chuck');
      expect(result[0]).toHaveProperty('dad');
      expect(result[0]).toHaveProperty('combinado');
      expect(result[0].combinado).toContain(result[0].chuck);
      expect(result[0].combinado).toContain(result[0].dad.toLowerCase());
    });

    it('should handle errors gracefully', async () => {
      axios.get.mockRejectedValue(new Error('Network error'));

      await expect(jokeService.getPairedJokes()).rejects.toThrow();
    });
  });
});
