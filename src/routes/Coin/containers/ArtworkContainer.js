import { connect } from 'react-redux'
import { goBack, push, replace } from 'react-router-redux'
import { retrievePosts } from '../modules/post'
import { updateUser } from '../modules/user'
import { retrieveQrcode } from '../modules/qrcode'
import { retrieveOrders, retrieveOrdersLater, createOrder } from '../modules/order'
import { jsPayOrders } from 'routes/Pay/modules/pay'

const mapDispatchToProps = {
    goBack,
    replace,
    push,

    retrievePosts,
    retrieveOrdersLater,
    createOrder,

    jsPayOrders,

    updateUser,

    retrieveQrcode,
}

const mapStateToProps = (state) => ({
    cpost: state.cpost,
    corder: state.corder,
    cuser: state.cuser,
    jssdk: state.jssdk,
    qrcode: state.qrcode,
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/Artwork').default)
