import { connect } from 'react-redux'
import { retrievePosts } from '../modules/post'

const mapDispatchToProps = {
    retrievePosts,
}

const mapStateToProps = (state) => ({
    cpost: state.cpost,
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/ArtworkList').default)
