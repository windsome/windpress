import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'

const mapDispatchToProps = {
    goBack,
}

const mapStateToProps = (state) => ({
    wxoauth: state.wxoauth,
    cuser: state.cuser,
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/Mine').default)
