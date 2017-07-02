import { connect } from 'react-redux'
import { goBack, push, replace } from 'react-router-redux'
import { doLogout } from '../modules/user'

const mapDispatchToProps = {
    goBack,
    push,
    replace,

    doLogout,
}

const mapStateToProps = (state) => ({
    cuser: state.cuser,
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/Mine').default)
