'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Reviews';

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
        spotId: 1,
        userId: 1,
        review: 'review1 blah blah',
        stars: 5
      },
      {
        spotId: 2,
        userId: 1,
        review: 'review1 blah blah',
        stars: 4
      },
      {
        spotId: 3,
        userId: 1,
        review: 'review1 blah blah',
        stars: 3
      },
      {
        spotId: 1,
        userId: 2,
        review: 'review2 blah blah',
        stars: 4
      },
      {
        spotId: 2,
        userId: 2,
        review: 'review2 blah blah',
        stars: 4
      },
      {
        spotId: 3,
        userId: 2,
        review: 'review2 blah blah',
        stars: 4
      },
      {
        spotId: 1,
        userId: 3,
        review: 'review3 blah blah',
        stars: 3
      },
      {
        spotId: 2,
        userId: 3,
        review: 'review3 blah blah',
        stars: 3
      },
      {
        spotId: 3,
        userId: 3,
        review: 'review3 blah blah',
        stars: 3
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
