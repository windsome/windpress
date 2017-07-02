import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'

const mapDispatchToProps = {
    goBack,
}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/OnlyWechat').default)
