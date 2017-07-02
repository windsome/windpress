"use strict";
var jsonField = require ("./jsonField");
module.exports = function(sequelize, DataTypes) {
    var table = sequelize.define("Post", {
        id:     { type: DataTypes.BIGINT(20), primaryKey: true, autoIncrement: true },
        status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        unit:   { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        count:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        paid :  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        random1:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        random2:{ type: DataTypes.STRING,  allowNull: false, defaultValue: ''},
        publish:{ type: DataTypes.DATE,  allowNull: false, defaultValue: DataTypes.NOW},
        accomplish:{ type: DataTypes.DATE,  allowNull: false, defaultValue: DataTypes.NOW},
        lucky:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        owner:  { type: DataTypes.BIGINT(20), allowNull: false, defaultValue: 0},
        favor:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        images: { type: DataTypes.TEXT, allowNull: true, defaultValue: null,
                  get: jsonField.getAsJson('images'),
                  set: jsonField.setFromJson('images'),
                },
        desc:   { type: DataTypes.TEXT, allowNull: true, defaultValue: null,
                  get: jsonField.getAsJson('desc'),
                  set: jsonField.setFromJson('desc'),
                },
    }, {
        //timestamps: false,
        underscore: true,
        indexes: [
            { fields: ['status'] },
            { fields: ['owner'] },
        ],
        classMethods: {
            associate: function(models) {
                //Device.hasMany(models.Lock);
            }
        }
    });

    return table;
};
