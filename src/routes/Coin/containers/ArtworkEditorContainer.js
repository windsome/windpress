import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { retrievePosts, createPost, updatePost } from '../modules/post'

const mapDispatchToProps = {
    goBack,
    retrievePosts,
    createPost,
    updatePost,
}

const mapStateToProps = (state) => ({
    cpost: state.cpost,
    images:['/uploads/1.jpg','/test/1.jpg','/test/2.jpg','/test/3.jpg','/test/4.jpg','/test/5.jpg','/test/6.jpg'],
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/ArtworkEditor').default)
