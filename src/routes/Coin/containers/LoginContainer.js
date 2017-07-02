import { connect } from 'react-redux'
import { loginByNicename } from '../modules/user'
import { goBack, push, replace } from 'react-router-redux'

const mapDispatchToProps = {
    handleLogin: loginByNicename,

    goBack,
    push,
    replace,
}

const mapStateToProps = (state) => ({
    cuser: state.cuser,
    nextPathname: state.nextPathname
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/LoginPage').default)
