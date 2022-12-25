const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const RecommendFriend = sequelize.define('RecommendFriend',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,  
        primaryKey: true,
    },
    mutualCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // fromUserId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    // },
})

module.exports = RecommendFriend

