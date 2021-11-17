'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('users', [{
        name: 'Mikel',
        phone: '3146986241',
        email: 'bkohlberg95@gmail.com',
        password: 'password',
        latitude: '38.509930',
        longitude: '-90.473488',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('users', null, {});
  }
}