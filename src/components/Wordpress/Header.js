import React from 'react'
import { IndexLink, Link } from 'react-router'
import classes from './Styles.scss'
import classNames from 'classnames';

const Menu1 = () => (
<ul className="nav nav-pills wp-menu">
  <li role="presentation" className="active"><a href="#">
    <span className="glyphicon glyphicon-menu-hamburger wp-menu-icon"></span>
    <span className="hidden-xs"> Menu </span>
  </a></li>
  <li role="presentation"><a href="#">
    <span className="glyphicon glyphicon-th-large wp-menu-icon"></span>
    <span className="hidden-xs"> About </span>
  </a></li>
  <li role="presentation"><a href="#">
    <span className="glyphicon glyphicon-home wp-menu-icon"></span>
    <span className="hidden-xs"> Home </span>
  </a></li>
  <li role="presentation"><a href="#">
    <span className="glyphicon glyphicon-refresh wp-menu-icon"></span>
    <span className="hidden-xs"> Refresh </span>
  </a></li>
  <li role="presentation"><a href="#">
    <span className="glyphicon glyphicon-comment wp-menu-icon"></span>
    <span className="hidden-xs"> Comment </span>
  </a></li>
  <li role="presentation"><a href="#">
    <span className="glyphicon glyphicon-plus wp-menu-icon"></span>
    <span className="hidden-xs"> Add </span>
  </a></li>
</ul>
)

const Menu2 = () => (
<ul className="nav nav-pills wp-menu">
  <li role="presentation"><a href="#">
    <span className="glyphicon glyphicon-user"></span>
    <span className="hidden-xs"> User </span>
  </a></li>
</ul>
)

export const Header = (props) => (
  <div className="row wp-menu-container">
    <div className="pull-left"> <Menu1 /> </div>
    <div className="pull-right"> <Menu2 /> </div>
  </div>
)

export default Header
