var xdebug = window.myDebug('COIN:ArtworkList')
import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import _ from 'lodash';
import moment from 'moment';
import styles2 from './styles.scss';
import styles from 'components/widgets/Widgets.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const Progress = ({total, current}) => {
    current = parseInt(current);
    var percent = total && current && Math.floor(current*100/total)+'%' || '0%';
    //xdebug ("progress:", total, current);
    return (
<div style={{overflow:'hidden'}}>
  <div className="progress" style={{marginBottom:0, backgroundColor:'#ccc', height:5}}>
    <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width: percent, color:'#f0f', backgroundColor:'#ff0'}}><span className="sr-only"> {percent} </span></div>
  </div>
  <div style={{height:'1.1em'}}>
    <div className="pull-left text-left">总需<b>{total}</b>注</div>
    <div className="pull-right text-right">剩余<b style={{color:'#f00'}}>{total-current}</b>注</div>
  </div>
</div>
    )
}

const Card = ({art}) => {
    //xdebug ("art:", art);
    var id = art && art.id || 0;
    var name = art && art.desc && art.desc.name || '未命名艺术作品';
    var createdAt = art && moment(new Date(art.createdAt)).format('YYYY-MM-DD HH:mm') || '　';
    var excerpt = art && art.desc && art.desc.excerpt || '无摘要艺术作品';
    var images = art && art.images || ['/images/none.jpg'];
    var rating = art && art.favor || 0;

    return (
  <div style={{marginTop:5, marginBottom:5, backgroundColor:'#f6f6f6'}}>
    <div className={ cx('imageContainer') }>
      <Link className={ cx('media-photo', 'media-cover') } to={ art.link }>
        <div className={ cx('listing-img-container','media-cover','text-center') }>
          <img src={ images[0] } className={ cx('responsive-imgwh') } alt={excerpt}/>
        </div>
      </Link>
    </div>
    <div className={cx('infoContainer')}>
        <Link className={cx('linkContainer')} to={ art.link }>
          <Progress total={art.count} current={art.paid}/>
          <div>
            <div className={cx('text_size_small_weight_light_inline')}>
              <div className={cx('detailContainer')} style={{textOverflow: 'ellipsis',overflow: 'hidden'}}>{ "编号"+id+" "+name }</div>
            </div>
          </div>
          <div>
            <div className={cx('text_size_small_weight_light_inline')}>
              <div className={cx('detailContainer')} style={{textOverflow: 'ellipsis',overflow: 'hidden'}}><sub>{ createdAt }</sub></div>
            </div>
          </div>
        </Link>
    </div>
  </div>
    )
}

const ArtworkList = ({items}) => {
    var artworks = items && items.map ((item, index)=>{
        return (
		        <li key={index} className="col-xs-12 col-sm-4 appmsg_item_v js_appmsgitem"> <Card art={item}/></li>
        )
    });
    return (
<div className="container">
	<ul className="row inner_list_v" style={{listStyle:'none', paddingLeft: 0}}>
    {artworks}
	</ul>
  { _.isEmpty(items) &&
  <div style={{textAlign:'center'}}>
    没有宝物
  </div>
  }
</div>
    )
}

export default class Page extends Component {
    static propTypes = {
        retrievePosts: PropTypes.func.isRequired,

        postStatus: PropTypes.object.isRequired,
        postDb: PropTypes.object.isRequired,
        cpost: PropTypes.object.isRequired,

        cuser: PropTypes.object.isRequired,
        updateUser: PropTypes.func.isRequired,
        retrieveSomeUsers: PropTypes.func.isRequired,
    }

    constructor (props) {
        super (props);
    }

    componentDidMount() {
        var { params, cuser, retrievePosts, retrieveSomeUsers } = this.props;
        var owner = params && params.userId;
        retrievePosts (owner);

        var userId = cuser && cuser.user && cuser.user.id;
        if (owner && userId) {
            // update owner.
            this.updateUserVisited (cuser.user, owner);
        }
        if (owner)
            retrieveSomeUsers([owner]).then ( retobj => {
                this.onShare (owner);
            });
        wx && wx.showAllNonBaseMenuItem();
    }

