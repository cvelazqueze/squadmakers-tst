const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Joke = sequelize.define('Joke', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    theme_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'themes',
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'jokes',
    timestamps: false
  });

  return Joke;
};
