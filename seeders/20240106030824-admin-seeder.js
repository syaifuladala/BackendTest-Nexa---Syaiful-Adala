'use strict';

const md5 = require('md5');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('admin', [{
      username: 'testdata',
      password: md5('databaru')
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admin', null, {});
  }
};
