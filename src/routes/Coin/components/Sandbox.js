import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import _ from 'lodash';
import classes from './styles.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);
var xdebug = window.myDebug('COIN:Sandbox');

export default class Page extends Component {
    static propTypes = {
        goBack: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,

        corder: PropTypes.object.isRequired,
        createOrder: PropTypes.func.isRequired,

        jsPayOrders: PropTypes.func.isRequired,
    }

    constructor (props) {
        super (props);
        this.state = {
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    createNewOrder (fee) {
        var {createOrder, jsPayOrders, push} = this.props;
        createOrder ({count: 1, status: 0, postId: 0, fee: fee, desc: {name:'测试艺术品', author:'无名作家'}}).then ( order => {
            // for sandbox test, set postId=0, count=1
            xdebug ("after createNewOrder:", JSON.stringify(order));
            jsPayOrders ([order]);
            //push ('/pay/jspay?id='+order.id);
            //location.reload();
            location.href='/pay/jspay?id='+order.id;
        })
    }

    requireSandboxKey () {
    }

    render () {
        var {goBack, corder, pay, acquireSandboxKey } = this.props;
        var keyFetching = pay && pay.sandbox && pay.sandbox.fetching || false;
        var key = pay && pay.sandbox && pay.sandbox.key;
        var errmsg = pay && pay.sandbox && pay.sandbox.error && pay.sandbox.error.message;
        var info = "";
        var disabled = {};
        if (key) {
            info = "测试key为："+key;
        } else {
            if (keyFetching) {
                info = "正在获取测试key，请稍后操作";
                disabled = {disabled:'disabled'};
            } else {
                if (errmsg)
                    info = "失败消息："+errmsg;
                else
                    info = "测试之前请先点击上面按钮获取测试key！";
            }
        }
        return (
    <div style={{paddingTop: 50, paddingBottom: 50}}>
      <nav className="navbar navbar-default navbar-fixed-top" style={{lineHeight:'50px', fontSize:'20px', color:'#fff', opacity:0.5}}>
        <div style={{float:'left', marginLeft:5, boxSizing:'inline-block'}}><Link to="/coin" onClick={(e)=>{e.preventDefault(); goBack && goBack();} }>
          <i className="glyphicon glyphicon-menu-left img-circle" style={{top:5, color:'#ddd', opacity:1, backgroundColor:'#333', padding:5}}/>
        </Link></div>
        <div style={{float:'right', marginRight:5, boxSizing:'inline-block'}}><Link to="/coin/message">
          <i className="glyphicon glyphicon-bell img-circle" style={{top:5, color:'#ddd', opacity:1, backgroundColor:'#333', padding:5}}/>
        </Link></div>
      </nav>

      <div className="container">
        <div className="row">

          <div className="col-xs-12 h4" style={{wordWrap: 'break-word', wordBreak:'break-all', paddingTop:10 }}>支付sandbox测试</div>
          <div className="col-xs-12" style={{textAlign:'center'}}>
              <button type="button" className="btn btn-default" style={{width:'100%', padding:5, margin:5}} onClick={()=>acquireSandboxKey()} {...disabled}>获取测试key</button> 
          </div>

          <div className="col-xs-12">
            <div style={{textAlign:'center', backgroundColor:'#eee', paddingTop:15, paddingBottom:15, marginBottom:15}}>{info}</div>
          </div>

          <div className="col-xs-12" style={{textAlign:'center'}}>
              <button type="button" className="btn btn-default" style={{width:50, padding:5, margin:5}} onClick={()=>this.createNewOrder(1)}>0.01</button> 
              <button type="button" className="btn btn-default" style={{width:50, padding:5, margin:5}} onClick={()=>this.createNewOrder(2)}>0.02</button> 
              <button type="button" className="btn btn-default" style={{width:50, padding:5, margin:5}} onClick={()=>this.createNewOrder(101)}>1.01</button> 
              <button type="button" className="btn btn-default" style={{width:50, padding:5, margin:5}} onClick={()=>this.createNewOrder(102)}>1.02</button> 
              <button type="button" className="btn btn-default" style={{width:50, padding:5, margin:5}} onClick={()=>this.createNewOrder(130)}>1.30</button> 
              <button type="button" className="btn btn-default" style={{width:50, padding:5, margin:5}} onClick={()=>this.createNewOrder(131)}>1.31</button> 
              <button type="button" className="btn btn-default" style={{width:50, padding:5, margin:5}} onClick={()=>this.createNewOrder(132)}>1.32</button> 
              <button type="button" className="btn btn-default" style={{width:50, padding:5, margin:5}} onClick={()=>this.createNewOrder(133)}>1.33</button> 
              <button type="button" className="btn btn-default" style={{width:50, padding:5, margin:5}} onClick={()=>this.createNewOrder(134)}>1.34</button> 
              <button type="button" className="btn btn-default" style={{width:50, padding:5, margin:5}} onClick={()=>this.createNewOrder(179)}>1.79</button> 
          </div>
        </div>

      </div>

    </div>
        );
    }
}

