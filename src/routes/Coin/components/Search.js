var xdebug = window.myDebug('COIN:Search');
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
      <Link className={ cx('media-photo', 'media-cover') } to={ '/coin/artwork/'+id }>
        <div className={ cx('listing-img-container','media-cover','text-center') }>
          <img src={ images[0] } className={ cx('responsive-imgwh') } alt={excerpt}/>
        </div>
      </Link>
    </div>
    <div className={cx('infoContainer')}>
        <Link className={cx('linkContainer')} to={ '/coin/artwork/'+id }>
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
  { !_.isEmpty(items) &&
	<ul className="row inner_list_v" style={{listStyle:'none', paddingLeft: 0}}>
    {artworks}
	</ul>
  }
  { _.isEmpty(items) &&
  <div style={{textAlign:'center'}}>
    没有找到宝物
  </div>
  }
</div>
    )
}


export default class Page extends Component {
    static propTypes = {
        goBack: PropTypes.func.isRequired,
        retrievePosts: PropTypes.func.isRequired,

        postStatus: PropTypes.object.isRequired,
        postDb: PropTypes.object.isRequired,
    }

    constructor (props) {
        super (props);
        this.state = {
            key:'',
        }
    }
    componentDidMount () {
    }

    setAndSearch (key) {
        var { retrievePosts } = this.props;
        this.setState ({key});
        retrievePosts (key, 0);
    }

    render () {
        var { goBack, push, replace, retrievePosts, postDb, postStatus } = this.props;
        var postList = postStatus && postStatus.result || [];
        var artworks = postList && postList.map ((id, index)=>{
            var artwork = postDb && postDb[id];
            return artwork;
        });

        var total = postStatus && postStatus.total || 0;
        var count = postStatus && postStatus.result && postStatus.result.length || 0;
        var page = postStatus && postStatus.page || 0;
        const retriveRefresh = () => {
            retrievePosts (this.state.key, 0);
        }
        const retriveMore = () => {
            retrievePosts (this.state.key, page+1);
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
                <input className="form-control" placeholder="输入关键字,如:黄山" aria-label="Text input with multiple buttons" style={{height:34}} onChange={(evt) => this.setState({key: evt.target.value})} value={this.state.key}/>
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

        <div className="row" style={{}}>
          <div className="col-xs-12" style={{paddingTop:10, paddingBottom:10}}>
            <span style={{color:'#999'}}>历史搜索</span>
            <span style={{color:'#2f2', float:'right'}}>清空</span>
          </div>
          {/*<div className="col-xs-12" style={{paddingTop:10, paddingBottom:10}}>欧米茄</div>
          <div className="col-xs-12" style={{paddingTop:10, paddingBottom:10}}>iPhone</div>*/}
        </div>
      </div>

        { (count == 0) &&
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

