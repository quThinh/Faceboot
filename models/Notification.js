const { DataTypes } = require('sequelize')
const sequelize = require('../dbConnection')

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    isSeen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    isPopular: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    type:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
})


module.exports = Notification

