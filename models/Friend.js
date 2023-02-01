const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')
const { uuid } = require('uuidv4')
const Friend = sequelize.define('Friend',{
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  
        primaryKey: true,
        defaultValue: uuid(),
    },
})

module.exports = Friend

