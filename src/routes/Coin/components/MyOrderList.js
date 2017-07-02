var xdebug = window.myDebug('COIN:MyOrderList')
import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import _ from 'lodash';

const OrderList = ({items}) => {
    var orderList = items && items.map ((order, index)=>{
        var postUrl = '/coin/artwork/'+order.postId;
        if (order.owner)
            postUrl = '/coin/shop/'+order.owner+'/'+order.postId;
        return (
        <tr key={index}>
          <th>{order.id}</th>
        	<td>
            <Link to={postUrl}><span style={{paddingLeft:10, paddingRight:10}}>{order.postId}</span></Link>
          </td>
        	<td>
            <span>{order.count}注</span>
          </td>
        	<td>
            <div style={{whiteSpace:'nowrap'}}>{new Date(order.createdAt).toLocaleString()}</div>
          </td>
        </tr>
        )
    });
    return (
<div className="container">
        <div className="row">
          <div className="col-xs-12">
            { !_.isEmpty(items) &&
            <table className="table table-striped">
            <thead>
              <tr> 
                <th>单号</th>
                <th>艺术品编号</th>
                <th>注数</th>
                <th>日期</th>
              </tr>
            </thead>
            <tbody>
              {orderList}
            </tbody>
            </table>
            }
            { _.isEmpty(items) &&
              <div style={{textAlign:'center'}}>
                没有记录，继续努力
              </div>
            }
          </div>
        </div>
</div>
    )
}

export default class Page extends Component {
    static propTypes = {
        goBack: PropTypes.func.isRequired,
        retrieveMyOrders: PropTypes.func.isRequired,
        retrieveSomePosts: PropTypes.func.isRequired,

        pageName: PropTypes.string.isRequired,
        orderDb: PropTypes.object.isRequired,
        orderStatus: PropTypes.object.isRequired,

        postDb: PropTypes.object.isRequired,
    }

    constructor (props) {
        super (props);
        this.content = null;

        this.curYPos = null;
        this.curXPos = null;
        this.curDown = null;
    }

    componentDidMount() {
        var { retrieveSomePosts, retrieveMyOrders, orderStatus } = this.props;
        var orderList = orderStatus && orderStatus.result;
        window.addEventListener('scroll', this.handleScroll.bind(this));

        window.addEventListener('mousemove', (e) => { 
            if(this.curDown){
                window.scrollTo(document.body.scrollLeft + (this.curXPos - e.pageX), document.body.scrollTop + (this.curYPos - e.pageY));
            }
        });
        window.addEventListener('mousedown', (e) => { 
            this.curYPos = e.pageY; 
            this.curXPos = e.pageX; 
            this.curDown = true; 
        });
        window.addEventListener('mouseup', (e) => { 
            this.curDown = false; 
        });

        if (!orderList || _.isEmpty(orderList)) {
            this.getOrders (0);
        }

    }

    getOrders (page) {
        var { retrieveSomePosts, retrieveMyOrders } = this.props;
        retrieveMyOrders (page).then (({result, db}) => {
            //xdebug ("result:",result, ",db:", db);
            var postIds = result && result.map (orderId => {
                var order = db && db[orderId];
                if (order)
                    return order.postId;
                else
                    return 0;
            })
            //xdebug ("postIds:", postIds);
            if (postIds && !_.isEmpty(postIds)) {
                var postIdSet = new Set(postIds);
                retrieveSomePosts ([...postIdSet]);
            }
        });
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }
    
    handleScroll () {
        //xdebug ("handleScroll");
        if (this.content) {
            var {total, page, orderList} = this.props;
            if ((orderList && orderList.length || 0) < total) {
                var rect = this.content.getBoundingClientRect();
                var screenHeight = window.screen.height;
                xdebug ("scroll", rect, window.screen.availHeight, window.screen.height);
                if (rect.bottom <= screenHeight) {
                    xdebug("need to scroll. get page:"+(page+1));
                    //this.props.retrieveMyOrders (page+1);
                    this.getOrders(page+1);
                }
            }
        }
    }

    render () {
        var { pageName, goBack, postDb, orderDb, orderStatus } = this.props;
        var orderList = orderStatus && orderStatus.result;
        var total = orderStatus && orderStatus.total || 0;
        var count = orderStatus && orderStatus.count || 0;

        var orders = orderDb && orderList && orderList.map (orderId => {
            var order = orderDb[orderId];
            if (order) {
                var postId = order.postId;

                var owner = 0;
                var post = postId && postDb && postDb[postId];
                if (post) owner = post.owner;
                order.owner = owner;
                return order;
            }
        });
        return (
    <div>
      <nav className="navbar navbar-default navbar-fixed-top" style={{lineHeight:'50px', fontSize:20, backgroundColor:'#db3652', color:'#fff', whiteSpace:'nowrap'}}>
        <div style={{float:'left', marginLeft:5, boxSizing:'inline-block'}}><Link to="/coin" onClick={(e)=>{e.preventDefault(); goBack && goBack();} }>
          <i className="glyphicon glyphicon-menu-left img-circle" style={{top:5, color:'#ddd', opacity:1, backgroundColor:'#333', padding:5}}/>
        </Link></div>
        <div style={{float:'left', paddingLeft: 50}}> <span>{pageName}</span> </div>
      </nav>
      <div style={{paddingTop: 55}} ref={(v)=> {this.content=v;}}>
        <OrderList items={orders} />
        { orderList && orderList.length < total &&
        <div style={{marginTop:10, textAlign:'center'}} onClick={()=>{this.getOrders (page+1);}}>点击加载更多...</div>
        }
      </div>
    </div>
        );
    }
}

