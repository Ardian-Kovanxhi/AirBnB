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
    // await queryInterface.addColumn(
    //   'Users',
    //   'firstName',
    //   {
    //     type: Sequelize.STRING,
    //     allowNull: false
    //   }, options
    // );
    // await queryInterface.addColumn(
    //   'Users',
    //   'lastName',
    //   {
    //     type: Sequelize.STRING,
    //     allowNull: false
    //   }, options
    // );
    options.tableName = 'Users';
    await queryInterface.addColumn(options,
      'firstName',
      {
        type: Sequelize.STRING,
        allowNull: false
      })
    await queryInterface.addColumn(options,
      'lastName',
      {
        type: Sequelize.STRING,
        allowNull: false
      })

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(
      'Users',
      'firstName',
      options
    );
    await queryInterface.removeColumn(
      'Users',
      'lastName',
      options
    );
  }
};
