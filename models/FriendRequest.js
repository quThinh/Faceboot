const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const FriendRequest = sequelize.define('FriendRequest',{
    Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    mutualCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
})

module.exports = FriendRequest

