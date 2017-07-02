var xdebug = window.myDebug('COIN:MyRefundList')
import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import _ from 'lodash';

const RefundList = ({items}) => {
    var refundList = items && items.map ((item, index)=>{
        var postUrl = '/coin/artwork/'+item.postId;
        if (item.owner)
            postUrl = '/coin/shop/'+item.owner+'/'+item.postId;
        var fee = item.refundFee && new Number(item.refundFee/100).toFixed(2);
        var status = '草案';
        switch (item.status) {
        case 1: status='退款中'; break;
        case 2: status='退款成功'; break;
        case 3: status='退款失败'; break;
        }
        return (
        <tr key={index}>
          <th>{item.id}</th>
        	<td>
            <Link to={postUrl}><span style={{paddingLeft:10, paddingRight:10}}>{item.postId}</span></Link>
          </td>
        	<td>
                <span>{status}</span>
            </td>
        	<td>
                <span>{fee+'元'}</span>
            </td>
        	<td>
            <div style={{whiteSpace:'nowrap'}}>{new Date(item.updatedAt).toLocaleString()}</div>
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
                <th>退款单号</th>
                <th>艺术品编号</th>
                <th>状态</th>
                <th>金额</th>
                <th>日期</th>
              </tr>
            </thead>
            <tbody>
              {refundList}
            </tbody>
            </table>
            }
            { _.isEmpty(items) &&
              <div style={{textAlign:'center'}}>
                没有记录
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
        retrieveRefunds: PropTypes.func.isRequired,
        retrieveSomePosts: PropTypes.func.isRequired,

        pageName: PropTypes.string.isRequired,
        refundDb: PropTypes.object.isRequired,
        refundStatus: PropTypes.object.isRequired,

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
        var { refundStatus } = this.props;
        var refundList = refundStatus && refundStatus.result;
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

        if (!refundList || _.isEmpty(refundList)) {
            this.getRefunds (0);
        }

    }

    getRefunds (page) {
        var { retrieveSomePosts, retrieveRefunds } = this.props;
        retrieveRefunds (page).then (({result, db}) => {
            //xdebug ("result:",result, ",db:", db);
            var postIds = result && result.map (refundId => {
                var refund = db && db[refundId];
                if (refund)
                    return refund.postId;
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
            var {total, page, refundList} = this.props;
            if ((refundList && refundList.length || 0) < total) {
                var rect = this.content.getBoundingClientRect();
                var screenHeight = window.screen.height;
                xdebug ("scroll", rect, window.screen.availHeight, window.screen.height);
                if (rect.bottom <= screenHeight) {
                    xdebug("need to scroll. get page:"+(page+1));
                    this.getRefunds(page+1);
                }
            }
        }
    }

    render () {
        var { pageName, goBack, postDb, refundDb, refundStatus } = this.props;
        var refundList = refundStatus && refundStatus.result;
        var total = refundStatus && refundStatus.total || 0;
        var count = refundStatus && refundStatus.count || 0;

        var refunds = refundDb && refundList && refundList.map (refundId => {
            var refund = refundDb[refundId];
            if (refund) {
                var postId = refund.postId;

                var owner = 0;
                var post = postId && postDb && postDb[postId];
                if (post) owner = post.owner;
                refund.owner = owner;
                return refund;
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
        <RefundList items={refunds} />
        { refundList && refundList.length < total &&
        <div style={{marginTop:10, textAlign:'center'}} onClick={()=>{this.getRefunds (page+1);}}>点击加载更多...</div>
        }
      </div>
    </div>
        );
    }
}

