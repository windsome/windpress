var xdebug = window.myDebug('COIN:MyAddress');
import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import _ from 'lodash';
import config from '../config';

export default class Page extends Component {
    static propTypes = {
        goBack: PropTypes.func.isRequired,

        cuser: PropTypes.object.isRequired,
    }

    constructor (props) {
        super (props);
        this.state = {
        }
    }

    componentDidMount() {
        wx && wx.showAllNonBaseMenuItem();
    }
    
    render () {
        var {goBack, cuser} = this.props;
        var qrcode = config.qrcode;
        var user1 = cuser.user || {};
        var userId = user1.id;

        return (
    <div style={{paddingTop: 50, paddingBottom: 50}}>
      <nav className="navbar navbar-default navbar-fixed-top" style={{lineHeight:'50px', fontSize:20, backgroundColor:'#db3652', color:'#fff', whiteSpace:'nowrap'}}>
        <div style={{float:'left', marginLeft:5, boxSizing:'inline-block'}}><Link to="/coin" onClick={(e)=>{e.preventDefault(); goBack && goBack();} }>
          <i className="glyphicon glyphicon-menu-left img-circle" style={{top:5, color:'#ddd', opacity:1, backgroundColor:'#333', padding:5}}/>
        </Link></div>
        <div style={{float:'left', paddingLeft: 50}}> <span>关注公众号后投注</span> </div>
      </nav>

      <div className="container">
        <div className="row">

          <div className="col-xs-12" style={{marginTop:10}}>
            
          </div>

          <div className="col-xs-12" style={{marginTop:10}}>
            <p>方法一：长按二维码图片弹出菜单，点击《识别图中二维码》，即可关注</p>
            <p>方法二：请保存二维码图片，并打开微信扫一扫，点击右上角菜单，选择《从相册选取二维码》</p>
            <p>方法三：添加朋友方式，搜索公众号《中农物联》，并关注</p>
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

