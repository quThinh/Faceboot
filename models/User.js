const { DataTypes } = require('sequelize')
const sequelize = require('../dbConnection')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    birth_day:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    hash_password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    introTxt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    work_at: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    live_in: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    relationship: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    learn_at: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    from: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    follower: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cover_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})


module.exports = User

/* {
  "user": {
    "token": "jwt.token.here",
  }
} */