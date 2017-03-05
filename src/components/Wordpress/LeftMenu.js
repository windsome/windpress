import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import classes from './Styles.scss'
import classNames from 'classnames';
//import Measure from 'react-measure'
import _ from 'lodash';

export class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.collapse1 = null;
    }

    setCollapse () {
        var width = this.collapse1 && this.collapse1.getBoundingClientRect().width;
        var collapse = false;
        if (width > 5) {
            collapse = true;
        }
        this.setState ( {
            collapse: collapse
        });
    }

    render() {
        var collapseClass = classNames("hidden-xs");
        //console.log ("state:", this.state);
        if (!_.isNil(this.state.collapse)) {
            if (this.state.collapse) {
                // need to hidden
                collapseClass = classNames("hidden");
            } else {
                // need to show
                collapseClass = classNames("wp-sidebar-text-show");
            }
        }
        return (
        <nav className="navbar navbar-inverse navbar-left wp-sidebar-container wp-menu" role="navigation">
            <ul className="nav sidebar-nav">
                <li>
                    <a href="#">
                      <i className="glyphicon glyphicon-dashboard wp-menu-icon"></i>
                      <span className={collapseClass}> Dashboard </span>
                    </a>
                </li>
                <li>
                    <a href="#">
                      <i className="glyphicon glyphicon-book wp-menu-icon"></i> 
                      <span className={collapseClass}> Posts </span>
                    </a>
                </li>
                <li>
                    <a href="#">
                      <i className="glyphicon glyphicon-picture wp-menu-icon"></i> 
                      <span className={collapseClass}> Medias </span>
                   </a>
                </li>
                <li>
                    <a href="#">
                      <i className="glyphicon glyphicon-comment wp-menu-icon"></i> 
                      <span className={collapseClass}> Comments </span>
                    </a>
                </li>
                <li>
                    <Link to='/admin/devices'>
                      <i className="glyphicon glyphicon-inbox wp-menu-icon"></i> 
                      <span className={collapseClass}> 设备升级 </span>
                    </Link>
                </li>
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                    <i className="glyphicon glyphicon-plus wp-menu-icon"></i>  
                    <span className={collapseClass}> Dropdown </span>
                    <span className="caret"></span>
                  </a>
                  <ul className="dropdown-menu" role="menu">
                    <li className="dropdown-header">{'Dropdown heading'}</li>
                    <li><a href="#">Action</a></li>
                    <li><a href="#">{'Another action'}</a></li>
                    <li><a href="#">{'Something else here'}</a></li>
                    <li><a href="#">{'Separated link'}</a></li>
                    <li><a href="#">{'One more separated link'}</a></li>
                  </ul>
                </li>
                <li>
                    <a href="#">
                      <i className="glyphicon glyphicon-user wp-menu-icon"></i> 
                      <span className={collapseClass}> Users </span>
                    </a>
                </li>
                <li>
                    <a href="#">
                      <i className="glyphicon glyphicon-cog wp-menu-icon"></i> 
                      <span className={collapseClass}> Settings </span>
                    </a>
                </li>
                <li>
                    <a onClick={this.setCollapse.bind(this)}>
                      <i className="glyphicon glyphicon-menu-left wp-menu-icon"></i>
                      <span className={collapseClass} ref={(input) => { this.collapse1 = input; }}> Collapse Menu </span>
                    </a>
                </li>
            </ul>
        </nav>
        )
    }
}

export default SideBar;
