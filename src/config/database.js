const { initDatabase, User, Theme, Joke } = require('../models');
const logger = require('../config/logger');

// Re-export initDatabase for backward compatibility
const initializeDatabase = async () => {
  return await initDatabase();
};

// Seed database with initial data using Sequelize
const seedDatabase = async () => {
  try {
    // Sample jokes for each theme
    const sampleJokes = {
      'humor negro': [
        '¿Soy guapa, cariño?". "¡Eres como el Sol! Duele mirarte.',
        '¿Qué le dice un sepulturero a otro? ¿Te gusta mi trabajo? Es la muerte.',
        'Mi esposa lleva desaparecida durante dos semanas. La policía dijo que debía prepararme para lo peor. Así que le dije a mi nueva novia que era mejor que se fuera de casa',
      ],
      'humor amarillo': [
        '¿Por qué los pájaros vuelan hacia el sur en invierno? Porque caminando tardarían mucho más.',
        '¿Qué hace un pez? Nada.',
        '¿Cuál es el café más malo del mundo? El que le pega a los cafes buenos.'
      ],
      'chistes verdes': [
        '¿Qué le dice un semáforo a otro? No me mires, me estoy cambiando.',
        '¿Por qué las focas miran siempre hacia arriba? Porque abajo están los focos.',
        '¿Qué hace una abeja en el gimnasio? Zumba.'
      ]
    };

    const users = ['Manolito', 'Pepe', 'Isabel', 'Pedro'];
    const themes = ['humor negro', 'humor amarillo', 'chistes verdes'];

    // Create users
    const userInstances = [];
    for (const userName of users) {
      const [user] = await User.findOrCreate({
        where: { name: userName },
        defaults: { name: userName }
      });
      userInstances.push(user);
      logger.info(`User "${userName}" ${user.isNewRecord ? 'created' : 'already exists'}`);
    }

    // Create themes
    const themeInstances = [];
    for (const themeName of themes) {
      const [theme] = await Theme.findOrCreate({
        where: { name: themeName },
        defaults: { name: themeName }
      });
      themeInstances.push(theme);
      logger.info(`Theme "${themeName}" ${theme.isNewRecord ? 'created' : 'already exists'}`);
    }

    // Create jokes: 3 jokes per theme per user
    let jokeCount = 0;
    for (const user of userInstances) {
      for (const theme of themeInstances) {
        const jokes = sampleJokes[theme.name] || [
          `Chiste 1 de ${theme.name} por ${user.name}`,
          `Chiste 2 de ${theme.name} por ${user.name}`,
          `Chiste 3 de ${theme.name} por ${user.name}`
        ];

        for (const jokeText of jokes) {
          const [joke] = await Joke.findOrCreate({
            where: {
              text: jokeText,
              user_id: user.id,
              theme_id: theme.id
            },
            defaults: {
              text: jokeText,
              user_id: user.id,
              theme_id: theme.id
            }
          });
          
          if (joke.isNewRecord) {
            jokeCount++;
          }
        }
      }
    }

    logger.info(`Database seeded successfully. ${jokeCount} new jokes created.`);
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
};

module.exports = {
  initDatabase: initializeDatabase,
  seedDatabase
};
