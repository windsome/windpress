import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'

const mapDispatchToProps = {
    goBack,
}

const mapStateToProps = (state) => ({
    images:['/uploads/1.jpg','/test/1.jpg','/test/2.jpg','/test/3.jpg','/test/4.jpg','/test/5.jpg','/test/6.jpg'],
})

export default connect(mapStateToProps, mapDispatchToProps)(require('../components/Search').default)
