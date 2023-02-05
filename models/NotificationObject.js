const { DataTypes } = require('sequelize')
const { uuid } = require('uuidv4')
const sequelize = require('../dbConnection')

const NotificationObject = sequelize.define('NotificationObject', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    notification_type:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    create_at: {
        type: DataTypes.DATE,
        allowNull: false,
    }
})


module.exports = NotificationObject

