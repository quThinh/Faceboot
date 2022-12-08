const { DataTypes } = require('sequelize')
const sequelize = require('../dbConnection')

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    is_recall: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})


module.exports = Message

