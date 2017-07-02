var xdebug = window.myDebug('COIN:UserList');
import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import _ from 'lodash';
import moment from 'moment';
import classes from './styles.scss';
import classNames from 'classnames/bind';
import { userHasCap, addCap, delCap } from '../common';

const List = ({items}) => {
    var itemList = items && items.map ((item, index)=>{
        var name = item.nicename || (item.wechat && item.wechat.nickname) || '无名';
        var ops = item.ops;
        return (
          <tr key={index} className={classes.userDetailOpenid}> 
            <th scope="row">{item.id}</th>
            <td>
              <div style={{wordBreak:'break-all', wordWrap:'break-word'}}>{name}</div>
            </td>
            <td>
              <div style={{wordBreak:'break-all', wordWrap:'break-word'}}>{item.openid}</div>
              <div className={classes.detail}>
                { ops && ops.opSetAgent &&
                <Link onClick={(e)=>{ops.opSetAgent(e, item)}} style={{marginLeft:5, marginRight:5}}>
                  <span>设为代理</span>
                </Link>
                }
                { ops && ops.opUnsetAgent &&
                <Link onClick={(e)=>{ops.opUnsetAgent(e, item)}} style={{marginLeft:5, marginRight:5}}>
                  <span>取消代理</span>
                </Link>
                }
              </div>
            </td>
            <td>
              <div style={{maxWidth:150, whiteSpace:'nowrap', textOverflow: 'ellipsis',overflow: 'hidden'}}>{item.phone}</div>
            </td>
            <td className="hidden-xs">
              <div style={{wordBreak:'break-all', wordWrap:'break-word'}}>{item.address}</div>
            </td>
          </tr>
        )
    });
    return (
<div className="container">
  <table className="table table-hover"> 
    <thead> 
      <tr>
        <th>id</th>
        <th>帐户名</th>
        <th>openid</th>
        <th>电话</th>
        <th className="hidden-xs">地址</th>
      </tr>
    </thead> 
    <tbody> 
      {/*<tr> 
        <th scope="row">1111</th> 
        <td className={classNames("hidden-sm hidden-md hidden-lg", classes.userDetailOpenid)}>
          <div style={{maxWidth:150, textOverflow: 'ellipsis',overflow: 'hidden'}}>12345678901234567890123456789012</div>
          <div className={classes.detail} style={{maxWidth:150, textOverflow: 'ellipsis',overflow: 'hidden'}}>11111111</div>
          <div className={classes.detail} style={{maxWidth:150, textOverflow: 'ellipsis',overflow: 'hidden'}}>11111111</div>
        </td> 
        <td>13661989491</td> 
        <td className="hidden-xs">12345678901234567890123456789012</td> 
        <td className="hidden-xs">windsome</td> 
        <td className="hidden-xs">中国农大</td> 
      </tr>*/}
      {itemList}
     </tbody>
   </table>
</div>
    )
}

export default class Page extends Component {
    static propTypes = {
        goBack: PropTypes.func.isRequired,
        retrieveItems: PropTypes.func.isRequired,

        itemStatus: PropTypes.object.isRequired,
        itemDb: PropTypes.object.isRequired,
    }

    constructor (props) {
        super (props);
        this.state = {
            key:'',
        }
    }

    componentDidMount() {
        var { retrieveItems } = this.props;
        retrieveItems (this.state.key, 0);
    }

    setAndSearch (key) {
        var { retrieveItems } = this.props;
        this.setState ({key});
        retrieveItems (key, 0);
    }

    render () {
        var { goBack, push, replace, retrieveItems, itemDb, itemStatus, retrieveSomeUsers, updateUser } = this.props;

        var opSetAgent = (evt, user) => {
            evt.preventDefault();
            if (user) {
                var caps = addCap (user.caps,'SHOP_AGENT');
                caps = addCap (caps,'EDIT_POSTS');
                caps = addCap (caps,'MANAGE_POSTS');
                updateUser (user.id, {caps})
                    .then ((retobj) => {
                        retrieveSomeUsers ([user.id]);
                    })
            }
        };
        var opUnsetAgent = (evt, user) => {
            evt.preventDefault();
            if (user) {
                var caps = delCap (user.caps, 'SHOP_AGENT');
                caps = delCap (caps,'EDIT_POSTS');
                caps = delCap (caps,'MANAGE_POSTS');
                updateUser (user.id, {caps})
                    .then ((retobj) => {
                        retrieveSomeUsers ([user.id]);
                    })
            }
        };

        var itemList = itemStatus && itemStatus.result || [];
        var users = itemList && itemList.map ((id, index)=>{
            var user = itemDb && itemDb[id];
            var ops = {}
            if (userHasCap (user, 'SHOP_AGENT')) {
                ops = { ...ops, opUnsetAgent };
            } else {
                ops = { ...ops, opSetAgent };
            }
            user.ops = ops;
            return user;
        });

        var total = itemStatus && itemStatus.total || 0;
        var count = itemStatus && itemStatus.result && itemStatus.result.length || 0;
        var page = itemStatus && itemStatus.page || 0;
        const retriveRefresh = () => {
            retrieveItems (this.state.key, 0);
        }
        const retriveMore = () => {
            retrieveItems (this.state.key, page+1);
        }

        return (
    <div>
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
                <input className="form-control" placeholder="输入关键字,如:小明" aria-label="Text input with multiple buttons" style={{height:34}} onChange={(evt) => this.setState({key: evt.target.value})} value={this.state.key}/>
              </div>
              <div className="input-group-btn"> 
                <button type="button" className="btn btn-default" aria-label="Help" style={{height:34, borderLeftWidth: 0, boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075)'}} onClick={()=>this.setState({key: ''})}>
                  <span className="glyphicon glyphicon-remove-circle"></span>
                </button> 
                <button type="button" className="btn btn-default" style={{height:34}} onClick={retriveRefresh}>搜索</button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div style={{paddingTop: 55}}>
      <div className="container">
        <div className="row">
          <div className="col-xs-12" style={{backgroundColor:'#eee', padding:10}}>
            <div style={{display:'inline-block', marginRight:20}}>热门搜索</div>
            <div style={{display:'inline-block', borderRadius:10, padding:8, margin:5, border: "1px solid #ddd", backgroundColor:'#fff'}} onClick={()=>{this.setAndSearch('黄山')}}>黄山</div>
            <div style={{display:'inline-block', borderRadius:10, padding:8, margin:5, border: "1px solid #ddd", backgroundColor:'#fff'}} onClick={()=>{this.setAndSearch('石潭')}}>石潭</div>
            <div style={{display:'inline-block', borderRadius:10, padding:8, margin:5, border: "1px solid #ddd", backgroundColor:'#fff'}} onClick={()=>{this.setAndSearch('九华山')}}>九华山</div>
          </div>
        </div>
      </div>

        { (count == 0) &&
        <div style={{marginTop:10, textAlign:'center'}} onClick={retriveRefresh}>点此可刷新</div>
        }
        <List items={users} />
        { count < total &&
        <div style={{marginTop:10, textAlign:'center'}} onClick={retriveMore}>点此加载更多...</div>
        }

      </div>
    </div>
        );
    }
}