    componentWillReceiveProps (nextProps) {
        //xdebug ("componentWillReceiveProps");
        var { params, cuser } = this.props;
        var oldUserId = cuser && cuser.user && cuser.user.id;
        var oldOwner = params && params.userId;
        var { params, cuser } = nextProps;
        var newUserId = cuser && cuser.user && cuser.user.id;
        var newOwner = params && params.userId;

        if ( newUserId && newOwner && (oldUserId != newUserId || oldOwner != newOwner ) ) {
            xdebug ("componentWillReceiveProps: user.id "+oldUserId+"=>"+newUserId+", owner "+oldOwner+"=>"+newOwner);
            this.updateUserVisited (nextProps.cuser.user, newOwner);
        }

        if (newOwner && (newOwner != oldOwner)) {
            this.onShare (newOwner);
        }
    }

    updateUserVisited (user, owner) {
        if (owner && user && user.id) {
            // update owner.
            var visited = user.visited || [];
            var nArr = _.union(visited, [owner]);
            var xor = _.xor (visited, nArr);
            if (xor && xor.length> 0) {
                var { updateUser } = this.props;
                xdebug ("need update user's visited!", xor);
                updateUser (user.id, {visited: nArr});
            }
        } else {
            xdebug ("updateUserVisited: not update!");
        }
    }

    onShare (shopId) {
        var {cuser} = this.props;
        var me = cuser && cuser.user || {};
        var meName = me.nicename||'';
        if (me.subscribe) meName = me.wechat && me.wechat.nickname;

        var shop = cuser && cuser.db && cuser.db[shopId] || {};
        var ownerName = shop.nicename || '';
        var ownerAvatar = "http://"+location.host+"/images/avatar-1.png";
        if (shop.subscribe) {
            ownerName = shop.wechat && shop.wechat.nickname;
            ownerAvatar = shop.wechat && shop.wechat.headimgurl;
        }

        var name = ownerName+'的藏宝阁';
        var desc = meName+' 分享了编号'+shopId+', '+ownerName+'的藏宝阁';
        var link = "http://"+location.host+"/coin/shop/"+shopId;

        wx && wx.onMenuShareAppMessage({
            title: name, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接
            imgUrl: ownerAvatar, // 分享图标
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

    render () {
        var { params, cpost, postDb, postStatus, retrievePosts, cuser } = this.props;
        var logo = "/images/logo48.png";
        var owner = params && params.userId;

        var postList = postStatus && postStatus.result || [];
        var artworks = postList && postList.map ((id, index)=>{
            var artwork = postDb && postDb[id];
            if (artwork && owner) {
                artwork.link = '/coin/shop/'+owner+'/'+artwork.id;
            } else {
                artwork.link = '/coin/artwork/'+artwork.id;
            }
            return artwork;
        });

        var total = postStatus && postStatus.total || 0;
        var count = postStatus && postStatus.result && postStatus.result.length || 0;
        var page = postStatus && postStatus.page || 0;
        const retriveRefresh = () => {
            retrievePosts (owner, 0);
        }
        const retriveMore = () => {
            retrievePosts (owner, page+1);
        }

        //xdebug ("render:", cpost, ", total="+total+", count="+count+", page="+page);
        return (
    <div>
      <nav className="navbar navbar-default navbar-fixed-top" style={{lineHeight: '50px', fontSize:24, backgroundColor:'#db3652', color:'#fff', whiteSpace:'nowrap'}}>
        <div className="container">
          {/* !owner &&
          <div style={{float:'left', boxSizing:'inner-box'}}>
            <Link to='/coin/search'><span className="glyphicon glyphicon-search" style={{color:'#fff'}}></span></Link>
          </div>
          */}
          <div style={{float:'left', boxSizing:'inner-box'}}>
            <Link to='/coin/'>
              <img className="img-circle" style={{height:48, width:48}} src={logo}/>
            </Link>
          </div>
          <div style={{float:'left', paddingLeft: 50}}> <span>帝利文化</span> </div>
          <div style={{float:'right', boxSizing:'inner-box'}}>
            <Link to='/coin/message'>
              <span className="glyphicon glyphicon-bell" style={{color:'#fff'}}></span>
            </Link>
          </div>
        </div>
      </nav>
      <div style={{paddingTop: 55}}>

          <div className="col-xs-12">
            <div className="list-group">
                {/*<Link type="button" className="list-group-item" style={{backgroundColor:'#373b3e', color:'#fff'}} onClick={(evt)=>{evt.preventDefault();}}>
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

        { (count != 0) &&
        <div style={{marginTop:10, textAlign:'center'}} onClick={retriveRefresh}>点此可刷新</div>
        }
        <ArtworkList items={artworks} />
        { count < total &&
        <div style={{marginTop:10, textAlign:'center'}} onClick={retriveMore}>点此加载更多...</div>
        }
      </div>
    </div>
        );
    }
}

