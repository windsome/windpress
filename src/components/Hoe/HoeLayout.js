import _debug from 'debug'
const debug = _debug('app:hoe')
import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import classNames from 'classnames';
import 'styles/global/hoe/hoe.css'
import Measure from 'react-measure'
import _ from 'lodash';


const MessageDropbox = () => (
						<ul className="dropdown-menu " onClick={ (e) => e.stopPropagation() }>
							<li className="hoe-submenu-label">
								<h3>你有 <span className="bold">5</span> 条新信息 <a href="#">查看所有</a></h3>
							</li>
							<li>
								<a href="#" className="clearfix"> 
									<img src="/images/avatar-1.jpg" className="img-circle notification-avatar" alt="Avatar"/>
									<span className="notification-title">yadamo.yang</span>
									<span className="notification-ago  ">3 分钟前</span>
									<p className="notification-message">小比，赶紧给我死回来. </p>
								</a>
							</li> 
							<li>
								<a href="#" className="clearfix"> 
									<img src="/images/avatar-2.jpg" className="img-circle notification-avatar" alt="Avatar"/>
									<span className="notification-title">陈总</span>
									<span className="notification-ago  ">5 分钟前</span>
									<p className="notification-message">别他妈虾比比. </p>
								</a>
							</li> 
							<li>
								<a href="#" className="clearfix"> 
									<img src="/images/avatar-3.jpg" className="img-circle notification-avatar" alt="Avatar"/>
									<span className="notification-title">小王</span>
									<span className="notification-ago  ">8 分钟前</span>
									<p className="notification-message">赶紧给我传点种子过来.</p>
								</a>
							</li> 
							<li>
								<a href="#" className="clearfix"> 
									<img src="/images/avatar-4.jpg" className="img-circle notification-avatar" alt="Avatar"/>
									<span className="notification-title">牛鲜花</span>
									<span className="notification-ago  ">15 分钟前</span>
									<p className="notification-message">这世道人心不古，生意不好做啊！</p>
								</a>
							</li> 
							<li>
								<a href="#" className="clearfix"> 
									<img src="/images/avatar-5.jpg" className="img-circle notification-avatar" alt="Avatar"/>
									<span className="notification-title">毕县长</span>
									<span className="notification-ago  ">30 分钟前</span>
									<p className="notification-message">完事叫我，一小时后开会.</p>
								</a>
							</li> 
						</ul>

)

const PendingNotificationDropbox = () => (
						<ul className="dropdown-menu"  onClick={ (e) => e.stopPropagation() }>
							<li className="hoe-submenu-label">
								<h3><span className="bold">6 </span> 条未处理通知 <a href="#">查看所有</a></h3>
							</li>
							<li>
								<a href="#" className="clearfix"> 
									 <i className="fa fa-database red-text"></i>
									<span className="notification-title">数据库超载</span>
									<span className="notification-ago  ">3 分钟前</span>
									<p className="notification-message">有多条大查询发生，数据库响应变慢</p>
								</a>
							</li> 
							<li>
								<a href="#" className="clearfix"> 
									  <i className="fa fa-exchange green-text"></i>   
									<span className="notification-title">安装插件智能锁客栈 v1.1.1</span>
									<span className="notification-ago  ">60 % 完成</span>
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
									<span className="notification-title">应用程序报错 - Sav3085</span>
									<span className="notification-ago  ">10 分钟前</span>
									<p className="notification-message">websocket超载，连接数太多，是不是需要搞负载均衡？</p>
								</a>
							</li>
							<li>
								<a href="#" className="clearfix"> 
									 <i className="fa fa-server yellow-text"></i>
									<span className="notification-title">服务器状态 - Sav3080</span>
									<span className="notification-ago  ">还剩下30GB 空闲空间</span>
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
									<span className="notification-title">系统设置修改</span>
									<span className="notification-ago  ">30 分钟前</span>
									<p className="notification-message">您的设置已经修改并在Sav3060服务器上生效</p>
								</a>
							</li>
							<li> 
								<a href="#" className="clearfix"> 
									 <i className="fa fa-server blue-text"></i>
									<span className="notification-title">服务器状态</span>
									<span className="notification-ago  ">300GB空闲空间</span>
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

)

