const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Reactions = sequelize.define('Reactions',{
    love: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    like: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    haha: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    
})

module.exports = Reactions

