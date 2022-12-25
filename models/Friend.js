const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Friend = sequelize.define('Friend',{
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  
        primaryKey: true,
        defaultValue: "2131",
    },
    // fromUserId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    // },
})

module.exports = Friend

