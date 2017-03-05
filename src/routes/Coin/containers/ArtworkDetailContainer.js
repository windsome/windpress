import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { retrievePosts } from '../modules/post'

const mapDispatchToProps = {
    goBack,
    retrievePosts,
}

const mapStateToProps = (state) => ({
    cpost: state.cpost,
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/ArtworkDetail').default)
