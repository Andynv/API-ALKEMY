const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('categories', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        films: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
        },
    } , { timestamps: false });
}