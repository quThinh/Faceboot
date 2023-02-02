const { DataTypes } = require('sequelize')
const sequelize = require('../dbConnection')
const { v4: uuidv4 } = require('uuid');
const ArticleReport = sequelize.define('ArticleReport', {
    id: {
        type: DataTypes.STRING,
        defaultValue: uuidv4(),
        allowNull: false,
        unique: true,  
        primaryKey: true,
    },
    content: {
        type: DataTypes.STRING(300),
        allowNull: false,
    }
})


module.exports = ArticleReport

