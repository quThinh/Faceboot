const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const FriendRequest = sequelize.define('FriendRequest',{
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  
        primaryKey: true,
    },
    mutualCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    // fromUserId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    // },
})

module.exports = FriendRequest

