import React from 'react'
import { IndexLink, Link } from 'react-router'
import classes from './HeaderAirbnb.scss'
import classNames from 'classnames';

const Logo = () => (
  <div>
    <span className={classNames(classes.icon, "glyphicon", "glyphicon-home")} aria-hidden="true"></span>
    {/* 'Home' */}
  </div>
)

const Tour = () => (
  <div>
    { 'Tour' }
    <span className={classNames(classes.icon, "glyphicon", "glyphicon-sound-stereo")} aria-hidden="true"></span>
  </div>
)

const Message = () => (
  <div>
    { 'Msg' }
    {/*<span className="glyphicon glyphicon-envelope" aria-hidden="true"></span>*/}
    <i className={classNames(classes.icon, "glyphicon", "glyphicon-envelope")}>
      <i className={classNames(classes.numberBadge, "badge")}>1</i>
    </i>
  </div>
)

const Help = () => (
  <div>
    <span>Help</span>
    <span className={classNames(classes.icon, "glyphicon", "glyphicon-question-sign")} aria-hidden="true"></span>
  </div>
)

const User = (props) => (
  <div>
    <span>{props.userName || 'Login'}</span>
    <span className={classNames(classes.icon, "glyphicon")}><img src={props.avatar || '/favicon.ico'} alt="..." className={classNames(classes.avatar, "img-circle")} /></span>
  </div>
)

const Auth2Url = (url) => {
    //var redirect_uri = url || "http://www.lancertech.net";
    var redirect_uri = location.href;
    redirect_uri = encodeURIComponent(redirect_uri);
    var state = "1";
    var next_url = "http://lancertech.net/get-weixin-code.html?appid=wx1a6eca02cffc398c&scope=snsapi_base&state="+state+"&redirect_uri="+redirect_uri;
    console.log ("next_url:", next_url);
    return next_url;
}

export const Header = (props) => (
  <div className={classes.airbnbHeader}>
    <div className={classNames(classes.comp, "pull-left")}>
    <IndexLink to='/' activeClassName={classes.activeRoute}>
      <Logo />
    </IndexLink>
    </div>

    <div className={classNames(classes.comp, "pull-right")}>
    <a href={Auth2Url()} >
      <User />
    </a>
    </div>

    <div className={classNames(classes.comp, "pull-right")}>
    <Link to='/auth/login' activeClassName={classes.activeRoute}>
      <Help />
    </Link>
    </div>

    <div className={classNames(classes.comp, "pull-right")}>
    <Link to='/sample/zen' activeClassName={classes.activeRoute}>
      <Message />
    </Link>
    </div>

    <div className={classNames(classes.comp, "pull-right")}>
    <Link to='/iot' activeClassName={classes.activeRoute}>
      <Tour />
    </Link>
    </div>

  </div>
)

export default Header
