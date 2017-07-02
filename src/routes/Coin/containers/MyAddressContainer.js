import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { updateUser, setUserEditor } from '../modules/user'

const mapDispatchToProps = {
    goBack,

    updateUser,
    setUserEditor,
}

const mapStateToProps = (state) => ({
    cuser: state.cuser,
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/MyAddress').default)
