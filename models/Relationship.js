const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Relationship = sequelize.define('Relationship',{
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  
        primaryKey: true,
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // fromUserId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    // },
})

module.exports = Relationship

