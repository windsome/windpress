"use strict";
var jsonField = require ("./jsonField");
module.exports = function(sequelize, DataTypes) {
    var table = sequelize.define("User", {
        id:       { type: DataTypes.BIGINT(20), primaryKey: true, autoIncrement: true },
        openid:   { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
        pass:     { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
        nicename: { type: DataTypes.STRING(50), allowNull: false, defaultValue: '' },
        avatar:   { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
        phone:    { type: DataTypes.STRING(50), allowNull: false, defaultValue: '' },
        address:  { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
        caps:     { type: DataTypes.TEXT, allowNull: true, defaultValue: null,
                    get: jsonField.getAsJson('caps'),
                    set: jsonField.setFromJson('caps'),
                  },
        status:   { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        subscribe:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        wechat:   { type: DataTypes.TEXT, allowNull: true, defaultValue: null,
                    get: jsonField.getAsJson('wechat'),
                    set: jsonField.setFromJson('wechat'),
                },
        visited:   { type: DataTypes.TEXT, allowNull: true, defaultValue: null,
                    get: jsonField.getAsJson('visited'),
                    set: jsonField.setFromJson('visited'),
                },
    }, {
        underscore: true,
        indexes: [
            { fields: ['openid'] },
            { fields: ['nicename'] },
            { fields: ['phone'] },
            { fields: ['address'] },
        ],
        classMethods: {
            associate: function(models) {
                //User.hasMany(models.Lock);
                //User.belongsToMany(models.Lock, {through: 'UserLock', timestamps: false});
            }
        }
    });

    return table;
};
