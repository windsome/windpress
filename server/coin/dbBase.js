import _debug from 'debug'
const debug = _debug('COIN:dbase')
import _ from 'lodash'
import Errcode, * as EC from '../Errcode'

const crypto = require('crypto');
import { models } from './dbmodels'

export async function create($table, $record) {
    if (!$table || !$record) {
        debug ("parameter error!", $table, $record);
        //throw new Errcode ("param error! "+ arguments, EC.ERR_PARAM_ERROR);
        return false;
    }
    
    var instance = await $table.create( $record );
    var obj = instance && instance.get({ plain: true });
    if (!obj) {
        debug ("warning: create record getback none:", $record);
    }
    return obj;
}
export async function update($table, $record, $where) {
    if (!$table || !$record || !$where) {
        debug ("parameter error!", $table, $record, $where);
        return false;
    }
    var ret = await $table.update( $record, { where: $where } );
    var affectedCount = ret[0];
    if (affectedCount <= 0) {
        debug ("warning: update none!");
    }
    return {count: affectedCount};
}
export async function destroy($table, $where) {
    if (!$table || !$where) {
        debug ("parameter error!", $table, $where);
        return false;
    }
    var count = await $table.destroy( { where: $where } );
    if (count <= 0) {
        debug ("warning: remove none!");
    }
    return {count};
}
export async function findOne($table, $where, $options = null) {
    if (!$table || !$where) {
        debug ("parameter error!", $table, $where);
        return false;
    }
    var instance = await $table.findOne({ where: $where, ...$options });
    var obj = instance && instance.get({ plain: true });
    if (!obj) {
        debug ("warning: get none:", $where);
    }
    return obj;
}
export async function findAll($table, $where, $options = null) {
    if (!$table || !$where) {
        debug ("parameter error!", $table, $where);
        return false;
    }
    var instances = await $table.findAll({ where: $where, ...$options });
    var objs = instances && (instances.length > 0) && instances.map((instance)=>{
        return instance.get({ plain:true });
    });

    var page=0;
    var limit = $options.limit || 0;
    if (limit) {
        page = $options && $options.offset && parseInt($options.offset / limit) || 0;
    }
    return { total: objs.length, count: objs.length, date: new Date(), page, limit, data: objs };
}

export async function findOneV2($table, $options) {
    if (!$table || !$options) {
        debug ("parameter error!", $table, $options);
        return false;
    }
    var instance = await $table.findOne($options);
    var obj = instance && instance.get({ plain: true });
    if (!obj) {
        debug ("warning: get none:", $options);
    }
    return obj;
}
export async function findAllV2($table, $options) {
    if (!$table || !$options) {
        debug ("parameter error!", $table, $options);
        return false;
    }
    var instances = await $table.findAll($options);
    var objs = instances && (instances.length > 0) && instances.map((instance)=>{
        return instance.get({ plain:true });
    });

    var page=0;
    var limit = $options.limit || 0;
    if (limit) {
        page = $options && $options.offset && parseInt($options.offset / limit) || 0;
    }
    return { total: objs.length, count: objs.length, date: new Date(), page, limit, data: objs };
}

export async function findAndCountAll($table, $options) {
    if (!$table || !$options) {
        debug ("parameter error!", $table, $options);
        return false;
    }
    var result = await $table.findAndCountAll($options);
    if (!result) {
        debug ("warning: query none!");
        return false;
    }
    var objs = result.rows && (result.rows.length > 0) && result.rows.map((instance)=>{
        return instance.get({ plain:true });
    });

    var page=0;
    var limit = $options.limit || 0;
    if (limit) {
        page = $options && $options.offset && parseInt($options.offset / limit) || 0;
    }
    return { total: result.count, count: objs.length, date: new Date(), page, limit, data: objs };
}
 
export async function bulkCreate($table, $records) {
    if (!$table || !$records || $records.length == 0) {
        debug ("parameter error!", $table, $records);
        //throw new Errcode ("param error! "+ arguments, EC.ERR_PARAM_ERROR);
        return false;
    }
    
    var instances = await $table.bulkCreate($records);
    //var objs = instances && instances.map((instance)=>{
    //    return instance.get({ plain:true });
    //});
    //return { count: objs.length, data: objs };
    return { count: $records.length };
}


export default {
    create,
    update,
    destroy,
    findOne,
    findAll,
    findOneV2,
    findAllV2,
    findAndCountAll,
    bulkCreate,
    models,
}
