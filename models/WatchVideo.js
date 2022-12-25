const { DataTypes } = require('sequelize')
const sequelize = require('../dbConnection')

const WatchVideo = sequelize.define('WatchVideo', {
    id: {
        type: DataTypes.INTEGER,
        unique: true,  
        allowNull: false,
        primaryKey: true,
    },
    pageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    watch_threadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isFollowed:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    seeCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isSeen: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    isPopular: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    permission: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
})


module.exports = WatchVideo

/* {
  "user": {
    "token": "jwt.token.here",
  }
} */