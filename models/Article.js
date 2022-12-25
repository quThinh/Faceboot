const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Article = sequelize.define('Article',{
    id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,  
    },
    create_at: {
        type: DataTypes.DATE,
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

module.exports = Article

