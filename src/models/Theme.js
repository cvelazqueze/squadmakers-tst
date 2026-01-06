const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Theme = sequelize.define('Theme', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'themes',
    timestamps: false
  });

  return Theme;
};
