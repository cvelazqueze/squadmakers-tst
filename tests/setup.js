// Test setup file
// Mock Sequelize models for tests
jest.mock('../src/models', () => {
  const mockUser = {
    findOrCreate: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn()
  };

  const mockTheme = {
    findOrCreate: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn()
  };

  const mockJoke = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOrCreate: jest.fn()
  };

  return {
    User: mockUser,
    Theme: mockTheme,
    Joke: mockJoke,
    initDatabase: jest.fn(() => Promise.resolve()),
    sequelize: {
      sync: jest.fn(() => Promise.resolve()),
      authenticate: jest.fn(() => Promise.resolve())
    }
  };
});
