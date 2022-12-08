const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Video = sequelize.define('Video',{
    id: {
        type: DataTypes.INTEGER,
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

