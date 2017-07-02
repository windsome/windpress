import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import _ from 'lodash';
var xdebug = window.myDebug('COIN:MyAddress');

export default class Page extends Component {
    static propTypes = {
        goBack: PropTypes.func.isRequired,

        updateUser: PropTypes.func.isRequired,
        setUserEditor: PropTypes.func.isRequired,
        cuser: PropTypes.object.isRequired,
    }

    constructor (props) {
        super (props);
        this.state = {
        }
    }
    
    componentDidMount() {
        var { setUserEditor } = this.props;
        setUserEditor ();
    }

    updateUserInfo () {
        xdebug ("updateUser:", this.state);
        var {updateUser, cuser} = this.props;
        var user = cuser.user;
        updateUser (user.id, this.state).then( retobj => {
            if (retobj.count > 0) {
                xdebug ("update ok!");
                
            } else {
                xdebug ("update fail!");
            }
        });
    }

    render () {
        var {goBack, cuser} = this.props;
        var user1 = cuser.user || {};
        var user2 = {...user1, ...this.state}
        var userId = user1.id;
        
        var changed = !_.isEqual(user1, user2);
        var updating = cuser && cuser.update && cuser.update.fetching;

        var error = cuser && cuser.update && cuser.update.error;
        var result = cuser && cuser.update && cuser.update.result;
        var message = error && error.message || (result && '更新成功');

        var disabled = {};
        if (updating || !changed) disabled = {disabled:'disabled'};
        xdebug (user1, user2, ", changed:", changed, ",updating:", updating, disabled);

        return (
    <div style={{paddingTop: 50, paddingBottom: 50}}>
      <nav className="navbar navbar-default navbar-fixed-top" style={{lineHeight:'50px', fontSize:20, backgroundColor:'#db3652', color:'#fff', whiteSpace:'nowrap'}}>
        <div style={{float:'left', marginLeft:5, boxSizing:'inline-block'}}><Link to="/coin" onClick={(e)=>{e.preventDefault(); goBack && goBack();} }>
          <i className="glyphicon glyphicon-menu-left img-circle" style={{top:5, color:'#ddd', opacity:1, backgroundColor:'#333', padding:5}}/>
        </Link></div>
        <div style={{float:'left', paddingLeft: 50}}> <span>个人信息</span> </div>
      </nav>
      { userId && 
      <div className="container">
        <div className="row">

          <div className="col-xs-12" style={{marginTop:10}}>
            <div className="input-group">
              <span className="input-group-addon">户名</span>
              <input type="text" className="form-control" placeholder="请输入帐号名，PC网页登录需要。如：windsome" aria-label="用户名" id="nicename" onChange={(e) => {this.setState({nicename: e.target.value})}} value={user2.nicename}/>
            </div>
          </div>

          <div className="col-xs-12" style={{marginTop:10}}>
            <div className="input-group">
              <span className="input-group-addon">密码</span>
              <input type="password" className="form-control" placeholder="请输入密码，网页登录需要，如忘记，可以在微信中改" aria-label="密码" id="pass" onChange={(e) => {this.setState({pass: e.target.value})}} value={user2.pass}/>
            </div>
          </div>

          <div className="col-xs-12" style={{marginTop:10}}>
            <div className="input-group">
              <span className="input-group-addon" id="basic-addon1">地址</span>
              <textarea className="form-control" rows="3" placeholder="请输入收货地址，如：安徽省黄山市歙县古关村13-2号 冯子收" aria-describedby="basic-addon1" id="address" onChange={(e) => {this.setState({address: e.target.value})}} value={user2.address}></textarea>
            </div>
          </div>

          <div className="col-xs-12" style={{marginTop:10}}>
            <div className="input-group">
              <span className="input-group-addon">手机</span>
              <input type="text" className="form-control" placeholder="请输入手机号码，如：13611234567" aria-label="手机号，快递将联系此号码" id="phone" onChange={(e) => {this.setState({phone: e.target.value})}} value={user2.phone}/>
            </div>
          </div>

          <div className="col-xs-12" style={{marginTop:10, textAlign:'center'}}>
            <button type="button" className="btn btn-lg btn-primary" {...disabled} style={{backgroundColor:'#db3652', color:'#fff', borderWidth:0, width:'100%'}} onClick={this.updateUserInfo.bind(this)}>提交</button>
          </div>

          <div className="col-xs-12" style={{marginTop:10}}>
            <p className="form-control-static">{message}</p>
          </div>

        </div>
      </div>
      }
      { !userId && 
      <div className="container">
        <div className="row">

          <div className="col-xs-12" style={{marginTop:10}}>
            <p className="form-control-static">您未关注公众号，请先关注公众号</p>
          </div>

        </div>
      </div>
      }


    </div>
        );
    }
}

