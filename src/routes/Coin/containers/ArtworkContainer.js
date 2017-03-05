import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { retrievePosts } from '../modules/post'
import { retrieveOrders, retrieveOrdersLatest, retrieveOrdersBigThan, createOrder } from '../modules/order'

const mapDispatchToProps = {
    goBack,
    retrievePosts,
    retrieveOrdersLatest,
    retrieveOrdersBigThan,
    createOrder,
}

const mapStateToProps = (state) => ({
    cpost: state.cpost,
    corder: state.corder,
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/Artwork').default)
