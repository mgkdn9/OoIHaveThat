'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class response extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.response.belongsTo(models.toolRequest)
      models.response.belongsTo(models.user)
    }
  };
  response.init({
    toolRequestId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    priceCounterOffer:  DataTypes.DECIMAL(10,2),
    priceCounterOffer2: DataTypes.DECIMAL(10,2)
  }, {
    sequelize,
    modelName: 'response',
  });
  return response;
};