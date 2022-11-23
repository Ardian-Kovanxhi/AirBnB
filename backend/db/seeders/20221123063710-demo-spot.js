'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Spots';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: 'TestA1',
        city: 'TestC1',
        state: 'NJ',
        country: 'USA',
        lat: 4.1,
        lng: 8.5,
        name: 'House1',
        description: 'desc1 blah blah blah',
        price: 123.11
      },
      {
        ownerId: 2,
        address: 'TestA2',
        city: 'TestC2',
        state: 'NJ',
        country: 'USA',
        lat: 4.1,
        lng: 8.5,
        name: 'House2',
        description: 'desc2 blah blah blah',
        price: 123.11
      },
      {
        ownerId: 3,
        address: 'TestA3',
        city: 'TestC3',
        state: 'NJ',
        country: 'USA',
        lat: 4.1,
        lng: 8.5,
        name: 'House3',
        description: 'desc3 blah blah blah',
        price: 123.11
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {});
  }
};
