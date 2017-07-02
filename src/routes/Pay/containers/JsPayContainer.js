import { connect } from 'react-redux'
import { goBack, replace, go } from 'react-router-redux'
import { invokePayment, checkOrderStatus, retrieveOrder } from '../modules/pay'

const mapDispatchToProps = {
    goBack,
    go,
    replace,

    invokePayment,
    checkOrderStatus,
    retrieveOrder,
}

const mapStateToProps = (state) => ({
    cuser: state.cuser,
    pay: state.pay,
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/JsPay').default)
