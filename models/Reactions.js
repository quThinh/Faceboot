const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Reactions = sequelize.define('Reactions',{
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    react: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
})

module.exports = Reactions

