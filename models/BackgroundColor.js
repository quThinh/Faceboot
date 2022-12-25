
const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const BgColor = sequelize.define('BgColor',{
    id : {
        type: DataTypes.INTEGER,
        allowNull: false ,
        unique: true,  
        primaryKey: true  
    },
    group: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isPureColor: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    color: { 
      type: DataTypes.STRING,  
      allowNull: false,
    },
    textColor: { 
      type: DataTypes.STRING,  
      allowNull: false,
    },
})

module.exports = BgColor

