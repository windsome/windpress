import { connect } from 'react-redux'
import { loginIfNeeded } from 'store/lib/user'
import LoginPage from '../components/LoginPage'
import { push } from 'react-router-redux'

const mapDispatchToProps = {
    handleLogin: loginIfNeeded,
    push
}

const mapStateToProps = (state) => ({
    login: state.login,
    nextPathname: state.nextPathname
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
