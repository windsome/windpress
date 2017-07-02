"use strict";
var jsonField = require ("./jsonField");
module.exports = function(sequelize, DataTypes) {
    var table = sequelize.define("Refund", {
        id:        { type: DataTypes.BIGINT(20), primaryKey: true, autoIncrement: true },
        uuid:      { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
        totalFee:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        refundFee: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        orderUuid: { type: DataTypes.STRING(255), allowNull: false, defaultValue: 0 },
        orderId:   { type: DataTypes.BIGINT(20), allowNull: false, defaultValue: 0 },
        userId:    { type: DataTypes.BIGINT(20), allowNull: false, defaultValue: 0 },
        postId:    { type: DataTypes.BIGINT(20), allowNull: false, defaultValue: 0 },
        status:    { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        detail:    { type: DataTypes.TEXT, allowNull: true, defaultValue: null,
                     get: jsonField.getAsJson('detail'),
                     set: jsonField.setFromJson('detail'),
                   },
        requestUserId: { type: DataTypes.BIGINT(20), allowNull: false, defaultValue: 0 },
        requestTime: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
        issueUserId: { type: DataTypes.BIGINT(20), allowNull: false, defaultValue: 0 },
        issueTime:   { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    }, {
        underscore: true,
        indexes: [
            { fields: ['uuid'] },
            { fields: ['orderUuid'] },
            { fields: ['orderId'] },
            { fields: ['postId'] },
            { fields: ['userId'] },
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
