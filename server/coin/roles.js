import _debug from 'debug'
const debug = _debug('server:coin:role')
import _ from 'lodash';
import Errcode, * as EC from '../Errcode'

const Roles = {
    root: ['manage_users','edit_users','manage_posts','edit_posts','manage_orders','edit_orders'],
    agent: ['manage_users','edit_users','manage_posts','edit_posts'],
    customer: ['manage_users','edit_users','manage_posts','edit_posts'],
};

export function hasCaps ($roleName, $caps) {
    if (!$roleName || !$caps) {
        debug ("param error: ", $roleName, $caps);
        return false;
    }

    var roleCaps = Roles[$roleName];
    if(_.isInteger($roleName)) {
        switch ($roleName) {
        case 1: roleCaps = Roles['root']; break;
        case 2: roleCaps = Roles['agent']; break;
        case 3: roleCaps = Roles['customer']; break;
        }
    }
    if (!roleCaps || _.isEmpty(roleCaps)) {
        debug ("roleCaps is empty ", roleCaps);
        return false;
    }
    var caps = $caps;
    if (!_.isArray($caps)) caps = [$caps];
    if (_.isEmpty (caps)) {
        debug ("caps is empty ", caps);
        return false;
    }

    return caps.reduce ( (result, cap ) => {
        if (_.indexOf(roleCaps, cap) >= 0)
            return result;
        else
            return false;
    }, true);
}

export default function userHasCaps ($user, $caps) {
    return true;
    if (!$user || !$user.status) {
        debug ("user is empty ", $user);
        return false;
    }
    return hasCaps ($user.status, $caps);
}