const PendingTaskDropbox = () => (
						<ul className="dropdown-menu"  onClick={ (e) => e.stopPropagation() }>
							<li className="hoe-submenu-label">
								<h3> 你有 <span className="bold">4 </span>条待处理任务 <a href="#">查看所有</a></h3>
							</li>
							<li>
								<a href="#" className="clearfix"> 
									<img alt="Avatar" className="img-circle notification-avatar" src="/images/avatar-1.jpg"/>
									<span className="notification-title"> 朱厂长分配的任务 </span>
									<span className="notification-ago-1 ">5 分钟前</span>
									<p className="notification-message">今天下班前把采购报表发给我.</p>
								</a>
							</li>
							<li>
								<a href="#" className="clearfix"> 
									<img alt="Avatar" className="img-circle notification-avatar" src="/images/avatar-2.jpg"/>
									<span className="notification-title"> 谢秘书任务完成待您审批</span>
									<span className="notification-ago-1 ">10 分钟前</span>
									<p className="notification-message">已经将客户资料准备好，待下一步指示. </p>
								</a>
							</li>
							<li>
								<a href="#" className="clearfix"> 
									<img alt="Avatar" className="img-circle notification-avatar" src="/images/avatar-5.jpg"/>
									<span className="notification-title"> 阿兰已经接待客户，并在开会讨论项目</span>
									<span className="notification-ago-1 ">15 分钟前</span>
									<div className="notification-message"> 
										项目讨论进度
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
									<img alt="Avatar" className="img-circle notification-avatar" src="/images/avatar-4.jpg"/>
									<span className="notification-title"> 谁的狗屎任务，咋干</span>
									<span className="notification-ago-1 ">20 分钟前</span>
									<p className="notification-message">草，不知道咋整，谁发的任务谁干.</p>
								</a>
							</li>
							 
						</ul>

)

const ProfileDropbox = ({ doLogout }) => (
						<ul className="dropdown-menu " onClick={ (e) => e.stopPropagation() }>
							<li><a href="#"><i className="fa fa-user"></i>我的信息</a></li>
							<li><a href="#"><i className="fa fa-calendar"></i>我的日历</a></li>
							<li><a href="#"><i className="fa fa-envelope"></i>我的邮箱<span className="badge badge-danger">	3 </span></a></li>
							<li><a href="#"><i className="fa fa-rocket"></i>我的任务<span className="badge badge-success">	7 </span></a></li>
							<li><a href="#" onClick={doLogout}><i className="fa fa-power-off"></i>退出</a></li>
						</ul>
)

