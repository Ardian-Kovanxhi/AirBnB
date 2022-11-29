'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'SpotImages';

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
    // return queryInterface.bulkInsert(options, [
    //   {
    //     spotId: 1,
    //     url: 'sampleURL1.com',
    //     preview: true
    //   },
    //   {
    //     spotId: 2,
    //     url: 'sampleURL2.com',
    //     preview: false
    //   },
    //   {
    //     spotId: 3,
    //     url: 'sampleURL3.com',
    //     preview: true
    //   },
    // ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // const Op = Sequelize.Op;
    // return queryInterface.bulkDelete(options, {});
  }
};
