const { DataTypes } = require('sequelize')
const sequelize = require('../dbConnection')

const PostReport = sequelize.define('PostReport', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    detail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subject:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    extra_data:{
        type: DataTypes.JSON,
        allowNull: true,
    },
})


module.exports = PostReport

