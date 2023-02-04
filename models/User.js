const { DataTypes } = require('sequelize')
const sequelize = require('../dbConnection')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING(50),
        unique: true,  
        allowNull: false,
        // primaryKey: true,
    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    email: {
        primaryKey: true,
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    birth_day:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    hash_password: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    sub_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    intro_txt: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    work_at: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    live_in: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    relationship: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    learn_at: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    from: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    cover_url: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    avatar_url: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    //0 is unblock, 1 is block
    type: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
})


module.exports = User
