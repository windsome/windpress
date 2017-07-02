import { connect } from 'react-redux'
import { goBack, push, replace } from 'react-router-redux'
import { searchPosts } from '../modules/post'

const mapDispatchToProps = {
    goBack,
    push,
    replace,

    retrievePosts: searchPosts,
}

const mapStateToProps = (state) => ({
    pageName: '查找',
    postStatus: state.cpost && state.cpost.search,
    postDb: state.cpost && state.cpost.db,

    cuser: state.cuser,
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/Search').default)
