import _debug from 'debug'
const debug = _debug('app:hoe')
import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import classNames from 'classnames';
import 'styles/global/hoe/hoe.css'
import _ from 'lodash';




export class Layout extends Component {
    constructor (props) {
        super (props);
        this.state = {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            headerHeight: 50,
            hoeHeaderClass: null,
            hoeappContainerClass: null,
        };
        this.hoeappWrapper = null;
        this.hoeHeader = null;
        this.hoeappContainer = null;
        this._domLoaded = false;
    }

    handleResize(e) {
        if (this._domLoaded)
            this.setState({windowWidth: window.innerWidth, windowHeight: window.innerHeight});
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize.bind(this));
        this._domLoaded = true;
    }

    componentWillUnmount() {
        this._domLoaded = false;
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    getDeviceType (width) {
        var gwidth = width || this.state.windowWidth;
        var hoeDeviceType = 'desktop';
        if (gwidth >= 768 && gwidth <= 1024) hoeDeviceType = 'tablet';
        else if (gwidth < 768) hoeDeviceType = 'phone';
        else hoeDeviceType = 'desktop';
        return hoeDeviceType;
    }
    render () {
        console.log ("render state:", this.state);
        const { login, doLogout } = this.props;
        var hoeDeviceType = this.getDeviceType();
       
        return (
    <div id="hoeapp-wrapper" ref={(c) => this.hoeappWrapper = c} className="hoe-hide-lpanel" data-hoe-device-type={hoeDeviceType} >
        <header id="hoe-header" ref={(c) => this.hoeHeader = c} data-hoe-lpanel-effect="shrink" className={classNames(this.state.hoeHeaderClass)}>
            <div className="hoe-left-header">
                <a href="#"><i className="fa fa-graduation-cap"></i> <span> 智慧能源管理系统V1.0</span></a>
                <span className="hoe-sidebar-toggle"><a href="#"></a></span>
            </div>

            <div className="hoe-right-header" data-hoe-position-type="relative" >
                <span className="hoe-sidebar-toggle"><a href="#"></a></span>
        <ul className="left-navbar">
					<li className={classNames("dropdown hoe-rheader-submenu message-notification")}>
						<a href="#" className="dropdown-toggle icon-circle" data-toggle="dropdown">
							<i className="fa fa-envelope-o"></i>
							<span className="badge badge-danger">5</span>
						</a>
					</li>
					<li className={classNames("dropdown hoe-rheader-submenu message-notification left-min-30")}>
						<a href="#" className="dropdown-toggle icon-circle" data-toggle="dropdown" >
							<i className="fa fa-bell-o"></i>
							<span className="badge badge-success">6</span>
						</a>
					</li> 
					<li className={classNames("dropdown hoe-rheader-submenu message-notification left-min-65")}>
						<a href="#" className="dropdown-toggle icon-circle" data-toggle="dropdown">
							<i className="fa fa-tasks"></i>
							<span className="badge badge-danger">4</span>
						</a>
					</li>
					<li>
						<form method="post" className="hoe-searchbar">
							<input type="text" placeholder="Search..." name="keyword" className="form-control"/>
							<span className="search-icon"><i className="fa fa-search"></i></span>
						</form>
					</li>
					
				</ul> 
				
        <ul className="right-navbar">
					<li className={classNames("dropdown hoe-rheader-submenu hoe-header-profile")}>
						<a href="#" className="dropdown-toggle" data-toggle="dropdown">
							<span><img className="img-circle " src="/images/avatar-1.png"/></span>
              <span>  <b>{(login && login.user && login.user.username) || '未登录'}</b> <i className=" fa fa-angle-down"></i></span>
						</a> 
					</li>
				</ul>
				
        </div>
        </header>

        <div id="hoeapp-container" ref={(c) => this.hoeappContainer = c} data-hoe-color-type="lpanel-bg2" data-hoe-lpanel-effect="shrink" className={classNames(this.state.hoeappContainerClass)}>
            <section id="main-content" style={{marginLeft:0, listStyle:'none'}}>
                { this.props.children }
            </section>
        </div>
    </div>
        );
    }
}

Layout.propTypes = {
  children: React.PropTypes.element.isRequired
}


export default Layout
