'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class toolRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.toolRequest.belongsTo(models.user)
      models.toolRequest.hasMany(models.response)
    }
  };
  toolRequest.init({
    title: DataTypes.STRING,
    timeNeeded: DataTypes.STRING,
    pictureURL: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    priceFirstOffer: DataTypes.DECIMAL(10,2)
  }, {
    sequelize,
    modelName: 'toolRequest',
  });
  return toolRequest;
};