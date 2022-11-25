const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const MyCoordinate = sequelize.define('MyCoordinate',{
    longitude: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
})

module.exports = MyCoordinate

