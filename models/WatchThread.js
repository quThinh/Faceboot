const { DataTypes } = require('sequelize')
const sequelize = require('../dbConnection')

const WatchThread = sequelize.define('WatchThread', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,  
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})


module.exports = WatchThread

