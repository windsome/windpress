import { connect } from 'react-redux'
import Layout from '../components/HomeLayout'
import { doLogout } from 'store/lib/user'

const mapDispatchToProps = {
    doLogout,
}

const mapStateToProps = (state) => ({
    login: state.login,
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
