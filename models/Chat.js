const { DataTypes } = require('sequelize')
const sequelize = require('../dbConnection')


const Chat = sequelize.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // seens: {
    //     type: DataTypes.ARRAY(DataTypes.BOOLEAN),
    //     allowNull: false,
    // },
    // pivots: {
    //     type: DataTypes.ARRAY(DataTypes.NUMBER),
    //     allowNull: false,
    // },
    type: {
        type: DataTypes.ENUM('NO', 'YES'),
        allowNull: false,
    }
})


module.exports = Chat

