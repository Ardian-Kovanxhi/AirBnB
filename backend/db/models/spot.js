'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, { foreignKey: 'ownerId', as: "Owner", onDelete: 'CASCADE' })
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId' })
      Spot.hasMany(models.Booking, { foreignKey: 'spotId' })
      Spot.hasMany(models.Review, { foreignKey: 'spotId' })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    numReviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    avgStarRating: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    previewImage: {
      type: DataTypes.STRING,
      defaultValue: null
    }
  }, {
    sequelize,
    modelName: 'Spot',
    defaultScope: {
      attributes: {
        exclude: ['numReviews']
      }
    },
    scopes: {
      spotCreation: {
        attributes: {
          exclude: ['numReviews', 'avgStarRating', 'previewImage']
        }
      },
      spotDetails: {
        attributes: {
          exclude: ['previewImage']
        }
      }
    }
  });
  return Spot;
};