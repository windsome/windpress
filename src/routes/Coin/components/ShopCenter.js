var xdebug = window.myDebug('COIN:ShopCenter');
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
        goBack: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,

        retrieveItems: PropTypes.func.isRequired,

        itemStatus: PropTypes.object.isRequired,
        itemDb: PropTypes.object.isRequired,
        cuser: PropTypes.object.isRequired,

        retrieveFavorPosts: PropTypes.func.isRequired,
        postStatus: PropTypes.object.isRequired,
        postDb: PropTypes.object.isRequired,
        cpost: PropTypes.object.isRequired,
    }
    constructor (props) {
        super (props);
    }
    
    componentDidMount() {
        var { cuser, retrieveItems, retrieveFavorPosts } = this.props;
        var visited = cuser && cuser.user && cuser.user.visited;
        retrieveItems (visited);
        retrieveFavorPosts ();
    }

    componentWillReceiveProps (nextProps) {
        //xdebug ("componentWillReceiveProps");
        var { cuser, retrieveItems, retrieveFavorPosts } = nextProps;
        var oldUserId = this.props.cuser && this.props.cuser.user && this.props.cuser.user.id;
        var newUserId = cuser && cuser.user && cuser.user.id;
        if( oldUserId != newUserId ) { 
            var visited = cuser && cuser.user && cuser.user.visited;
            retrieveItems (visited);
        }
    }   

    render () {
        var { replace, retrieveItems, itemDb, itemStatus, cuser, cpost, postDb, postStatus, retrieveFavorPosts } = this.props;
        var isFetching = itemStatus && itemStatus.fetching;
        var user = cuser && cuser.user || {};
        var userId = user.id || 0;
        var openid = user.openid || '';

        var postList = postStatus && postStatus.result || [];
        var artworks = postList && postList.map ((id, index)=>{
            var artwork = postDb && postDb[id];
            if (artwork){
                var owner = artwork.owner;
                if (owner) {
                    artwork.link = '/coin/shop/'+owner+'/'+artwork.id;
                } else {
                    artwork.link = '/coin/artwork/'+artwork.id;
                }
                return artwork;
            }
        });
        var total = postStatus && postStatus.total || 0;
        var count =postStatus && postStatus.result && postStatus.result.length ||0;
        var page = postStatus && postStatus.page || 0;
        const retriveRefresh = () => {
            retrieveFavorPosts (0);
        }
        const retriveMore = () => {
            retrieveFavorPosts (page+1);
        }

        var avatar = user && user.avatar || (user && user.wechat && user.wechat.headimgurl) ||'/images/avatar-1.png';

        var visited = cuser && cuser.user && cuser.user.visited || [];
        var shops = itemStatus && itemStatus.result;
        var shopUIs = itemDb && shops && shops.map ( (id, index) => {
            var shop = itemDb[id];
            var shopAvatar = shop.avatar || (shop.wechat && shop.wechat.headimgurl) || '/images/avatar-1.png';
            var shopName = shop.nicename || (shop.wechat && shop.wechat.nickname) ||
('编号'+shop.id+'藏宝阁');
            return (
              <Link type="button" className="list-group-item" to={"/coin/shop/"+shop.id} key={index}>
  							<div style={{whiteSpace: 'nowrap',textOverflow:'ellipsis',overflow: 'hidden',paddingRight: 50, width:'100%'}}>
                  <img className="img-circle" style={{height:26, width:26}} src={shopAvatar}/>
                  {" "+shopName}
                  <sub style={{position: 'absolute', float:'right', right:20, top:16}}><i className="glyphicon glyphicon-menu-right"/></sub>
                </div>
              </Link>
            )
        } );
        return (
    <div>
      <nav className="navbar navbar-default navbar-fixed-top" style={{lineHeight: '50px', fontSize:24, backgroundColor:'#db3652', color:'#fff', whiteSpace:'nowrap'}}>
        <div className="container">
          <div style={{float:'left', paddingLeft: 50}}> <span>我踩过的地方</span> </div>
          <div style={{float:'right', boxSizing:'inner-box'}}><Link to='/coin/message'><span className="glyphicon glyphicon-bell" style={{color:'#fff'}}></span></Link></div>
        </div>
      </nav>

      <div className="container" style={{paddingTop: 55}}>
        <div className="row">
          { isFetching && 
          <div className="col-xs-12">
            正在获取中，请稍等。。。
          </div>
          }
          { !isFetching && (!shops || shops.length <= 0) && 
          <div className="col-xs-12">
            您没踩过。。。
          </div>
          }
          <div className="col-xs-12">
            <div className="list-group">
              { shopUIs }
            </div>
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

