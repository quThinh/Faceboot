const { DataTypes, UUIDV4 } = require('sequelize')
const sequelize = require('../dbConnection')

const User = sequelize.define('User', {
    // id: {
    //     type: DataTypes.INTEGER,
    //     set: UUIDV4.INTEGER,
    //     allowNull: false,
    //     primaryKey: true,
    // },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        primaryKey: true,
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
    sub_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    intro_txt: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    work_at: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    live_in: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    relationship: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    learn_at: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    from: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    follower: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    cover_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    avatar_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
})


module.exports = User

/* {
  "user": {
    "token": "jwt.token.here",
  }
} */