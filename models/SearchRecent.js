const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const SearchRecent = sequelize.define('SearchRecent',{
    Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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

