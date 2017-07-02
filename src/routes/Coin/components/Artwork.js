var xdebug = window.myDebug('COIN:Artwork');
import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import ReactModal from 'react-modal';
import _ from 'lodash';
import classes from './styles.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);
import {utilPostStatusToString} from '../modules/utils';
import config from '../config';
ReactModal.setAppElement('#root');

const Progress = ({total, current}) => {
    var percent = total && current && Math.floor(current*100/total)+'%' || '0%';
    //xdebug ("progress:", total, current);
    return (
<div>
  <div className="progress" style={{marginBottom:0, backgroundColor:'#ccc', height:5}}>
    <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width: percent, color:'#f0f', backgroundColor:'#ff0'}}><span className="sr-only"> {percent} </span></div>
  </div>
  <div>
    <p className="pull-left text-left">总需<b>{total}</b>注</p>
    <p className="pull-right text-right">剩余<b style={{color:'#f00'}}>{total-current}</b>注</p>
  </div>
</div>
    )
}

const Progress2 = ({total, paid, prepay}) => {
    //xdebug ("progress:", total, paid, prepay);
    var remain = total-paid-prepay;
    var percentPaid = total && paid && Math.floor(paid*100/total)+'%' || '0%';
    var percentPrepay = total && prepay && Math.floor(prepay*100/total)+'%' || '0%';
    return (
<div>
  <div className="progress" style={{marginBottom:0, backgroundColor:'#ccc', height:5}}>
    <div className="progress-bar progress-bar-success" style={{width: percentPaid}}>
      <span className="sr-only">{percentPaid + ' Complete (success)'}</span>
    </div>
    <div className="progress-bar progress-bar-warning progress-bar-striped" style={{width: percentPrepay}}>
      <span className="sr-only">{percentPrepay + ' Complete (warning)'}</span>
    </div>
  </div>
  <div>
    <p className="pull-left text-left">总需<b>{total}</b>注</p>
    <p className="pull-right text-right">{(prepay > 0) && prepay+'注等待支付，'}剩余<b style={{color:'#f00'}}>{remain}</b>注</p>
  </div>
</div>
    )
}


class ImageSlide extends Component {
    static propTypes = {
        images: PropTypes.array.isRequired,
    }

    constructor (props) {
        super (props);
        this.state = {
            current: 0
        }
    }

    render () {
        var current = this.state.current;
        var image = this.props.images && this.props.images[current] || {desc:'No image', src:'/images/art2.jpg'};
        var imageCount = this.props.images && this.props.images.length || 1;

        return (
      <div className={cx("slideWrap")}>
        <div className={cx("slideImageWrap")}>
          <img src={ image.src } style={{maxHeight:'100%', maxWidth:'100%'}} alt={image.desc}/>
        </div>
        <div>
          <button className={cx("slideCtrl", "slideCtrlPrev")} onClick={ () => { if ((this.state.current - 1) >= 0) this.setState ({current: (this.state.current-1)}); } } >
            <i className={cx( 'glyphicon', {'glyphicon-chevron-left':(this.state.current!=0), 'glyphicon-ban-circle':(this.state.current==0)} )} style={{fontSize:'2.4em', color:'#fff'}}/>
          </button>
          <button className={cx("slideCtrl", "slideCtrlNext")} onClick={ () => { if ((this.state.current + 1) < this.props.images.length) this.setState ({current: (this.state.current+1)}); } } >
            <i className={cx( 'glyphicon', {'glyphicon-chevron-right':(this.state.current!=(imageCount-1)), 'glyphicon-ban-circle':(this.state.current==(imageCount-1))} )} style={{fontSize:'2.4em', color:'#fff'}}/>
          </button>
        </div>
      </div>
        )
    }
}


export default class Page extends Component {
    static propTypes = {
        goBack: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,

        cpost: PropTypes.object.isRequired,
        retrievePosts: PropTypes.func.isRequired,

        corder: PropTypes.object.isRequired,
        retrieveOrdersLater: PropTypes.func.isRequired,
        createOrder: PropTypes.func.isRequired,

        cuser: PropTypes.object.isRequired,
        updateUser: PropTypes.func.isRequired,

        retrieveQrcode: PropTypes.func.isRequired,
    }

