var xdebug = window.myDebug('COIN:Mine');
import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import _ from 'lodash';
import parseUserAgent from 'utils/userAgent';
import { userHasCap } from '../common';

export default class Page extends Component {
    static propTypes = {
        goBack: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,

        cuser: PropTypes.object.isRequired,
    }
    constructor (props) {
        super (props);
        var ua = parseUserAgent();
        this.isWechat = ua && ua.wechat;
    }
    
    componentDidMount() {
    }

    logout (e) {
        e.preventDefault();
        var {doLogout} = this.props;
        doLogout();
    }

    render () {
        var { goBack, replace, cuser } = this.props;
        var user = cuser && cuser.user || {};
        var userId = user.id || 0;
        var openid = user.openid || '';
        var title = user.nicename || userId || '未登录';
        var avatar = user && user.avatar || (user && user.wechat && user.wechat.headimgurl) ||'/images/avatar-1.png';
        xdebug ("Mine render() user:"+JSON.stringify(user));
        var isRoot = userHasCap (cuser.user, 'ROOT');
        var isAgent = userHasCap (cuser.user, 'SHOP_AGENT');

        const doLogin = (evt) => {
            //evt.defaultPrevented();
            evt.preventDefault();
            replace('/coin/login');
        }

        return (
    <div style={{paddingTop: 60, paddingBottom: 50}}>
      <nav className="navbar navbar-default navbar-fixed-top" style={{backgroundColor:'#fff', color:'#000', lineHeight:'50px', fontSize:'20px'}}>
        <div className="container">
          <div style={{width:30, float:'left', position:'absolute'}}>
            <Link to="/coin" onClick={(e)=>{e.preventDefault(); goBack && goBack();} }>
              <i className="glyphicon glyphicon-menu-left" style={{paddingRight:20}}/>
            </Link>
          </div>
          <div style={{float:'left', width:'100%', textAlign:'center', paddingLeft:30}}>
            <div style={{whiteSpace: 'nowrap',textOverflow:'ellipsis',overflow: 'hidden'}}>{title}</div>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="row">

          <div className="col-xs-12">
            <div className="list-group">
              <Link type="button" className="list-group-item" to="/coin/myaddr">
  							<div style={{whiteSpace: 'nowrap',textOverflow:'ellipsis',overflow: 'hidden',paddingRight: 50, width:'100%'}}>
                  <img className="img-circle" style={{height:26, width:26}} src={avatar}/>
                  {userId+' ['+openid+']'}
                  <sub style={{position: 'absolute', float:'right', right:20, top:16}}><i className="glyphicon glyphicon-menu-right"/></sub>
                </div>
              </Link>
              <Link type="button" className="list-group-item">
                <span className="glyphicon glyphicon-user" style={{marginRight:10}}></span>
                <span>{'电话号码: '+(user.phone||'未填')}</span>
              </Link>
              <Link type="button" className="list-group-item">
                <span className="glyphicon glyphicon-envelope" style={{marginRight:10}}></span>
                <span>{'收获地址: '+(user.address||'未填')}</span>
              </Link>
            </div>
          </div>

          <div className="col-xs-12">
            <div className="list-group">
              <Link type="button" className="list-group-item" to="/coin/myvote">
                <span className="glyphicon glyphicon-list-alt" style={{marginRight:10}}></span>
                <span>夺宝记录</span>
                <sub style={{float:'right', right:5}}><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
              <Link type="button" className="list-group-item" to="/coin/myluck">
                <span className="glyphicon glyphicon-glass" style={{marginRight:10}}></span>
                <span>幸运记录</span>
                <sub style={{float:'right', right:5}}><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
              <Link type="button" className="list-group-item" to="/coin/myrefunds">
                <span className="glyphicon glyphicon-glass" style={{marginRight:10}}></span>
                <span>退款记录</span>
                <sub style={{float:'right', right:5}}><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
            </div>
          </div>

          { isAgent && 
          <div className="col-xs-12">
            <div className="list-group">
              <Link type="button" className="list-group-item" to={"/coin/shop/"+userId}>
                <span className="glyphicon glyphicon-heart" style={{marginRight:10}}></span>
                <span>查看我的橱窗</span>
                <sub style={{float:'right', right:5}}><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
              <Link type="button" className="list-group-item" to="/coin/myown">
                <span className="glyphicon glyphicon-heart" style={{marginRight:10}}></span>
                <span>管理我的宝贝</span>
                <sub style={{float:'right', right:5}}><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
              <Link type="button" className="list-group-item" to="/coin/create">
                <span className="glyphicon glyphicon-pencil" style={{marginRight:10}}></span>
                <span>发布宝贝</span>
                <sub style={{float:'right', right:5}}><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
            </div>
          </div>
          }

          <div className="col-xs-12">
            <div className="list-group">
              <Link type="button" className="list-group-item" to="/coin/qrcode">
                <span className="glyphicon glyphicon-qrcode" style={{marginRight:10}}></span>
                <span>关注公众号</span>
                <sub style={{float:'right', right:5}}><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
              <Link type="button" className="list-group-item">
                <span className="glyphicon glyphicon-phone-alt" style={{marginRight:10}}></span>
                <span>联系客服</span>
                <span style={{paddingLeft:30}}> +86 18117208152 </span>
              </Link>
              { isRoot &&
              <Link type="button" className="list-group-item" to="/coin/rootposts">
                <span className="glyphicon glyphicon-phone-alt" style={{marginRight:10}}></span>
                <span>管理所有艺术品</span>
                <sub style={{float:'right', right:5}}><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
              }
              { isRoot &&
              <Link type="button" className="list-group-item" to="/coin/rootusers">
                <span className="glyphicon glyphicon-user" style={{marginRight:10}}></span>
                <span>管理所有用户</span>
                <sub style={{float:'right', right:5}}><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
              }
              { isRoot &&
              <Link type="button" className="list-group-item" to="/coin/rootrefunds">
                <span className="glyphicon glyphicon-user" style={{marginRight:10}}></span>
                <span>管理所有退款</span>
                <sub style={{float:'right', right:5}}><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
              }
              <Link type="button" className="list-group-item" to="/coin/weinre">
                <span className="glyphicon glyphicon-eye-open" style={{marginRight:10}}></span>
                <span>系统调试</span>
                <sub style={{float:'right', right:5}}><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
            </div>
          </div>

          {!this.isWechat &&
          <div className="col-xs-12" style={{textAlign:'center'}}>
            <div className="list-group">
              { (userId != 0) &&
              <Link type="button" className="list-group-item" onClick={this.logout.bind(this)} to="/coin/">
                <span>退出登录</span>
              </Link>
              }
              { (userId == 0) &&
              <Link type="button" className="list-group-item" onClick={doLogin} to="/coin/login">
                <span>点击登录</span>
              </Link>
              }
            </div>
          </div>
          }
        </div>
      </div>

    </div>
        );
    }
}

