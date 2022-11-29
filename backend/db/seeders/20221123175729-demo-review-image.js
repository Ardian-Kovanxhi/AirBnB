'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'ReviewImages';

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
    //     reviewId: 1,
    //     url: 'sampleURLrev1.com'
    //   },
    //   {
    //     reviewId: 2,
    //     url: 'sampleURLrev2.com'
    //   },
    //   {
    //     reviewId: 3,
    //     url: 'sampleURLrev3.com'
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
