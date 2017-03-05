import React from 'react'
import classes from './EmptyLayout.scss'

export const EmptyLayout = ({ children }) => (
  <div className={classes.emptyContainer}>
    {children}
  </div>
)

EmptyLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default EmptyLayout
