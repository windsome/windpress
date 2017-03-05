import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import ReactModal from 'react-modal';
import _ from 'lodash';
import classes from './styles.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);
import FiveStar from 'components/widgets/FiveStar';
var xdebug = window.myDebug('COIN:Artwork');
ReactModal.setAppElement('#root');

const Progress = ({total, current}) => {
    var percent = total && current && Math.floor(current*100/total)+'%' || '0%';
    xdebug ("progress:", total, current);
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

        cpost: PropTypes.object.isRequired,
        retrievePosts: PropTypes.func.isRequired,

        corder: PropTypes.object.isRequired,
        retrieveOrdersLatest: PropTypes.func.isRequired,
        retrieveOrdersBigThan: PropTypes.func.isRequired,
        createOrder: PropTypes.func.isRequired,
    }

    constructor (props) {
        super (props);
        this.state = {
            modalIsOpen: false,
            orderCount: 0,
        }
    }

    componentDidMount() {
        var { params, cpost, retrievePosts, retrieveOrdersLatest } = this.props;
        if (params && params.id) {
            if (cpost && cpost.db && cpost.db[params.id]) {
                xdebug ("already have this post, no need to retrieve again!");
            } else 
                retrievePosts (params.id);
            retrieveOrdersLatest (params.id);
        }
    }

    componentWillUnmount() {
    }

    handleCloseModal () {
        this.setState({modalIsOpen:false});
        //return true;
    }

    initOrder () {
        var {createOrder, params, retrieveOrdersLatest} = this.props;
        var postId = params && params.id;
        if (postId && this.state.orderCount > 0) {
            createOrder ({uuid:'xxxxx', count: this.state.orderCount, status: 0, userId:1, postId}).then ((order)=>{
                this.setState({modalIsOpen:false});
                // refresh orders.
                retrieveOrdersLatest (params.id);
            })
        }
    }

    render () {
        var {goBack, cpost, corder, params, participants} = this.props;
        var postId = params && params.id;
        var post = cpost && cpost.db && cpost.db[postId];

        var totalCount = post && post.count || 0;
        var unit = post && post.unit || 0;

        var images = post && post.images && post.images.map((item)=>{
            return {desc: item, src: item}
        });
        if (!images) images = [{desc: '/images/none.jpg', src: '/images/none.jpg'}];
        var title = post && post.desc && post.desc.name || '未命名艺术品';

        var orders = corder.retrieve && corder.retrieve[postId] && corder.retrieve[postId].result;
        var orderList = orders && orders.map ((item, index)=>{
            var order = corder.db && corder.db[item];
            return (
        <tr key={index}>
        	<td><img className="img-circle pull-left" style={{height:30}} src={item.avatar} /></td>
        	<td>
            <span>{order.userId}</span><br/>
            <sub><span>投{order.count}注</span><span style={{marginLeft:10, color:'#999'}}>{new Date(order.createdAt).toLocaleString()}</span></sub>
          </td>
        </tr>
            )
        });
        
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

      <ImageSlide images={images}/>

      <div className="container">
        <div className="row">

          <div className="col-xs-12" style={{wordWrap: 'break-word', wordBreak:'break-all', paddingTop:10 }}>{title}</div>

          <div className="col-xs-12" style={{paddingTop:10}}>
            <Progress total={100} current={10}/>
          </div>

          <div className="col-xs-12">
            <div style={{textAlign:'center', backgroundColor:'#eee', paddingTop:15, paddingBottom:15, marginBottom:15}}>想要这样的好运气？快来参加夺宝吧！</div>
          </div>

          <div className="col-xs-12">
            <div className="list-group">
              <Link type="button" className="list-group-item" to={"/coin/artworkdetail/"+postId}>
                <span>图文详情</span>
                <sub style={{float:'right', right:5}}><span>建议在wifi下查看</span><i className="glyphicon glyphicon-menu-right"/></sub>
              </Link>
              <Link type="button" className="list-group-item">晒单分享</Link>
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
        <div style={{backgroundColor:'#db3652', color:'#fff', textAlign:'center', fontSize:20, padding:5}} onClick={()=>this.setState({modalIsOpen: true})}>
          {/*<span className="glyphicon glyphicon-oil"></span>*/}
          <span>立即下注</span>
        </div>
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

            <div className="modal-body container" style={{textAlign: 'center'}}>
              <h4>参与投注</h4>
              <div className={cx("col-xs-12", "m-detail-mall-number-input")} id="mallNumberInput">
                <div className={cx("w-number")} id="pro-view-3">
                  <a className={cx("w-number-btn", "w-number-btn-minus")} pro="minus" href="javascript:void(0);" onClick={()=>{var count = this.state.orderCount-1; if (count < 0) count = 0; this.setState({orderCount: count});}}>－</a>
                  <input className={cx("w-number-input")} pro="input" type="text" value={this.state.orderCount} onChange={(evt) => {var count = parseInt(evt.target.value); if (count > totalCount) count=totalCount; this.setState({orderCount: count});}}/>
                  <a className={cx("w-number-btn", "w-number-btn-plus")} pro="plus" href="javascript:void(0);" onClick={()=>{var count = this.state.orderCount+1; if (count > totalCount) count = totalCount; this.setState({orderCount: count});}}>＋</a>
                </div>
              </div>
              <div className="col-xs-12" style={{textAlign:'center'}}>
                  <button type="button" className="btn btn-default" style={{width:30, padding:5, margin:5}} onClick={()=>this.setState({orderCount:5})}>5</button> 
                  <button type="button" className="btn btn-default" style={{width:30, padding:5, margin:5}} onClick={()=>this.setState({orderCount:10})}>10</button> 
                  <button type="button" className="btn btn-default" style={{width:30, padding:5, margin:5}} onClick={()=>this.setState({orderCount:20})}>20</button> 
                  <button type="button" className="btn btn-default" style={{width:30, padding:5, margin:5}} onClick={()=>this.setState({orderCount:50})}>50</button> 
              </div>
              <div> 共<b>{this.state.orderCount}</b>注，需支付<b>{this.state.orderCount*unit}</b>元</div>
            </div>
            <div className="modal-footer">
              <div style={{backgroundColor:'#db3652', color:'#fff', textAlign:'center', fontSize:20, padding:5}} onClick={this.initOrder.bind(this)}>
                <span>确定下注</span>
              </div>
            </div>

          </div>
      </ReactModal>

    </div>
        );
    }
}

