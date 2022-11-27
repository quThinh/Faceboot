const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Relationship = sequelize.define('Relationship',{
    // id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     primaryKey: true,
    // },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

module.exports = Relationship

