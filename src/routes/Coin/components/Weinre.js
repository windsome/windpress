import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import _ from 'lodash';
var xdebug = window.myDebug('COIN:MyAddress');

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
    }

    injectScript() {
        var ip = this.state.ip || '192.168.2.109';
        const script = document.createElement("script");
        script.src = "http://"+ip+":9090/target/target-script-min.js#anonymous";
        script.async = true;
        document.body.appendChild(script);
        this.setState({settled:true});
    }
    
    render () {
        var {goBack} = this.props;
        var disabled ={};
        if (this.state.settled) disabled = {disabled:'disabled'};
        return (
    <div style={{paddingTop: 50, paddingBottom: 50}}>
      <nav className="navbar navbar-default navbar-fixed-top" style={{lineHeight:'50px', fontSize:20, backgroundColor:'#db3652', color:'#fff', whiteSpace:'nowrap'}}>
        <div style={{float:'left', marginLeft:5, boxSizing:'inline-block'}}><Link to="/coin" onClick={(e)=>{e.preventDefault(); goBack && goBack();} }>
          <i className="glyphicon glyphicon-menu-left img-circle" style={{top:5, color:'#ddd', opacity:1, backgroundColor:'#333', padding:5}}/>
        </Link></div>
        <div style={{float:'left', paddingLeft: 50}}> <span>设置远程调试地址</span> </div>
      </nav>

      <div className="container">
        <div className="row">

          <div className="col-xs-12" style={{marginTop:10}}>
            <div className="input-group">
              <span className="input-group-addon">IP</span>
              <input type="text" className="form-control" placeholder="请输入IP。如：192.168.2.109" aria-label="IP" id="ip" onChange={(e) => {this.setState({ip: e.target.value})}} value={this.state.ip}/>
            </div>
          </div>

          <div className="col-xs-12" style={{marginTop:10, textAlign:'center'}}>
            <button type="button" className="btn btn-lg btn-primary" style={{backgroundColor:'#db3652', color:'#fff', borderWidth:0, width:'100%'}} onClick={this.injectScript.bind(this)} {...disabled}>开始注入调试</button>
          </div>

        </div>
      </div>

    </div>
        );
    }
}

