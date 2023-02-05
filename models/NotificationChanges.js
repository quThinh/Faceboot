const { DataTypes } = require('sequelize')
const { uuid } = require('uuidv4')
const sequelize = require('../dbConnection')

const NotificationChange = sequelize.define('NotificationChange', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    actor_id: {
        type: DataTypes.STRING
    }
})


module.exports = NotificationChange

