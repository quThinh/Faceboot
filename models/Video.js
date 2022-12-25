const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Video = sequelize.define('Video',{
    id: {
        type: DataTypes.INTEGER,
        unique: true,  
        allowNull: false,
        primaryKey: true,
    },
    cover_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    video_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

module.exports = Video

