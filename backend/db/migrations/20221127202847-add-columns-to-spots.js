'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    options.tableName = 'Spots';
    await queryInterface.addColumn(options,
      'numReviews',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      });
    await queryInterface.addColumn(options,
      'avgStarRating',
      {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0
      });
    await queryInterface.addColumn(options,
      'previewImage',
      {
        type: Sequelize.STRING,
        defaultValue: null
      });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(
      'Spots',
      'numReviews',
      options
    );
    await queryInterface.removeColumn(
      'Spots',
      'avgStarRating',
      options
    );
    await queryInterface.removeColumn(
      'Spots',
      'previewImage',
      options
    );
  }
};
