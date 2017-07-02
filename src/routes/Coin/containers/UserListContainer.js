import { connect } from 'react-redux'
import { goBack, push, replace } from 'react-router-redux'
import { searchUsers, retrieveSomeUsers, updateUser } from '../modules/user'

const mapDispatchToProps = {
    goBack,
    push,
    replace,

    retrieveItems: searchUsers,
    retrieveSomeUsers,
    updateUser,
}

const mapStateToProps = (state) => ({
    pageName: '查找',
    itemStatus: state.cuser && state.cuser.retrieve || {},
    itemDb: state.cuser && state.cuser.db || {},

    cuser: state.cuser,
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/UserList').default)
