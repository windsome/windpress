import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import _ from 'lodash';
var xdebug = window.myDebug('COIN:Search');

export default class Page extends Component {
    static propTypes = {
        goBack: PropTypes.func.isRequired,
    }

    render () {
        var { goBack } = this.props;

        return (
    <div style={{paddingTop: 50, paddingBottom: 50}}>
      <nav className="navbar navbar-default navbar-fixed-top" style={{backgroundColor:'#fff', color:'#000', lineHeight:'50px', fontSize:'20px'}}>
        <div className="container">
          <div style={{width:30, float:'left', position:'absolute'}}>
            <Link to="/coin" onClick={(e)=>{e.preventDefault(); goBack && goBack();} }>
              <i className="glyphicon glyphicon-menu-left" style={{paddingRight:20}}/>
            </Link>
          </div>
          <div style={{float:'left', marginLeft:40}}>
            <div className="input-group"> 
              <div className="input-group-btn" style={{width:'100%'}}> 
                <input className="form-control" aria-label="Text input with multiple buttons" style={{height:34}}/>
              </div>
              <div className="input-group-btn"> 
                <button type="button" className="btn btn-default" aria-label="Help" style={{height:34, borderLeftWidth: 0, boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075)'}}>
                  <span className="glyphicon glyphicon-remove-circle"></span>
                </button> 
                <button type="button" className="btn btn-default" style={{height:34}}>搜索</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="row">
          <div className="col-xs-12" style={{backgroundColor:'#eee', padding:10}}>
            <div style={{display:'inline-block', marginRight:20}}>热门搜索</div>
            <div style={{display:'inline-block', borderRadius:10, padding:8, margin:5, border: "1px solid #ddd", backgroundColor:'#fff'}}>音箱</div>
            <div style={{display:'inline-block', borderRadius:10, padding:8, margin:5, border: "1px solid #ddd", backgroundColor:'#fff'}}>数据线</div>
            <div style={{display:'inline-block', borderRadius:10, padding:8, margin:5, border: "1px solid #ddd", backgroundColor:'#fff'}}>充电器</div>
          </div>
        </div>

        <div className="row" style={{}}>
          <div className="col-xs-12" style={{paddingTop:10, paddingBottom:10}}>
            <span style={{color:'#999'}}>历史搜索</span>
            <span style={{color:'#2f2', float:'right'}}>清空</span>
          </div>
          <div className="col-xs-12" style={{paddingTop:10, paddingBottom:10}}>欧米茄</div>
          <div className="col-xs-12" style={{paddingTop:10, paddingBottom:10}}>iPhone</div>
        </div>
      </div>

    </div>
        );
    }
}

