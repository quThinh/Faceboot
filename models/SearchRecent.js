const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const SearchRecent = sequelize.define('SearchRecent',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,  
        primaryKey: true,
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    keyword: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
})

module.exports = SearchRecent

