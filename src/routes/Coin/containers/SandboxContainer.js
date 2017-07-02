import { connect } from 'react-redux'
import { goBack, push } from 'react-router-redux'
import { createOrder } from '../modules/order'
import { jsPayOrders, acquireSandboxKey } from 'routes/Pay/modules/pay'

const mapDispatchToProps = {
    goBack,
    push,

    createOrder,

    jsPayOrders,
    acquireSandboxKey,
}

const mapStateToProps = (state) => ({
    corder: state.corder,
    pay: state.pay,
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/Sandbox').default)
