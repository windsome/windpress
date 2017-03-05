"use strict";
module.exports = function(sequelize, DataTypes) {
    var table = sequelize.define("Post", {
        id:     { type: DataTypes.BIGINT(20), primaryKey: true, autoIncrement: true },
        status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        unit:   { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        count:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        lucky:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        owner:  { type: DataTypes.BIGINT(20), allowNull: false, defaultValue: 0},
        favor:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        images: { type: DataTypes.TEXT, allowNull: false, defaultValue: '',
                      get: function()  {
                          var content = this.getDataValue('images');
                          try {
                              return JSON.parse(content);
                          } catch (e) {
                              console.log ("warning: json parse:", e.message);
                              return content;
                          }
                      },
                      set: function(val) {
                          var content = val;
                          try {
                              content = JSON.stringify (val);
                          } catch (e) {
                              console.log ("warning: json stringify:", e.message);
                              content = val;
                          }
                          this.setDataValue('images', content);
                      }
                    },
        desc:   { type: DataTypes.TEXT, allowNull: false, defaultValue: '',
                      get: function()  {
                          var content = this.getDataValue('desc');
                          try {
                              return content && JSON.parse(content) || content;
                          } catch (e) {
                              console.log ("warning: json parse:", e.message);
                              return content;
                          }
                      },
                      set: function(val) {
                          var content = val;
                          try {
                              content = val && JSON.stringify (val) || val;
                          } catch (e) {
                              console.log ("warning: json stringify:", e.message);
                              content = val;
                          }
                          this.setDataValue('desc', content);
                      }
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
