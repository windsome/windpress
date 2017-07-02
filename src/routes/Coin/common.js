var xdebug = window.myDebug('COIN:common');
import _ from 'lodash';

export const userHasCap = (user, cap) => {
    if (!cap) return true;
    if (!user || !user.caps) return false;

    var userCaps = user.caps;
    if (_.isString(userCaps))
        userCaps = userCaps.split(',');
    userCaps = userCaps.map (item => {
        return item.toUpperCase();
    })

    var isRoot = userCaps && (userCaps.indexOf('ROOT') >= 0);
    if (isRoot) return true;

    var hasCapShopAgent = userCaps && (userCaps.indexOf(cap) >= 0);
    return !!hasCapShopAgent;
}

export const addCap = (caps, cap) => {
    if (!cap) return caps;

    cap = cap.toUpperCase();
    if (!caps) return [cap];

    if (_.isString(caps))
        caps = caps.split(',');
    caps = caps.map (item => {
        return item.toUpperCase();
    })

    var capSet = new Set (caps);
    capSet.add (cap);

    return [...capSet];
}

export const delCap = (caps, cap) => {
    if (!caps || !cap) return caps;

    cap = cap.toUpperCase();

    if (_.isString(caps))
        caps = caps.split(',');
    caps = caps.map (item => {
        return item.toUpperCase();
    })

    var capSet = new Set (caps);
    capSet.delete (cap);

    return [...capSet];
}

