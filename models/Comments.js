const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Comment = sequelize.define('Comment',{
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,  
        allowNull: false,
    },
    content: { 
      type: DataTypes.STRING,  
      allowNull: false,
    },
})

module.exports = Comment

