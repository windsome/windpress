var xdebug = window.myDebug('PAY:JsPay');
import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import _ from 'lodash';
import classes from './styles.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);
import { urlParams } from 'utils/urlParams';
import config from '../config';

export default class Page extends Component {
    static propTypes = {
        goBack: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,

        cuser: PropTypes.object.isRequired,
        pay: PropTypes.object.isRequired,
    }

    constructor (props) {
        super (props);
    }

    componentDidMount() {
        wx && wx.hideAllNonBaseMenuItem();

        var {pay, retrieveOrder} = this.props;
        var order = pay.orders && pay.orders[0];
        if (!order) {
            xdebug ("warning! no order, maybe after do location.reload(). some browser not support pushState()");
            var qs = urlParams(location.search);
            if (qs.id) {
                retrieveOrder (qs.id);
            } else {
                xdebug ("error! not get order from location.search! you should check your URL! this page should not open directly, it MUST redirect from other product page!");
            }
        }
    }

    componentWillUnmount() {
    }

    handlePayment () {
        var {goBack, replace, invokePayment, checkOrderStatus, cuser, pay} = this.props;
        var user = cuser && cuser.user || {};
        var openid = user.openid;
        var order = pay.orders && pay.orders[0];
        xdebug ("order:", JSON.stringify(order||{}), ", openid:", openid)
        if (order && openid) {
            var orderOK = false;
            invokePayment (order, openid).then((ret)=>{
                xdebug ("invokePayment return:", JSON.stringify(ret));
                if (ret)
                    orderOK = checkOrderStatus(order, 5);
                //else
                //    orderOK = checkOrderStatus(order, 1);
            }).catch ((e) => {
                xdebug ("pay error:"+e.message);
                orderOK = checkOrderStatus(order, 1);
            });
            xdebug ("orderOK="+orderOK);
        } else {
            xdebug ("error! order or openid is null!");
        }
    }

    render () {
        var { go, goBack, replace, cuser, pay } = this.props;        
        var user = cuser && cuser.user || {};
        var openid = user.openid;
        xdebug ("pay:", pay);
        var qrcode = config.qrcode;

        var order0 = pay.orders && pay.orders[0];
        var retrieveFetching = pay.retrieve && pay.retrieve.fetching || false;
        var retrieveId = pay.retrieve && pay.retrieve.id || 'X';
        var notifyFetching = pay.notify && pay.notify.fetching || false;

        var alreadyPaid = false;
        var orderN = pay.notify && pay.notify.order;
        if (!retrieveFetching && !notifyFetching && order0) {
            if (order0.status === 2) {
                alreadyPaid = true;
            } else if (orderN && orderN.id === order0.id && orderN.status === 2) {
                alreadyPaid = true;
            }
        }

        var notifyMsg = '';
        if (!openid) {
            notifyMsg = '进入页面异常，未获得用户openid，无法支付，请重新在微信中打开。';
        } else if (order0) {
            if (notifyFetching) {
                notifyMsg = '正在等待支付结果...';
            } else if (pay.notify && pay.notify.error) {
                notifyMsg = "支付失败："+pay.notify.error.message;
                xdebug ("message:"+JSON.stringify(pay.notify)+",notify:"+notifyMsg);
            } else if (pay.notify && pay.notify.order && alreadyPaid) {
                notifyMsg = "支付成功";
            } else if (alreadyPaid) {
                notifyMsg = "已经支付过了";
            } else {
                notifyMsg = "等待支付";
            }
        } else {
            if (retrieveFetching) {
                notifyMsg = '正在加载订单'+retrieveId+'...';
            } else if (pay.retrieve && pay.retrieve.error) {
                notifyMsg = '加载订单'+retrieveId+'失败：'+pay.retrieve.error.message;
            } else {
                notifyMsg = "等待支付";
            }
        }

        var orders = pay.orders || [];
        var orderList = orders.map ((order, index)=>{
            var image = order.desc && order.desc.images && order.desc.images[0];
            return (
        <tr key={index}>
        	<td>
            <div>{order.uuid}</div>
            { image &&
            <div><img src={image} style={{maxWidth:100}}/></div>
            }
          </td>
        	<td>
            <span>{new Number(order.fee/100).toFixed(2)+'元'}</span>
          </td>
        	<td>
            <span>{'编号'+order.postId+": "+(order.desc && order.desc.name || '未命名作品')}</span>
            <br/>
            <sub><span>投{order.count}注</span><span style={{marginLeft:10, color:'#999'}}>{new Date(order.createdAt).toLocaleString()}</span></sub>
          </td>
        </tr>
            )
        });
        
        const goPrev = (e) => {
            e.preventDefault();
            if (go) {
                go (-1);
                // if (openid)
                //     go(-2);
                // else
                //     go (-1);
            }
        }

        return (
    <div>
      <nav className="navbar navbar-default navbar-fixed-top" style={{lineHeight:'50px', fontSize:'20px', color:'#fff', opacity:0.5}}>
        <div style={{float:'left', marginLeft:5, boxSizing:'inline-block'}}><Link to="/coin" onClick={ goPrev }>
          <i className="glyphicon glyphicon-menu-left img-circle" style={{top:5, color:'#ddd', opacity:1, backgroundColor:'#333', padding:5}}/>
        </Link></div>
      </nav>

      <div className="container" style={{paddingTop: 55, paddingBottom:55}}>
        <div className="row">

          <div className="col-xs-12" style={{wordWrap: 'break-word', wordBreak:'break-all', paddingTop:10 }}>订单内容：</div>

          <div className="col-xs-12">
            <table className="table table-striped">
            <tbody>
              {orderList}
            </tbody>
            </table>
          </div>

          <div className="col-xs-12">
            <div style={{textAlign:'center', backgroundColor:'#eee', paddingTop:15, paddingBottom:15, marginBottom:15}}>{notifyMsg}</div>
          </div>

          { pay.notify && !pay.notify.fetching && (pay.notify.error || pay.notify.order) &&
          <div className="col-xs-12" style={{marginTop:20}}>
            <div style={{textAlign:'center', backgroundColor:'#eee', paddingTop:15, paddingBottom:5, marginBottom:5}}>扫描下面二维码关注我们</div>
            <img src={qrcode} className="img-responsive" alt="Responsive image"/>
          </div>
          }
        </div>

      </div>
      { !alreadyPaid && openid &&
      <nav className="navbar navbar-default navbar-fixed-bottom" style={{padding:10}}>
        <div style={{backgroundColor:'#db3652', color:'#fff', textAlign:'center', fontSize:20, padding:5}} onClick={()=>this.handlePayment()}>
          {/*<span className="glyphicon glyphicon-oil"></span>*/}
          <span>立即付钱</span>
        </div>
      </nav>
      }
    </div>
        );
    }
}

