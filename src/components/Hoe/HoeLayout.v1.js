import _debug from 'debug'
const debug = _debug('app:hoe')
import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import classNames from 'classnames';
import 'styles/global/hoe/hoe.css'
import Measure from 'react-measure'
import _ from 'lodash';

export class HoeLayout extends Component {
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
    }

    handleResize(e) {
        this.setState({windowWidth: window.innerWidth, windowHeight: window.innerHeight});
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    setHeaderWidth ({height}) {
        this.setState({
            headerHeight: height
        });
    }
    toggleSidebar () {
        if (!this.hoeappWrapper || !this.hoeHeader || !this.hoeappContainer) {
            console.log ("not find required components!");
            return false;
        }

        var hoeHeaderClass = [];
        for (var i = 0; i < this.hoeHeader.attributes.length; i++) {
            var attr = this.hoeHeader.attributes[i];
            if (attr.name == 'class') hoeHeaderClass = attr.value.split(' ');
        }
        var hoeappContainerClass = [];
        for (var i = 0; i < this.hoeappContainer.attributes.length; i++) {
            var attr = this.hoeappContainer.attributes[i];
            if (attr.name == 'class') hoeappContainerClass = attr.value.split(' ');
        }
        //console.log ("hoeHeader:", this.hoeHeader, ", class:", hoeHeaderClass, ", attr:", this.hoeHeader.attributes);

        var hoeDeviceType = this.getDeviceType ();

				if (hoeDeviceType !== 'phone') {
            if(_.indexOf (hoeHeaderClass, 'hoe-minimized-lpanel') < 0) {
                hoeHeaderClass.push ('hoe-minimized-lpanel');
            } else {
                _.remove(hoeHeaderClass, (n) => {
                    return n == 'hoe-minimized-lpanel';
                });
            }
            if(_.indexOf (hoeappContainerClass, 'hoe-minimized-lpanel') < 0) {
                hoeappContainerClass.push ('hoe-minimized-lpanel');
            } else {
                _.remove(hoeappContainerClass, (n) => {
                    return n == 'hoe-minimized-lpanel';
                });
            }
				} else {
            if(_.indexOf (hoeHeaderClass, 'hoe-hide-lpanel') < 0) {
                hoeHeaderClass.push ('hoe-hide-lpanel');
            } else {
                _.remove(hoeHeaderClass, (n) => {
                    return n == 'hoe-hide-lpanel';
                });
            }
				}
        console.log ("hoeHeaderClass:", hoeHeaderClass, ",hoeappContainerClass:", hoeappContainerClass);
        this.setState ({hoeHeaderClass, hoeappContainerClass});
    }
    toggleSubMenu (name) {
        if (!this.hoeHeader) {
            console.log ("not find required hoeheader components!");
            return false;
        }
        console.log ("toggleSubMenu:", name);
        var hoeHeaderClass = [];
        for (var i = 0; i < this.hoeHeader.attributes.length; i++) {
            var attr = this.hoeHeader.attributes[i];
            if (attr.name == 'class') hoeHeaderClass = attr.value.split(' ');
        }
        if(_.indexOf (hoeHeaderClass, 'hoe-minimized-lpanel') >= 0) {
            console.log ("in hoe-minimized-lpanel mode, not deal with submenu!");
            return false;
        }

        if (this.state[name]) {
            console.log ("null");
            this.setState ({ [name]: null });
        } else {
            console.log ("opened");
            this.setState ({ [name]: 'opened' });
        }
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
        var contentHeight = this.state.windowHeight - this.state.headerHeight - 2;
        var hoeDeviceType = this.getDeviceType();
        return (
    <div id="hoeapp-wrapper" ref={(c) => this.hoeappWrapper = c} className="hoe-hide-lpanel" data-hoe-device-type={hoeDeviceType}>
        <Measure onMeasure={this.setHeaderWidth.bind(this)}>
        <header id="hoe-header" ref={(c) => this.hoeHeader = c} data-hoe-lpanel-effect="shrink" className={classNames(this.state.hoeHeaderClass)}>
            <div className="hoe-left-header">
                <a href="#"><i className="fa fa-graduation-cap"></i> <span> 智慧能源管理系统V1.0</span></a>
                <span className="hoe-sidebar-toggle"><a href="#" onClick={this.toggleSidebar.bind(this)}></a></span>
            </div>

            <div className="hoe-right-header" data-hoe-position-type="relative" >
                <span className="hoe-sidebar-toggle"><a href="#" onClick={this.toggleSidebar.bind(this)}></a></span>
                <ul className="left-navbar">
					<li className="dropdown hoe-rheader-submenu message-notification">
						<a href="#" className="dropdown-toggle icon-circle" data-toggle="dropdown">
							<i className="fa fa-envelope-o"></i>
							<span className="badge badge-danger">5</span>
						</a>
						<ul className="dropdown-menu ">
							<li className="hoe-submenu-label">
								<h3>You have <span className="bold">5</span> New Messages <a href="#">view all</a></h3>
							</li>
							<li>
								<a href="#" className="clearfix"> 
									<img src="images/avatar-1.jpg" className="img-circle notification-avatar" alt="Avatar"/>
									<span className="notification-title">Nanterey Reslaba</span>
									<span className="notification-ago  ">3 min ago</span>
									<p className="notification-message">Hi James, Don\'t go anywhere, i will be coming soon. </p>
								</a>
							</li> 
							<li>
								<a href="#" className="clearfix"> 
									<img src="images/avatar-2.jpg" className="img-circle notification-avatar" alt="Avatar"/>
									<span className="notification-title">Polly Paton</span>
									<span className="notification-ago  ">5 min ago</span>
									<p className="notification-message">Hi James, Everything is working just fine here. </p>
								</a>
							</li> 
							<li>
								<a href="#" className="clearfix"> 
									<img src="images/avatar-3.jpg" className="img-circle notification-avatar" alt="Avatar"/>
									<span className="notification-title">Smith Doe</span>
									<span className="notification-ago  ">8 min ago</span>
									<p className="notification-message">Please mail me the all files when you complete your task.</p>
								</a>
							</li> 
							<li>
								<a href="#" className="clearfix"> 
									<img src="images/avatar-4.jpg" className="img-circle notification-avatar" alt="Avatar"/>
									<span className="notification-title">Zoey Lombardo</span>
									<span className="notification-ago  ">15 min ago</span>
									<p className="notification-message">Hi James, How are you?</p>
								</a>
							</li> 
							<li>
								<a href="#" className="clearfix"> 
									<img src="images/avatar-5.jpg" className="img-circle notification-avatar" alt="Avatar"/>
									<span className="notification-title">Alan Doyle</span>
									<span className="notification-ago  ">30 min ago</span>
									<p className="notification-message">Call me when you complete your work.</p>
								</a>
							</li> 
						</ul>
					</li>
					<li className="dropdown hoe-rheader-submenu message-notification left-min-30">
						<a href="#" className="dropdown-toggle icon-circle" data-toggle="dropdown" >
							<i className="fa fa-bell-o"></i>
							<span className="badge badge-success">6</span>
						</a>
						<ul className="dropdown-menu ">
							<li className="hoe-submenu-label">
								<h3><span className="bold">6 pending</span> Notification <a href="#">view all</a></h3>
							</li>
							<li>
								<a href="#" className="clearfix"> 
									 <i className="fa fa-database red-text"></i>
									<span className="notification-title">Database overload- Sav3090</span>
									<span className="notification-ago  ">3 min ago</span>
									<p className="notification-message">Database overload due to incorrect queries</p>
								</a>
							</li> 
							<li>
								<a href="#" className="clearfix"> 
									  <i className="fa fa-exchange green-text"></i>   
									<span className="notification-title">Installing App v1.2.1</span>
									<span className="notification-ago  ">60 % Done</span>
									<div className="notification-message"> 
										<div className="progress">
											<div className="progress-bar progress-bar-striped active" role="progressbar"
  aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={ {width:'60%'} }> 60%
											</div>
										</div>
									</div>
								</a>
							</li> 
							<li>
								<a href="#" className="clearfix"> 
									 <i className="fa fa-exclamation-triangle red-text"></i>
									<span className="notification-title">Application Error - Sav3085</span>
									<span className="notification-ago  ">10 min ago</span>
									<p className="notification-message">failed to initialize the application due to error weblogic.application.moduleexception</p>
								</a>
							</li>
							<li>
								<a href="#" className="clearfix"> 
									 <i className="fa fa-server yellow-text"></i>
									<span className="notification-title">Server Status - Sav3080</span>
									<span className="notification-ago  ">30GB Free Space</span>
									<div className="notification-message"> 
										<div className="progress">
											<div className="progress-bar progress-bar-success" role="progressbar" style={ {width:'40%'} }>
												 
											</div>
											<div className="progress-bar progress-bar-warning" role="progressbar" style={ {width:'10%'} }>
												 
											</div>
											<div className="progress-bar progress-bar-danger" role="progressbar" style={ {width:'20%'} }>
												 
											</div>
										</div>
									</div>
								</a>
							</li> 
							<li>
								<a href="#" className="clearfix"> 
									 <i className="fa fa-cogs green-text"></i>
									<span className="notification-title">Application Configured</span>
									<span className="notification-ago  ">30 min ago</span>
									<p className="notification-message">Your setting is updated on server Sav3060</p>
								</a>
							</li>
							<li> 
								<a href="#" className="clearfix"> 
									 <i className="fa fa-server blue-text"></i>
									<span className="notification-title">Server Status</span>
									<span className="notification-ago  ">300GB Free Space</span>
									<div className="notification-message"> 
										<div className="progress">
											<div className="progress-bar progress-bar-info" role="progressbar" style={{width:'80%'}}>
												Free Space
											</div> 
										</div>
									</div>
								</a>
							</li> 
							 
						</ul>
					</li> 
					<li className="dropdown hoe-rheader-submenu message-notification left-min-65">
						<a href="#" className="dropdown-toggle icon-circle" data-toggle="dropdown" >
							<i className="fa fa-tasks"></i>
							<span className="badge badge-danger">4</span>
						</a>
						<ul className="dropdown-menu ">
							<li className="hoe-submenu-label">
								<h3> You have <span className="bold">4 </span>pending Task <a href="#">view all</a></h3>
							</li>
							<li>
								<a href="#" className="clearfix"> 
									<img alt="Avatar" className="img-circle notification-avatar" src="images/avatar-1.jpg"/>
									<span className="notification-title"> Smith Doe Assigned new task </span>
									<span className="notification-ago-1 ">5 min ago</span>
									<p className="notification-message">Provide an Overview key mention characteristics for selected Keyword.</p>
								</a>
							</li>
							<li>
								<a href="#" className="clearfix"> 
									<img alt="Avatar" className="img-circle notification-avatar" src="images/avatar-2.jpg"/>
									<span className="notification-title"> Polly Paton Done his work</span>
									<span className="notification-ago-1 ">10 min ago</span>
									<p className="notification-message">Polly Paton has completed his work. please assign her new task. </p>
								</a>
							</li>
							<li>
								<a href="#" className="clearfix"> 
									<img alt="Avatar" className="img-circle notification-avatar" src="images/avatar-5.jpg"/>
									<span className="notification-title">Alan Installing App v1.2.1</span>
									<span className="notification-ago-1 ">15 min ago</span>
									<div className="notification-message"> 
										Alan Installing App v1.2.1 on server Sav3080
										<div className="progress">
											<div className="progress-bar progress-bar-striped active" role="progressbar"
  aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={ {width:'60%'} }> 60%
											</div>
										</div>
									</div>
								</a>
							</li>
							<li>
								<a href="#" className="clearfix"> 
									<img alt="Avatar" className="img-circle notification-avatar" src="images/avatar-4.jpg"/>
									<span className="notification-title"> Zoey Lombardo like your task</span>
									<span className="notification-ago-1 ">20 min ago</span>
									<p className="notification-message">Zoey Lombardo like your server installation task.</p>
								</a>
							</li>
							 
						</ul>
					</li>
					<li>
						<form method="post" className="hoe-searchbar">
							<input type="text" placeholder="Search..." name="keyword" className="form-control"/>
							<span className="search-icon"><i className="fa fa-search"></i></span>
						</form>
					</li>
					
				</ul> 
				
                <ul className="right-navbar">
					<li className="dropdown hoe-rheader-submenu hoe-header-profile">
						<a href="#" className="dropdown-toggle" data-toggle="dropdown">
							<span><img className="img-circle " src="images/avatar-1.jpg"/></span>
                            <span>James <b>Bond</b> <i className=" fa fa-angle-down"></i></span>
						</a> 
						<ul className="dropdown-menu ">
							<li><a href="#"><i className="fa fa-user"></i>My Profile</a></li>
							<li><a href="#"><i className="fa fa-calendar"></i>My Calendar</a></li>
							<li><a href="#"><i className="fa fa-envelope"></i>My Inbox  <span className="badge badge-danger">
							3 </span></a></li>
							<li><a href="#"><i className="fa fa-rocket"></i>My Tasks <span className="badge badge-success">
							7 </span></a></li>
							<li><a href="#"><i className="fa fa-lock"></i>Lock Screen</a></li>
							<li><a href="#"><i className="fa fa-power-off"></i>Logout</a></li>
						</ul>
					</li>
					<li className="dropdown hoe-rheader-submenu hidden-xs">
						<a href="#" className="dropdown-toggle icon-circle" data-toggle="dropdown"><i className="fa fa-ellipsis-h"></i></a> 
					</li> 
				</ul>
				
            </div>
        </header>
        </Measure>

        <div id="hoeapp-container" ref={(c) => this.hoeappContainer = c} data-hoe-color-type="lpanel-bg2" data-hoe-lpanel-effect="shrink" className={classNames(this.state.hoeappContainerClass)}>
            <aside id="hoe-left-panel" data-hoe-position-type="absolute">
                <div className="profile-box">
                    <div className="media">
                        <a className="pull-left" href="user-profile.html">
                            <img className="img-circle" src="images/avatar-1.jpg"/>
                        </a>
                        <div className="media-body">
                            <h5 className="media-heading">欢迎 <span>冯广威</span></h5>
                            <small>软件架构师</small>
                        </div>
                    </div>
                </div>
                <ul className="nav panel-list">
                    <li className="nav-level">导航菜单</li>
                    <li className="active">
                        <a href="javascript:void(0)">
                            <i className="fa fa-tachometer"></i>
                            <span className="menu-text" placeholder="Dashboard">管理控制台</span>
                            <span className="selected"></span>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0)">
                            <i className="fa fa-bar-chart"></i>
                            <span className="menu-text">图表</span>
                            <span className="label sul">New</span>
                            <span className="selected"></span>
                        </a>
                    </li>
                    <li className={classNames("hoe-has-menu",this.state.submenu1)}>
                        <a href="javascript:void(0)" onClick={ () => this.toggleSubMenu('submenu1') }>
                            <i className="fa fa-files-o"></i>
                            <span className="menu-text">资源管理(文件)</span>
                            <span className="selected"></span>
                        </a>
                        <ul className="hoe-sub-menu">
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">资源列表</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">上传资源</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">User Profile</span>
                                    <span className="label sul">Updated</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">Team Member</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">Time Line</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className={classNames("hoe-has-menu",this.state.submenu2)}>
                        <a href="javascript:void(0)" onClick={ () => this.toggleSubMenu('submenu2') }>
                            <i className="fa fa-envelope-o"></i>
                            <span className="menu-text">Email Templates</span>
                            <span className="selected"></span>
                        </a>
                        <ul className="hoe-sub-menu">

                            <li className={classNames("hoe-has-menu",this.state.submenu3)}>
                                <a href="javascript:void(0)" onClick={ () => this.toggleSubMenu('submenu3') }>
                                    <span className="menu-text">Inbox </span>
                                    <span className="selected"></span>
                                </a>
                                <ul className="hoe-sub-menu">
                                    <li>
                                        <a href="javascript:void(0)">
                                            <span className="menu-text">Inbox v1</span>
                                            <span className="selected"></span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">
                                            <span className="menu-text">Inbox v2</span>
                                            <span className="selected"></span>
                                        </a>
                                    </li>
                                    
                                </ul>
                            </li>
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">Detail</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">Compose</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
							<li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">Send</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
							<li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">Draft</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-level">Components</li>
                    <li className={classNames("hoe-has-menu",this.state.submenu4)}>
                        <a href="javascript:void(0)" onClick={ () => this.toggleSubMenu('submenu4') }>
                            <i className="fa fa-pencil-square-o"></i>
                            <span className="menu-text">UI Elements</span>
                            <span className="selected"></span>
                        </a>
                        <ul className="hoe-sub-menu">
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">Icon</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">Buttons</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">Tabs & Panel</span>
                                    <span className="label sul">Updated</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">Notification</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">Typography</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="javascript:void(0)">
                            <i className="fa fa-table"></i>
                            <span className="menu-text">Table</span> 
                            <span className="selected"></span>
                        </a>
                    </li>
                    <li className="nav-level">Menu Lavel</li>
                    <li className={classNames("hoe-has-menu",this.state.submenu5)}>
                        <a href="javascript:void(0)" onClick={ () => this.toggleSubMenu('submenu5') }>
                            <i className="fa fa-sitemap"></i>
                            <span className="menu-text">Menu Lavel 1</span>
                            <span className="selected"></span>
                        </a>
                        <ul className="hoe-sub-menu">
							<li>
                                <a href="javascript:void(0)">
									<span className="menu-text">level 2</span>
									<span className="selected"></span>
                                </a>
                            </li>
							<li>
                                <a href="javascript:void(0)">
									<span className="menu-text">level 2</span>
									<span className="selected"></span>
                                </a>
                            </li>
                            <li className={classNames("hoe-has-menu",this.state.submenu6)}>
                                <a href="javascript:void(0)" onClick={ () => this.toggleSubMenu('submenu6') }>
                                    <span className="menu-text">level 2</span>
                                    <span className="selected"></span>
                                </a>
                                <ul className="hoe-sub-menu">
                                    <li className={classNames("hoe-has-menu",this.state.submenu7)}>
                                        <a href="javascript:void(0)" onClick={ () => this.toggleSubMenu('submenu7') }>
                                            <span className="menu-text">level 3</span>
                                            <span className="selected"></span>
                                        </a>
                                        <ul className="hoe-sub-menu">
                                            <li>
                                                <a href="javascript:void(0)">
                                                    <span className="menu-text">level 4</span>
                                                    <span className="selected"></span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0)">
                                                    <span className="menu-text">level 4</span>
                                                    <span className="selected"></span>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">
                                            <span className="menu-text">level 3</span>
                                            <span className="selected"></span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">
                                            <span className="menu-text">level 3</span>
                                            <span className="selected"></span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">
                                            <span className="menu-text">level 3</span>
                                            <span className="selected"></span>
                                        </a>
                                    </li>
                                </ul>
                            </li>  
                        </ul>
                    </li>
                </ul>
            </aside>
            <section id="main-content" style={ {minHeight:contentHeight} }>
                { this.props.children }
            </section>
			<div id="styleSelector">
                <div className="selector-toggle">
                    <a href="javascript:void(0)"></a>
                </div>
                <ul>
                    <li>
                        <p className="selector-title">Style Selector</p>
                    </li>
                    <li className="theme-option">
                        <span className="sub-title">Header BG Color Option</span>
                        <div id="theme-color">
                            <a href="#" className="header-bg" data-hoe-color-type="header-bg1">&nbsp;</a>
                            <a href="#" className="header-bg" data-hoe-color-type="header-bg2">&nbsp;</a>
                            <a href="#" className="header-bg" data-hoe-color-type="header-bg3">&nbsp;</a>
                            <a href="#" className="header-bg" data-hoe-color-type="header-bg4">&nbsp;</a>
                            <a href="#" className="header-bg" data-hoe-color-type="header-bg5">&nbsp;</a>
                            <a href="#" className="header-bg" data-hoe-color-type="header-bg6">&nbsp;</a>
                            <a href="#" className="header-bg" data-hoe-color-type="header-bg7">&nbsp;</a>
                            <a href="#" className="header-bg" data-hoe-color-type="header-bg8">&nbsp;</a>
                            <a href="#" className="header-bg" data-hoe-color-type="header-bg9">&nbsp;</a>
                        </div>
                    </li>
                    <li className="theme-option">
                        <span className="sub-title">Left Panel BG Color Option</span>
                        <div id="theme-color">
                            <a href="#" className="lpanel-bg" data-hoe-color-type="lpanel-bg1">&nbsp;</a>
                            <a href="#" className="lpanel-bg" data-hoe-color-type="lpanel-bg2">&nbsp;</a>
                            <a href="#" className="lpanel-bg" data-hoe-color-type="lpanel-bg3">&nbsp;</a>
                            <a href="#" className="lpanel-bg" data-hoe-color-type="lpanel-bg4">&nbsp;</a>
                            <a href="#" className="lpanel-bg" data-hoe-color-type="lpanel-bg5">&nbsp;</a>
                            <a href="#" className="lpanel-bg" data-hoe-color-type="lpanel-bg6">&nbsp;</a>
                            <a href="#" className="lpanel-bg" data-hoe-color-type="lpanel-bg7">&nbsp;</a>
                            <a href="#" className="lpanel-bg" data-hoe-color-type="lpanel-bg8">&nbsp;</a>
                            <a href="#" className="lpanel-bg" data-hoe-color-type="lpanel-bg9">&nbsp;</a>
                        </div>
                    </li>
                    <li className="theme-option">
                        <span className="sub-title">Logo Color BG Option</span>
                        <div id="theme-color">
                            <a href="#" className="logo-bg" data-hoe-color-type="logo-bg1">&nbsp;</a>
                            <a href="#" className="logo-bg" data-hoe-color-type="logo-bg2">&nbsp;</a>
                            <a href="#" className="logo-bg" data-hoe-color-type="logo-bg3">&nbsp;</a>
                            <a href="#" className="logo-bg" data-hoe-color-type="logo-bg4">&nbsp;</a>
                            <a href="#" className="logo-bg" data-hoe-color-type="logo-bg5">&nbsp;</a>
                            <a href="#" className="logo-bg" data-hoe-color-type="logo-bg6">&nbsp;</a>
                            <a href="#" className="logo-bg" data-hoe-color-type="logo-bg7">&nbsp;</a>
                            <a href="#" className="logo-bg" data-hoe-color-type="logo-bg8">&nbsp;</a>
                            <a href="#" className="logo-bg" data-hoe-color-type="logo-bg9">&nbsp;</a>
                        </div>
                    </li>
					<li className="theme-option">
                        <span className="sub-title">Theme Background BG Option</span>
                        <div id="theme-color">
                            <a href="#" className="theme-bg" data-hoe-themebg-type="bg1">&nbsp;</a>
                            <a href="#" className="theme-bg" data-hoe-themebg-type="bg2">&nbsp;</a>
                            <a href="#" className="theme-bg" data-hoe-themebg-type="bg3">&nbsp;</a>
                            <a href="#" className="theme-bg" data-hoe-themebg-type="bg4">&nbsp;</a>
                            <a href="#" className="theme-bg" data-hoe-themebg-type="bg5">&nbsp;</a>
                            <a href="#" className="theme-bg" data-hoe-themebg-type="bg6">&nbsp;</a>
                            <a href="#" className="theme-bg" data-hoe-themebg-type="bg7">&nbsp;</a>
                            <a href="#" className="theme-bg" data-hoe-themebg-type="bg8">&nbsp;</a>
                            <a href="#" className="theme-bg" data-hoe-themebg-type="bg9">&nbsp;</a>
                        </div>
                    </li>
					<li className="theme-option">
                        <span className="sub-title">Theme Layout</span>
                        <select id="theme-layout" className="form-control minimal input-sm">
                            <option name="theme-layout" value="wide-layout">Wide Layout</option>
                            <option name="theme-layout" value="box-layout">Boxed Layout</option> 
                        </select>
                    </li>
                    <li className="theme-option">
                        <span className="sub-title">SideBar Effect</span>
                        <select id="leftpanel-effect" className="form-control minimal input-sm">
                            <option name="lpanel-effect" value="shrink">Default</option>
                            <option name="lpanel-effect" value="overlay">Overlay</option>
                            <option name="lpanel-effect" value="push">Push</option>
                        </select>
                    </li>
					<li className="theme-option">
                        <span className="sub-title">Navigation Type</span>
                        <select id="navigation-type" className="form-control minimal input-sm">
                            <option name="navigation-type" value="vertical">Vertical</option>
							<option name="navigation-type" value="vertical-compact">Vertical Compact</option>
                            <option name="navigation-type" value="horizontal">Horizontal</option>
							<option name="navigation-type" value="horizontal-compact">Horizontal compact</option>
                        </select>
                    </li>
					<li className="theme-option">
                        <span className="sub-title">Navigation Side</span>
                        <select id="navigation-side" className="form-control minimal input-sm">
                            <option name="navigation-side" value="leftside">Left</option>
							<option name="navigation-side" value="rightside">Right</option>
                        </select>
                    </li>
                    <li className="theme-option">
                        <span className="sub-title">Sidebar Position</span>
                        <select id="sidebar-position" className="form-control minimal input-sm">
                            <option name="sidebar-position" value="default">Default</option>
                            <option name="sidebar-position" value="fixed">Fixed</option>
                        </select>
                    </li>
                </ul>
            </div>
        </div>
    </div>
        );
    }
}

HoeLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}


export default HoeLayout
