var xdebug = window.myDebug('Pay:OnlyWechat');
import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import _ from 'lodash';
import config from '../config';

export default class Page extends Component {
    static propTypes = {
        goBack: PropTypes.func.isRequired,
    }

    constructor (props) {
        super (props);
        this.state = {
            ip:'192.168.2.109',
            settled:false,
        }
    }

    componentDidMount () {
        wx && wx.hideAllNonBaseMenuItem();
    }

    render () {
        var {goBack} = this.props;
        var qrcode = config.qrcode;
        return (
    <div style={{paddingTop: 50, paddingBottom: 50}}>
      <nav className="navbar navbar-default navbar-fixed-top" style={{lineHeight:'50px', fontSize:20, backgroundColor:'#db3652', color:'#fff', whiteSpace:'nowrap'}}>
        <div style={{float:'left', marginLeft:5, boxSizing:'inline-block'}}><Link to="/coin" onClick={(e)=>{e.preventDefault(); goBack && goBack();} }>
          <i className="glyphicon glyphicon-menu-left img-circle" style={{top:5, color:'#ddd', opacity:1, backgroundColor:'#333', padding:5}}/>
        </Link></div>
        <div style={{float:'left', paddingLeft: 50}}> <span>只允许在微信中访问</span> </div>
      </nav>

      <div className="container">
        <div className="row">

          <div className="col-xs-12" style={{marginTop:10}}>
            <div>请用微信扫描关注公众号</div>
          </div>
          <div className="col-xs-12" style={{marginTop:10}}>
            <img src={qrcode} className="img-responsive" alt="Responsive image"/>
          </div>

        </div>
      </div>

    </div>
        );
    }
}

