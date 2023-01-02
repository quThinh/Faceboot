const {DataTypes, Sequelize} = require('sequelize')
const { uuid } = require('uuidv4')
const sequelize = require('../dbConnection')

const Article = sequelize.define('Article',{
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: uuid()
    },
    create_at: {
        type: DataTypes.DATE,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: { 
      type: DataTypes.STRING,  
      allowNull: false,
    },
    permission: { 
      type: DataTypes.STRING,  
      allowNull: false,
    },
    update_at: {
      type: DataTypes.DATE
    },
})

module.exports = Article

