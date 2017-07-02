import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { retrieveMyOrders } from '../modules/order'
import { retrieveSomePosts } from '../modules/post'

const mapDispatchToProps = {
    goBack,
    retrieveMyOrders: retrieveMyOrders,
    retrieveSomePosts,
}

const mapStateToProps = (state) => ({
    pageName: '我的夺宝记录',

    postDb: state.cpost.db || {},
    orderDb: state.corder.db || {},
    orderStatus: state.corder.retrieveMine || {},
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/MyOrderList').default)
