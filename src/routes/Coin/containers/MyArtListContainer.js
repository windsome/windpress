import { connect } from 'react-redux'
import { goBack, push, replace } from 'react-router-redux'
import { retrieveMyPosts, removePost, updatePost, refundPost, retrieveSomePosts } from '../modules/post'

const mapDispatchToProps = {
    goBack,
    push,
    replace,

    retrievePosts: retrieveMyPosts,
    removePost,
    updatePost,
    refundPost,
    retrieveSomePosts,
}

const mapStateToProps = (state) => ({
    pageName: '我发布的宝贝',
    postStatus: state.cpost && state.cpost.retrieveMine,
    postDb: state.cpost && state.cpost.db,
    refund: state.cpost && state.cpost.refund,

    cuser: state.cuser,
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/MyArtList').default)