    constructor (props) {
        super (props);
        this.state = {
            modalIsOpen: false,
            orderCount: 0,
            algorithmDetail: false,
        }
    }

    componentDidMount() {
        var { params, cuser, cpost, retrievePosts, retrieveOrdersLater } = this.props;
        var postId = params && params.postId;
        if (postId) {
            var post = cpost && cpost.db && cpost.db[postId];
            if (post) {
                xdebug ("already have this post, no need to retrieve again! post=", post, ", wx=", wx);
                if (post.status == 2) {
                    wx && wx.showAllNonBaseMenuItem();
                }
            } else 
                retrievePosts (postId);
            retrieveOrdersLater (postId);
        } else {
            xdebug ("error! not find postId in params!");
        }

        var owner = params && params.userId;
        var userId = cuser && cuser.user && cuser.user.id;
        xdebug ("update user visted! owner=", owner, ", userId="+userId);
        if (owner && userId) {
            // update owner.
            this.updateUserVisited (cuser.user, owner);
        }

        if (postId)
            this.onShare (postId);
    }

    updateUserVisited (user, owner) {
        if (owner && user && user.id) {
            // update owner.
            var visited = user.visited || [];
            var nArr = _.union(visited, [owner]);
            var xor = _.xor (visited, nArr);
            if (xor && xor.length > 0) {
                var { updateUser } = this.props;
                xdebug ("need update user's visited!", xor);
                updateUser (user.id, {visited: nArr});
            }
        } else {
            xdebug ("updateUserVisited: not update!");
        }
    }

    componentWillUnmount() {
    }

    componentWillReceiveProps (nextProps) {
        //xdebug ("componentWillReceiveProps");
        var { params, cuser } = this.props;
        var oldUserId = cuser && cuser.user && cuser.user.id;
        var oldOwner = params && params.userId;
        var oldPostId = params && params.postId;

        var { params, cuser, params, cpost } = nextProps;
        var newUserId = cuser && cuser.user && cuser.user.id;
        var newOwner = params && params.userId;
        var newPostId = params && params.postId;
        //var newUserId = nCuser && nCuser.user && nCuser.user.id;
        //var newOwner = nParams && nParams.userId;

        if ( newUserId && newOwner && (oldUserId != newUserId || oldOwner != newOwner ) ) {
            xdebug ("componentWillReceiveProps: user.id "+oldUserId+"=>"+newUserId+", owner "+oldOwner+"=>"+newOwner);
            this.updateUserVisited (nextProps.cuser.user, newOwner);
        }

        if (newPostId && (newPostId != oldPostId)) {
            this.onShare (newPostId);
        }

        var post = cpost && cpost.db && cpost.db[newPostId];
        if (post && (post.status == 2)) {
            wx && wx.showAllNonBaseMenuItem();
        }
    }

    handleCloseModal () {
        this.setState({modalIsOpen:false});
        //return true;
    }

    setOrderCount (count, unit, max) {
        count = Math.floor(count);
        if (count < 0) count = 0;
        if (count > max) count = max;
        this.setState ({ orderCount: count, fee: (count * unit)});
    }

    setOrderCountChange (count, unit, max) {
        var orderCount = parseInt(count);
        if (_.isNaN(orderCount)) {
            count = '';
            orderCount = 0;
        } else {
            count = orderCount;
        }

        if (orderCount < 0) orderCount = 0;
        if (orderCount > max) orderCount = max;
        this.setState ({ orderCount: count, fee: (orderCount * unit)});
        //this.setState ({ orderCount: count, fee: (count * unit * 100)});
    }

