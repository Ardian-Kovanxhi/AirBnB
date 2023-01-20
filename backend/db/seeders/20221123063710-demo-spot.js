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
        address: '123 drumul sângelui (blood road in Romanian)',
        city: '?',
        state: 'Wallachia',
        country: 'Romania',
        lat: 4.1,
        lng: 8.5,
        name: "Dracula's castle",
        description: 'The incredible castle of Vlad Tepes (Dracula). The location is unknowable due to the bizarre teleportaion mechanism',
        price: 123.11,
        numReviews: 5,
        avgStarRating: 3.5,
<<<<<<< HEAD
        previewImage: 'https://cdn.theatlantic.com/media/mt/science/cat_caviar.jpg'
=======
        previewImage: 'https://cdna.artstation.com/p/assets/images/images/022/484/692/large/nix-newton-draculas-castle.jpg?1575587233'
>>>>>>> 3279c05506f1088b03e7f8f6ef3b6468444ea965
      },
      {
        ownerId: 2,
        address: '1 Hyrule Place',
        city: 'Hyrule Castle Town',
        state: 'Hyrule',
        country: 'The Kingdom of Hyrule',
        lat: 4.1,
        lng: 8.5,
        name: 'Hyrule Castle',
        description: 'Fit for royalty or those with an extraordinary fate written by the goddesses',
        price: 123.11,
        numReviews: 6,
        avgStarRating: 2,
<<<<<<< HEAD
        previewImage: 'https://cdn.theatlantic.com/media/mt/science/cat_caviar.jpg'
=======
        previewImage: 'https://images.nintendolife.com/456988693e8da/overpriced.large.jpg'
>>>>>>> 3279c05506f1088b03e7f8f6ef3b6468444ea965
      },
      {
        ownerId: 3,
        address: '123 Guardian Blvd',
        city: 'The Last City',
        state: 'unknown',
        country: 'Russia?',
        lat: 4.1,
        lng: 8.5,
        name: 'The Tower',
        description: 'A resting place for true guardians',
        price: 123.11,
        numReviews: 5,
        avgStarRating: 3.5,
<<<<<<< HEAD
        previewImage: 'https://cdn.theatlantic.com/media/mt/science/cat_caviar.jpg'
=======
        previewImage: 'https://destiny.wiki.gallery/images/thumb/a/a9/Destiny_tower_screenshot.jpg/1600px-Destiny_tower_screenshot.jpg'
>>>>>>> 3279c05506f1088b03e7f8f6ef3b6468444ea965
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
