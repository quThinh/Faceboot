const { DataTypes } = require('sequelize')
const { uuid } = require('uuidv4')
const sequelize = require('../dbConnection')

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    isSeen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
})


module.exports = Notification

