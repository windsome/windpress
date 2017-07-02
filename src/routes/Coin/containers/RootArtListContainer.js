import { connect } from 'react-redux'
import { goBack, push, replace } from 'react-router-redux'
import { retrieveRootPosts, removePost, updatePost, refundPost, retrieveSomePosts } from '../modules/post'

const mapDispatchToProps = {
    goBack,
    push,
    replace,

    retrievePosts: retrieveRootPosts,
    removePost,
    updatePost,
    refundPost,
    retrieveSomePosts,
}

const mapStateToProps = (state) => ({
    pageName: '管理所有宝贝',
    postStatus: state.cpost && state.cpost.retrieveRoot,
    postDb: state.cpost && state.cpost.db,
    refund: state.cpost && state.cpost.refund,
    
    cuser: state.cuser,
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/MyArtList').default)
