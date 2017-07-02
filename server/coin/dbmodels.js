"use strict";
var Sequelize = require("sequelize");
import config from '../../config';

import UserModel from './models/user'
import PostModel from './models/post'
import OrderModel from './models/order'
import RefundModel from './models/refund'

var dbcfg = config.db;

var sequelize = new Sequelize(dbcfg.database, dbcfg.username, dbcfg.password, dbcfg.options);

var db        = {};
var model = UserModel(sequelize, Sequelize);
db[model.name] = model;
model = PostModel(sequelize, Sequelize);
db[model.name] = model;
model = OrderModel(sequelize, Sequelize);
db[model.name] = model;
model = RefundModel(sequelize, Sequelize);
db[model.name] = model;

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