const StyleSelectorContainer = () => (
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
)

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
        var contentHeight = this.state.windowHeight - this.state.headerHeight - 2;
        var hoeDeviceType = this.getDeviceType();
        var calLinkClasses = (link, classes=null) => {
            var path = this.props.location.pathname;
            if (path == link) return classNames(classes, 'active');
            else return classNames(classes);
        }
        var toggleDropdown = (name, e) => {
            console.log ("toggleDropdown:"+name);
            e && e.stopPropagation();
            this.setState({dropdown:(!this.state.dropdown || this.state.dropdown != name)?name:null });
        }
        var clearDropdown = () => {
            console.log ("clicked!!!"+this.state.dropdown); 
            this.state.dropdown && this.setState({dropdown:null}); 
        }
       
        return (
    <div id="hoeapp-wrapper" ref={(c) => this.hoeappWrapper = c} className="hoe-hide-lpanel" data-hoe-device-type={hoeDeviceType} onClick={ () => clearDropdown() } >
        <Measure onMeasure={this.setHeaderWidth.bind(this)}>
        <header id="hoe-header" ref={(c) => this.hoeHeader = c} data-hoe-lpanel-effect="shrink" className={classNames(this.state.hoeHeaderClass)}>
            <div className="hoe-left-header">
                <a href="#"><i className="fa fa-graduation-cap"></i> <span> 智慧能源管理系统V1.0</span></a>
                <span className="hoe-sidebar-toggle"><a href="#" onClick={this.toggleSidebar.bind(this)}></a></span>
            </div>

            <div className="hoe-right-header" data-hoe-position-type="relative" >
                <span className="hoe-sidebar-toggle"><a href="#" onClick={this.toggleSidebar.bind(this)}></a></span>
                <ul className="left-navbar">
					<li className={classNames("dropdown hoe-rheader-submenu message-notification",this.state.dropdown == 'dropdown1' && 'open')}>
						<a href="#" className="dropdown-toggle icon-circle" data-toggle="dropdown" onClick={ (e) => toggleDropdown('dropdown1',e) }>
							<i className="fa fa-envelope-o"></i>
							<span className="badge badge-danger">5</span>
						</a>
            <MessageDropbox />
					</li>
					<li className={classNames("dropdown hoe-rheader-submenu message-notification left-min-30",this.state.dropdown == 'dropdown2' && 'open')}>
						<a href="#" className="dropdown-toggle icon-circle" data-toggle="dropdown" onClick={ (e) => toggleDropdown('dropdown2',e) }>
							<i className="fa fa-bell-o"></i>
							<span className="badge badge-success">6</span>
						</a>
            <PendingNotificationDropbox />
					</li> 
					<li className={classNames("dropdown hoe-rheader-submenu message-notification left-min-65",this.state.dropdown == 'dropdown3' && 'open')}>
						<a href="#" className="dropdown-toggle icon-circle" data-toggle="dropdown" onClick={ (e) => toggleDropdown('dropdown3',e) }>
							<i className="fa fa-tasks"></i>
							<span className="badge badge-danger">4</span>
						</a>
            <PendingTaskDropbox/>
					</li>
					<li>
						<form method="post" className="hoe-searchbar">
							<input type="text" placeholder="Search..." name="keyword" className="form-control"/>
							<span className="search-icon"><i className="fa fa-search"></i></span>
						</form>
					</li>
					
				</ul> 
				
        <ul className="right-navbar">
					<li className={classNames("dropdown hoe-rheader-submenu hoe-header-profile",this.state.dropdown == 'dropdown4' && 'open')}>
						<a href="#" className="dropdown-toggle" data-toggle="dropdown" onClick={ (e) => toggleDropdown('dropdown4',e) } >
							<span><img className="img-circle " src="/images/avatar-1.png"/></span>
              <span>  <b>{(login && login.user && login.user.username) || '未登录'}</b> <i className=" fa fa-angle-down"></i></span>
						</a> 
            <ProfileDropbox doLogout={ doLogout }/>
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
                            <img className="img-circle" src="/images/avatar-1.png"/>
                        </a>
                        <div className="media-body">
                            <h5 className="media-heading">欢迎 <span>{(login && login.user && (login.user.displayName || login.user.username)) || '您'}</span></h5>
                            <small>软件架构师</small>
                        </div>
                    </div>
                </div>
                <ul className="nav panel-list">
                    <li className="nav-level">导航菜单</li>
                    <li className={calLinkClasses('/admin/dashboard')}>
                        <Link to='/admin/dashboard'>
                            <i className="fa fa-tachometer"></i>
                            <span className="menu-text" placeholder="Dashboard">管理控制台</span>
                            <span className="selected"></span>
                        </Link>
                    </li>
                    <li>
                        <a href="javascript:void(0)">
                            <i className="fa fa-bar-chart"></i>
                            <span className="menu-text">图表</span>
                            <span className="label sul">New</span>
                            <span className="selected"></span>
                        </a>
                    </li>
                    <li className={classNames("hoe-has-menu",this.state.submenu == 'submenu1' && 'opened')}>
                        <a href="javascript:void(0)"  onClick={ () => this.setState({submenu:(!this.state.submenu || this.state.submenu != 'submenu1')?'submenu1':null }) }>
                            <i className="fa fa-files-o"></i>
                            <span className="menu-text">资源管理(文件)</span>
                            <span className="selected"></span>
                        </a>
                        <ul className="hoe-sub-menu">
                            <li>
                                <Link to='/admin/resources'>
                                    <span className="menu-text">资源列表</span>
                                    <span className="selected"></span>
                                </Link>
                            </li>
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">上传文件资源</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                            <li>
                                <Link to='/admin/posts'>
                                    <span className="menu-text">Post管理</span>
                                    <span className="selected"></span>
                                </Link>
                            </li>
                            <li>
                                <Link to='/admin/posts/create'>
                                    <span className="menu-text">新建Post</span>
                                    <span className="selected"></span>
                                </Link>
                            </li>
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">评论管理</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">商品信息管理</span>
                                    <span className="label sul">Updated</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className={classNames("hoe-has-menu",this.state.submenu == 'submenu2' && 'opened')}>
                        <a href="javascript:void(0)" onClick={ () => this.setState({submenu:(!this.state.submenu || this.state.submenu != 'submenu2')?'submenu2':null }) }>
                            <i className="glyphicon glyphicon-inbox"></i>
                            <span className="menu-text">设备管理</span>
                            <span className="selected"></span>
                        </a>
                        <ul className="hoe-sub-menu">
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">设备列表</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">扫描发现设备</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                            <li className={calLinkClasses('/admin/devices')}>
                                <Link to='/admin/devices'>
                                    <span className="menu-text">设备升级</span>
                                    <span className="label sul">Updated</span>
                                    <span className="selected"></span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className={classNames("hoe-has-menu",this.state.submenu == 'submenu3' && 'opened')}>
                        <a href="javascript:void(0)" onClick={ () => this.setState({submenu:(!this.state.submenu || this.state.submenu != 'submenu3')?'submenu3':null }) }>
                            <i className="fa fa-envelope-o"></i>
                            <span className="menu-text">邮件管理</span>
                            <span className="selected"></span>
                        </a>
                        <ul className="hoe-sub-menu">

                            <li className={classNames("hoe-has-menu",this.state.submenul2 == 'submenu4' && 'opened')}>
                                <a href="javascript:void(0)" onClick={ () => this.setState({submenul2:(!this.state.submenul2 || this.state.submenul2 != 'submenu4')?'submenu4':null }) }>
                                    <span className="menu-text">收件箱 </span>
                                    <span className="selected"></span>
                                </a>
                                <ul className="hoe-sub-menu">
                                    <li>
                                        <a href="javascript:void(0)">
                                            <span className="menu-text">星标邮件</span>
                                            <span className="selected"></span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">
                                            <span className="menu-text">自定义收藏夹</span>
                                            <span className="selected"></span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">发件箱</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">垃圾箱</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
					              		<li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">已删除</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
						              	<li>
                                <a href="javascript:void(0)">
                                    <span className="menu-text">草稿箱</span>
                                    <span className="selected"></span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-level">系统管理</li>
                    <li className={classNames("hoe-has-menu",this.state.submenu == 'submenu5' && 'opened')}>
                        <a href="javascript:void(0)" onClick={ () => this.setState({submenu:(!this.state.submenu || this.state.submenu != 'submenu5')?'submenu5':null }) }>
                            <i className="fa fa-pencil-square-o"></i>
                            <span className="menu-text">测试组件</span>
                            <span className="selected"></span>
                        </a>
                        <ul className="hoe-sub-menu">
                            <li>
                                <Link to='/admin/cropper'>
                                    <span className="menu-text">图片裁剪</span>
                                    <span className="selected"></span>
                                </Link>
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
                    <li className={classNames("hoe-has-menu",this.state.submenu == 'submenu6' && 'opened')}>
                        <a href="javascript:void(0)" onClick={ () => this.setState({submenu:(!this.state.submenu || this.state.submenu != 'submenu6')?'submenu6':null }) }>
                            <i className="fa fa-sitemap"></i>
                            <span className="menu-text">用户管理</span>
                            <span className="selected"></span>
                        </a>
                        <ul className="hoe-sub-menu">
                            <li className={calLinkClasses('/admin/users')}>
                                <Link to='/admin/users'>
									                  <span className="menu-text">用户列表</span>
									                  <span className="selected"></span>
                                </Link>
                            </li>
                            <li className={calLinkClasses('/admin/roles')}>
                                <Link to='/admin/roles'>
                  									<span className="menu-text">角色权限管理</span>
									                  <span className="selected"></span>
                                </Link>
                            </li>
                            {/*<li className={classNames("hoe-has-menu",this.state.submenu6)}>
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
                            </li>  */}
                        </ul>
                    </li>
                </ul>
            </aside>
            <section id="main-content" style={ {minHeight:contentHeight} }>
                { this.props.children }
            </section>
            {/*<StyleSelectorContainer />*/}
        </div>
    </div>
        );
    }
}

HoeLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}


export default HoeLayout
