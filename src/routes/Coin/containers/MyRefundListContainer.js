import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { retrieveMyRefunds } from '../modules/refund'
import { retrieveSomePosts } from '../modules/post'

const mapDispatchToProps = {
    goBack,
    retrieveRefunds: retrieveMyRefunds,
    retrieveSomePosts,
}

const mapStateToProps = (state) => ({
    pageName: '我的退款记录',

    postDb: state.cpost.db || {},
    refundDb: state.crefund.db || {},
    refundStatus: state.crefund.retrieveMine || {},
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/MyRefundList').default)
