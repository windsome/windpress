import { connect } from 'react-redux'
import { goBack, replace } from 'react-router-redux'
import { retrievePosts, createPost, updatePost, setPostEditor, updatePostEditor } from '../modules/post'

const mapDispatchToProps = {
    goBack,
    replace,

    retrievePosts,
    createPost,
    updatePost,
    setPostEditor,
    updatePostEditor,
}

const mapStateToProps = (state) => ({
    cpost: state.cpost,
    editor: state.cpost && state.cpost.editor || {},
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/ArtworkEditor').default)
