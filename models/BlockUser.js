const { DataTypes } = require('sequelize')
const sequelize = require('../dbConnection')
const { v4: uuidv4 } = require('uuid');
const BlockUser = sequelize.define('BLockUser', {
    id: {
        type: DataTypes.STRING,
        defaultValue: uuidv4(),
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
})


module.exports = BlockUser

