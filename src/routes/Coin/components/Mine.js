import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import _ from 'lodash';
var xdebug = window.myDebug('COIN:Search');

export default class Page extends Component {
    static propTypes = {
        goBack: PropTypes.func.isRequired,
        cuser: PropTypes.object.isRequired,
        wxoauth: PropTypes.object.isRequired,
    }

    render () {
        var { goBack, cuser, wxoauth } = this.props;

        return (
    <div style={{paddingTop: 60, paddingBottom: 50}}>
      <nav className="navbar navbar-default navbar-fixed-top" style={{backgroundColor:'#fff', color:'#000', lineHeight:'50px', fontSize:'20px'}}>
        <div className="container">
          <div style={{width:30, float:'left', position:'absolute'}}>
            <Link to="/coin" onClick={(e)=>{e.preventDefault(); goBack && goBack();} }>
              <i className="glyphicon glyphicon-menu-left" style={{paddingRight:20}}/>
            </Link>
          </div>
          <div style={{float:'left', width:'100%', marginLeft:40, textAlign:'center'}}>
            <div style={{marginLeft:'-40px'}}>windsome.feng</div>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="row">

          <div className="col-xs-12">
            <div className="list-group">
              <span>{wxoauth && wxoauth.user && wxoauth.user.openid}</span>
              <span>{'---'}</span>
              <span>{cuser && cuser.user && cuser.user.id}</span>
            </div>
          </div>

          <div className="col-xs-12">
            <div className="list-group">
              <Link type="button" className="list-group-item" to="/coin/artworkdetail/1">
                <span className="glyphicon glyphicon-list-alt" style={{marginRight:10}}></span>
                <span>夺宝记录</span>
                <sub style={{float:'right', right:5}}><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
              <Link type="button" className="list-group-item">
                <span className="glyphicon glyphicon-glass" style={{marginRight:10}}></span>
                <span>幸运记录</span>
                <sub style={{float:'right', right:5}}><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
            </div>
          </div>

          <div className="col-xs-12">
            <div className="list-group">
              <Link type="button" className="list-group-item" to="/coin/1">
                <span className="glyphicon glyphicon-envelope" style={{marginRight:10}}></span>
                <span>我的宝贝</span>
                <sub style={{float:'right', right:5}}><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
              <Link type="button" className="list-group-item" to="/coin/create">
                <span className="glyphicon glyphicon-phone-alt" style={{marginRight:10}}></span>
                <span>发布宝贝</span>
                <sub style={{float:'right', right:5}}><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
            </div>
          </div>

          <div className="col-xs-12">
            <div className="list-group">
              <Link type="button" className="list-group-item" to="/coin/artworkdetail/1">
                <span className="glyphicon glyphicon-envelope" style={{marginRight:10}}></span>
                <span>收获地址</span>
                <sub style={{float:'right', right:5}}><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
              <Link type="button" className="list-group-item">
                <span className="glyphicon glyphicon-phone-alt" style={{marginRight:10}}></span>
                <span>夺宝客服</span>
                <sub style={{float:'right', right:5}}><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
            </div>
          </div>

          <div className="col-xs-12" style={{textAlign:'center'}}>
            <div className="list-group">
              <Link type="button" className="list-group-item" to="/coin/artworkdetail/1">
                <span>退出登录</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

    </div>
        );
    }
}

