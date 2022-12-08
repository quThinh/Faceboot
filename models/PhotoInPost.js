const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const PhotoInPost = sequelize.define('PhotoInPost',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true,
    },
    isHighLight: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    photo_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

module.exports = PhotoInPost

