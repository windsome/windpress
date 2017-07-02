import { connect } from 'react-redux'
import { retrieveOwnerPublishedPosts } from '../modules/post'
import { updateUser, retrieveSomeUsers } from '../modules/user'

const mapDispatchToProps = {
    retrievePosts: retrieveOwnerPublishedPosts,
    updateUser,
    retrieveSomeUsers,
}

const mapStateToProps = (state) => ({
    postStatus: state.cpost && state.cpost.retrieve,
    postDb: state.cpost && state.cpost.db,
    cpost: state.cpost,

    cuser: state.cuser,
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/ArtworkList').default)
