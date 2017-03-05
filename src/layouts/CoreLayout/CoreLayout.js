import React from 'react'
import Header from '../../components/Header'
import classes from './CoreLayout.scss'
import '../../styles/core.scss'
//import '../../styles/slick.css'

export const CoreLayout = ({ children }) => (
  <div className='text-center'>
    <Header />
    <div className={classes.mainContainer}>
      {children}
    </div>
  </div>
)

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default CoreLayout