    createNewOrder () {
        var {params, cpost, corder, cuser, retrieveOrdersLater, createOrder, jsPayOrders, push} = this.props;
        var postId = params && params.postId;
        var orderCount = parseInt(this.state.orderCount);
        if (_.isNaN(orderCount)) orderCount = 0;
        var fee = this.state.fee;
        if (postId && orderCount > 0) {
            var post = cpost && cpost.db && cpost.db[postId];
            createOrder ({count: orderCount, status: 0, postId, fee: fee, desc: { ...post.desc, images: post.images} }).then ( order => {
                xdebug ("after createNewOrder:", JSON.stringify(order));
                jsPayOrders ([order]);
                this.setState({modalIsOpen:false});
                // refresh orders.
                var lastDate = corder && corder.retrieve && corder.retrieve.date;
                retrieveOrdersLater (params.postId, lastDate);
                //push ('/pay/jspay?id='+order.id);
                location.href='/pay/jspay?id='+order.id;
            })
        } else {
            xdebug ("error! no postId or orderCount! postId="+postId+", orderCount="+orderCount);
        }
    }

    onShare (postId) {
        var {cuser, cpost} = this.props;
        var post = cpost && cpost.db && cpost.db[postId] || {};
        var me = cuser && cuser.user || {};
        var meName = me.nicename;
        if (me.subscribe) meName = me.wechat && me.wechat.nickname;

        var name = post && post.desc && post.desc.name || '未命名艺术品';
        var desc = meName+' 邀请您参加艺术品夺宝，编号'+postId+' '+name;
        var img = post && post.images && ("http://"+location.host+post.images[0]);
        //xdebug ("onShare: img="+ img+", link="+location.href+", desc="+desc);
        wx && wx.onMenuShareAppMessage({
            title: name, // 分享标题
            desc: desc, // 分享描述
            link: location.href, // 分享链接
            imgUrl: img, // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () { 
                // 用户确认分享后执行的回调函数
                xdebug ("share success!");
            },
            cancel: function () { 
                // 用户取消分享后执行的回调函数
                xdebug ("share cancel!");
            }
        });
    }


    WeiXinShareBtn(post) { 
        try {
            var id = post && post.id || 0;
            var name = post && post.desc && post.desc.name || '未命名艺术品';
            var desc = '编号'+id+' '+name;
            var img = post && post.images && (location.host+post.images[0]);
            //var imgUrl = location.host+
            if (typeof WeixinJSBridge == "undefined") { 
                alert("请先通过微信搜索 agooou 添加帝利文化为好友，通过微信分享文章 "); 
            } else {
                WeixinJSBridge.invoke('shareTimeline', { 
                    "title": name, 
                    "link": location.href,
                    "desc": desc,
                    "img_url": img,
                }); 
            }
        } catch (error) {
            xdebug ("error! WeiXinShareBtn:"+error.message, error);
        }
    }
    handleBack (evt) {
        var {location, replace, goBack} = this.props;
        evt.preventDefault(); 
        if (location && location.query && location.query.state && location.query.code) {
            xdebug ("warning! got location.query:"+JSON.stringify(location.query)+", need replace to /coin/shop! maybe back from payment or init of user click!");
            replace && replace ('/coin/shop');
        } else {
            xdebug ("normal goBack");
            goBack && goBack ();
        }
    }
    openModal () {
        var {cuser, cpost, params, retrieveQrcode, location} = this.props;
        var subscribe = cuser && cuser.user && cuser.user.subscribe;
        var postId = params && params.postId;
        if (!subscribe && postId) {
            var post = cpost && cpost.db && cpost.db[postId];
            var title = post && post.desc && post.desc.name || '未命名艺术品';
            var description = '您可以点击继续进入刚才宝贝！';
            var baseUrl = window.location.protocol+"//"+window.location.host;
            var url = baseUrl+location.pathname;
            var picurl = post && post.images && (baseUrl+post.images[0]);
            retrieveQrcode ({ title, description, picurl, url });
        }
        this.setState({modalIsOpen: true});
    }

    render () {
        var {goBack, cpost, corder, cuser, params, participants, qrcode} = this.props;
        var postId = params && params.postId;
        var post = cpost && cpost.db && cpost.db[postId];
        var postStatus = post && post.status || 0;
        var totalCount = post && post.count || 0;
        var unit = post && post.unit || 0;

        var userSubscribe = !!(cuser && cuser.user && cuser.user.subscribe);
        var qrcodeDefault = config.qrcode;
        var qrcodeUrl = qrcode.qrcode || qrcodeDefault;

        var images = post && post.images && post.images.map((item)=>{
            return {desc: item, src: item}
        });
        if (!images) images = [{desc: '/images/none.jpg', src: '/images/none.jpg'}];
        var title = post && post.desc && post.desc.name || '未命名艺术品';

        var luckyOrder = null;
        var orderCountStatus1 = 0;
        var orderCountStatus2 = 0;
        var orders = corder.retrieve && corder.retrieve[postId] && corder.retrieve[postId].result;
        var orderList = orders && orders.map ((item, index)=>{
            var order = corder.db && corder.db[item];
            if (order) {
                if (order.status == 1) orderCountStatus1+=order.count;
                if (order.status == 2) orderCountStatus2+=order.count;
                if (postStatus == 6) {
                    if (post.lucky >=order.serial && post.lucky < (order.serial + order.count)) {
                        xdebug ("get lucky order! serial="+order.serial+", count="+order.count);
                        if (!luckyOrder)
                            luckyOrder = order;
                        else {
                            xdebug ("error! should only has one lucky order!!!");
                        }
                    }
                }

                if (order.status == 2) {
                    return (
        <tr key={index}>
        	{/*<td><img className="img-circle pull-left" style={{height:30}} src={item.avatar} /></td>*/}
        	<td><span>{"用户:"+order.userId}</span></td>
        	<td>
            <span>{"注号:"+order.serial}</span>
            <sub><span>{" 投"+order.count+"注"}</span><span style={{marginLeft:10, color:'#999'}}>{new Date(order.createdAt).toLocaleString()}</span></sub>
          </td>
        </tr>
                    )
                }
            }
        });
        var orderCountRemain = parseInt(totalCount - orderCountStatus1 - orderCountStatus2);

        var postStatusString = utilPostStatusToString (postStatus);

        var stateOrderCount = parseInt(this.state.orderCount);
        if (_.isNaN(stateOrderCount)) stateOrderCount = 0;

        const toggleDetail = () => {
            this.setState({algorithmDetail: !this.state.algorithmDetail});
        }
        var detailShow = ""
        var detailDisplay = 'none';
        if (this.state.algorithmDetail) {
            detailShow = "点击收起";
            detailDisplay = 'block';
        } else {
            detailShow = "点击展开...";
            detailDisplay = 'none';
        }
        return (
    <div style={{paddingTop: 50, paddingBottom: 50}}>
      <nav className="navbar navbar-default navbar-fixed-top" style={{lineHeight:'50px', fontSize:'20px', color:'#fff', opacity:0.5}}>
        <div style={{float:'left', marginLeft:5, boxSizing:'inline-block'}}><Link to="/coin" onClick={(e)=>{this.handleBack(e);} }>
          <i className="glyphicon glyphicon-menu-left img-circle" style={{top:5, color:'#ddd', opacity:1, backgroundColor:'#333', padding:5}}/>
        </Link></div>
        <div style={{float:'right', marginRight:5, boxSizing:'inline-block'}}><Link to="/coin/message">
          <i className="glyphicon glyphicon-bell img-circle" style={{top:5, color:'#ddd', opacity:1, backgroundColor:'#333', padding:5}}/>
        </Link></div>
      </nav>

      <ImageSlide images={images}/>

      <div className="container">
        <div className="row">

          <div className="col-xs-12" style={{wordWrap: 'break-word', wordBreak:'break-all', paddingTop:10 }}>{"编号"+postId+" "+title}</div>

          <div className="col-xs-12" style={{paddingTop:10}}>
            <Progress2 total={totalCount} paid={orderCountStatus2} prepay={orderCountStatus1}/>
          </div>

          <div className="col-xs-12">
            <div style={{textAlign:'center', backgroundColor:'#eee', padding:15, marginBottom:15}}>
              <div style={{marginBottom:15}}>{postStatusString}</div>
              { luckyOrder &&
              <p style={{textAlign:'left', textIndent:'2em'}}>{'恭喜幸运用户：'+luckyOrder.userId+', 单号：'+luckyOrder.uuid+', 排序号：'+luckyOrder.serial+', 注数:'+luckyOrder.count+', 运算：('+post.random1+'+'+post.random2.match(/\d+/g).join('')+')%'+post.count+'+1='+post.lucky}</p>
              }
              <div style={{marginTop:15}}>想要这样的好运气？快来参与吧！</div>
            </div>
            <div style={{textAlign:'center', backgroundColor:'#eee', padding:15, marginBottom:15}}>
              <p style={{textAlign:'left', textIndent:'2em'}} onClick={toggleDetail}>{'幸运序号算法为：两个随机数random1、random2相加与总注数count进行取余后加1。'+detailShow}</p>
              <p style={{textAlign:'left', textIndent:'2em', display: detailDisplay}}>{'结果为：(random1+random2)%count+1'}</p>
              <p style={{textAlign:'left', textIndent:'2em', display: detailDisplay}}>{'count：艺术品上传时设置的总共注数。'}</p>
              <p style={{textAlign:'left', textIndent:'2em', display: detailDisplay}}>{'random1：艺术品上传时生成的一个随机数，在1和总注数count之间。'}</p>
              <p style={{textAlign:'left', textIndent:'2em', display: detailDisplay}}>{'random2：夺宝结束时刻之后，重庆时时彩的中奖号码。网址：http://www.zhcw.com/kj/xndg/cq/ssc/index.shtml'}</p>
              <p style={{textAlign:'left', textIndent:'2em', display: detailDisplay}}>{'例子：一个商品总共100注，1注1元，艺术家上传时系统随机数为68，即random1=68。过了一段时间，这个商品100注全部被抢完，此时系统将等待重庆时时彩的开奖结果，大概10分钟左右获取到结果55868，即random2=55868。此时运算结果= ( 68 + 55868 ) % 100 + 1 = 37。至此注号为37者获得该艺术品。'}</p>

            </div>
          </div>

          <div className="col-xs-12">
            <div className="list-group">
              <Link type="button" className="list-group-item" to={"/coin/artworkdetail/"+postId}>
                <span>图文详情</span>
                <sub style={{float:'right', right:5}}>
                  <span>建议在wifi下查看</span>
                  <i className="glyphicon glyphicon-menu-right"/>
                </sub>
              </Link>
                {/*<Link type="button" className="list-group-item" style={{backgroundColor:'#373b3e', color:'#fff'}} onClick={(evt)=>{evt.preventDefault(); this.WeiXinShareBtn(post);}}>
                <span>晒单分享</span>
                <sub style={{float:'right'}}>
                  <span><b style={{color:"#f00"}}>不要点我</b>,点击微信右上角菜单分享</span>
                  <img style={{height:24}} src="/images/wechat_menu.png"/>
                </sub>
                </Link>*/}
              <Link type="button" className="list-group-item" style={{backgroundColor:'#227b39', color:'#fff'}} to={"/coin/qrcode"}>
                <span>关注公众号</span>
                <sub style={{float:'right', right:5}}>
                  <span>帝利文化</span>
                  <i className="glyphicon glyphicon-menu-right"/>
                </sub>
              </Link>
            </div>
          </div>

          <div className="col-xs-12">所有参与记录</div>

          <div className="col-xs-12">
            <table className="table table-striped">
            <tbody>
              {orderList}
            </tbody>
            </table>
          </div>
        </div>

      </div>

      <nav className="navbar navbar-default navbar-fixed-bottom" style={{padding:10}}>
        { (postStatus == 2) &&
        <div style={{backgroundColor:'#db3652', color:'#fff', textAlign:'center', fontSize:20, padding:5}} onClick={()=>this.openModal()}>
          {/*<span className="glyphicon glyphicon-oil"></span>*/}
          <span>开启幸运之门</span>
        </div>
        }
        { (postStatus == 5) &&
        <div style={{backgroundColor:'#db3652', color:'#fff', textAlign:'center', fontSize:20, padding:5}}>
          {/*<span className="glyphicon glyphicon-oil"></span>*/}
          <span>已经完成筹集，等待开奖</span>
        </div>
        }
        { (postStatus == 6) &&
        <div style={{backgroundColor:'#db3652', color:'#fff', textAlign:'center', fontSize:20, padding:5}}>
          {/*<span className="glyphicon glyphicon-oil"></span>*/}
          <span>已经结束</span>
        </div>
        }
        { (postStatus != 2) && (postStatus != 5) && (postStatus != 6) &&
        <div style={{backgroundColor:'#db3652', color:'#fff', textAlign:'center', fontSize:20, padding:5}}>
          {/*<span className="glyphicon glyphicon-oil"></span>*/}
          <span>该艺术品还未开启</span>
        </div>
        }
      </nav>

      <ReactModal isOpen={this.state.modalIsOpen}
            overlayClassName={cx("modalOverlay")}
            className={cx("modal-dialog", "modalContent")}
            contentLabel="onRequestClose Example"
            onRequestClose={this.handleCloseModal.bind(this)}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.handleCloseModal.bind(this)}>
                <span aria-hidden="true">&times;</span>
                <span className="sr-only">Close</span>
              </button>
              <h5 className="modal-title">夺宝有风险，参与需谨慎</h5>
            </div>
            { userSubscribe &&
            <div className="modal-body container" style={{textAlign: 'center'}}>
              <h4>参与投注</h4>
              <div className={cx("col-xs-12", "m-detail-mall-number-input")} id="mallNumberInput">
                <div className={cx("w-number")} id="pro-view-3">
                  <a className={cx("w-number-btn", "w-number-btn-minus")} style={{textDecoration:'none'}} pro="minus" href="javascript:void(0);" onClick={()=>{this.setOrderCount(stateOrderCount-1, unit, orderCountRemain);}}>－</a>
                  <input className={cx("w-number-input")} pro="input" type="text" value={this.state.orderCount} onChange={(evt) => {this.setOrderCountChange(evt.target.value, unit, orderCountRemain);}}/>
                  <a className={cx("w-number-btn", "w-number-btn-plus")} style={{textDecoration:'none'}} pro="plus" href="javascript:void(0);" onClick={()=>{this.setOrderCount(stateOrderCount+1, unit, orderCountRemain);}}>＋</a>
                </div>
              </div>
              <div className="col-xs-12" style={{textAlign:'center'}}>
                  <button type="button" className="btn btn-default" style={{width:30, padding:5, margin:5}} onClick={()=>this.setOrderCount(5, unit, orderCountRemain)}>5</button> 
                  <button type="button" className="btn btn-default" style={{width:30, padding:5, margin:5}} onClick={()=>this.setOrderCount(10, unit, orderCountRemain)}>10</button> 
                  <button type="button" className="btn btn-default" style={{width:30, padding:5, margin:5}} onClick={()=>this.setOrderCount(20,unit, orderCountRemain)}>20</button> 
                  <button type="button" className="btn btn-default" style={{width:30, padding:5, margin:5}} onClick={()=>this.setOrderCount(50, unit, orderCountRemain)}>50</button> 
              </div>
              <div> 共<b>{stateOrderCount}</b>注，需支付<b>{stateOrderCount*unit}</b>元</div>
              <div> 下单后需在1分钟内完成支付，否则关闭订单，您可以重新再参与。</div>
            </div>
            }
            { !userSubscribe &&
            <div className="modal-body container" style={{textAlign: 'center'}}>
              <h4>为便于我们联系您，必须先关注公众号才能参与。您可以常按二维码进行识别</h4>
              <div style={{width:'100%'}}>
                <img src={qrcodeUrl} className="img-responsive" alt="Responsive image"/>
              </div>
            </div>
            }
            <div className="modal-footer">
              <div style={{backgroundColor:'#db3652', color:'#fff', textAlign:'center', fontSize:20, padding:5}} onClick={this.createNewOrder.bind(this)}>
                <span>确定支付</span>
              </div>
            </div>

          </div>
      </ReactModal>

    </div>
        );
    }
}

