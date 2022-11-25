const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Friend = sequelize.define('Friend',{
    mutualFriends: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isRecent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
})

module.exports = Friend

