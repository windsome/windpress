"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
import config from '../../config';

var sequelize = new Sequelize(config.dbCoin.database, config.dbCoin.username, config.dbCoin.password, config.dbCoin.options);

var db        = {};

fs.readdirSync(path.join(__dirname, "coinmodels"))
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, "coinmodels", file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
