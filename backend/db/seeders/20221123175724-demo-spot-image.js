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
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://cdna.artstation.com/p/assets/images/images/022/484/692/large/nix-newton-draculas-castle.jpg?1575587233',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://cdna.artstation.com/p/assets/images/images/022/484/692/large/nix-newton-draculas-castle.jpg?1575587233',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://cdna.artstation.com/p/assets/images/images/022/484/692/large/nix-newton-draculas-castle.jpg?1575587233',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://images.nintendolife.com/456988693e8da/overpriced.large.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://destiny.wiki.gallery/images/thumb/a/a9/Destiny_tower_screenshot.jpg/1600px-Destiny_tower_screenshot.jpg',
        preview: true
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
