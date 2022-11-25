const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Comment = sequelize.define('Comment',{
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    content: { 
      type: DataTypes.INTEGER,  
      allowNull: false,
    },
    create_at: { 
      type: DataTypes.INTEGER,  
      allowNull: false,
    },
})

module.exports = Comment

