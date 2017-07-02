import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { retrieveMyLuckyOrders } from '../modules/order'
import { retrieveSomePosts } from '../modules/post'

const mapDispatchToProps = {
    goBack,
    retrieveMyOrders: retrieveMyLuckyOrders,
    retrieveSomePosts,
}

const mapStateToProps = (state) => ({
    pageName: '我的幸运记录',

    postDb: state.cpost.db || {},
    orderDb: state.corder.db || {},
    orderStatus: state.corder.retrieveMyLucky || {},
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/MyOrderList').default)
