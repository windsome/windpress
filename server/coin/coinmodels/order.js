"use strict";
module.exports = function(sequelize, DataTypes) {
    var table = sequelize.define("Order", {
        id:     { type: DataTypes.BIGINT(20), primaryKey: true, autoIncrement: true },
        uuid:   { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
        count:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        userId: { type: DataTypes.BIGINT(20), allowNull: false, defaultValue: 0 },
        postId: { type: DataTypes.BIGINT(20), allowNull: false, defaultValue: 0 },
    }, {
        underscore: true,
        indexes: [
            { fields: ['userId'] },
            { fields: ['postId'] },
            { fields: ['status'] }
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
