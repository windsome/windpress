import { connect } from 'react-redux'
import { goBack, push, replace } from 'react-router-redux'
import { retrieveUsersByIds } from '../modules/user'
import { retrieveFavorPosts } from '../modules/post'

const mapDispatchToProps = {
    goBack,
    push,
    replace,

    retrieveItems: retrieveUsersByIds,

    retrieveFavorPosts,
}

const mapStateToProps = (state) => ({
    itemStatus: state.cuser && state.cuser.retrieve || {},
    itemDb: state.cuser && state.cuser.db || {},
    cuser: state.cuser,

    postStatus: state.cpost && state.cpost.retrieveFavor,
    postDb: state.cpost && state.cpost.db,
    cpost: state.cpost,

})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/ShopCenter').default)
