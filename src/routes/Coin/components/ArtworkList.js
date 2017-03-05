import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import _ from 'lodash';
//import classNames from 'classnames';
import styles2 from './styles.scss';
import styles from 'components/widgets/Widgets.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
import FiveStar from 'components/widgets/FiveStar';

var xdebug = window.myDebug('COIN:ArtworkList')

const Card = ({art}) => {
    xdebug ("art:", art);
    var id = art && art.id || 0;
    var name = art && art.desc && art.desc.name || '未命名艺术作品';
    var excerpt = art && art.desc && art.desc.excerpt || '无摘要艺术作品';
    var images = art && art.images || ['/images/none.jpg'];
    var rating = art && art.favor || 0;

    return (
  <div>
    <div className={ cx('imageContainer') }>
      <Link className={ cx('media-photo', 'media-cover') } to={ '/coin/artwork/'+id }>
        <div className={ cx('listing-img-container','media-cover','text-center') }>
          <img src={ images[0] } className={ cx('responsive-imgwh') } alt={excerpt}/>
        </div>
      </Link>
    </div>
    <div className={cx('infoContainer')}>
        <Link className={cx('linkContainer')} to={ '/coin/artwork/'+id }>
          <div>
            <div className={cx('text_size_small_weight_light_inline')}>
              <div className={cx('detailContainer')} style={{textOverflow: 'ellipsis',overflow: 'hidden'}}>{ name }</div>
            </div>
          </div>
          <div>
            <span>
              <FiveStar star={rating} />
              <span>{rating}</span>
            </span>
          </div>
        </Link>
    </div>
  </div>
    )
}

const ArtworkList = ({db, list}) => {
    xdebug ("db:", db, "list:", list);
    var artworks = list && list.map ((id, index)=>{
        var artwork = db && db[id];
        return (
		        <li key={id} className="col-xs-12 col-sm-4 appmsg_item_v js_appmsgitem"> <Card art={artwork}/></li>
        )
    });
    return (
<div className="container">
	<ul className="row inner_list_v" style={{listStyle:'none', paddingLeft: 0}}>
    {artworks}
		{/*<li className="col-xs-12 col-sm-4 appmsg_item_v js_appmsgitem"><Card art={{id: 1, thumb: '/images/art1.jpg', name: '夸张的现实主义画作', desc: '于成龙于1786年在颍上观潮所作，回顾其清廉一生，百感交集，一气呵成。', rating: 3.4}} /></li>*/}
		{/*<li className="col-xs-12 col-sm-4 appmsg_item_v js_appmsgitem"> <Link to='coin/artwork/1'><Card /></Link></li>
		<li className="col-xs-12 col-sm-4 appmsg_item_v js_appmsgitem"> <Link to='coin/artwork/1'><Card /></Link></li>
		<li className="col-xs-12 col-sm-4 appmsg_item_v js_appmsgitem"> <Link to='coin/artwork/1'><Card /></Link></li>
		<li className="col-xs-12 col-sm-4 appmsg_item_v js_appmsgitem"> <Link to='coin/artwork/1'><Card /></Link></li>*/}
	</ul>
</div>
    )
}

export default class Page extends Component {
    static propTypes = {
        cpost: PropTypes.object.isRequired,
        retrievePosts: PropTypes.func.isRequired,
    }

    constructor (props) {
        super (props);
    }

    componentDidMount() {
        this.props.retrievePosts ();
    }

    componentWillUnmount() {
    }

    render () {
        //var { goBack, cuser, wxoauth } = this.props;
        var { cpost } = this.props;
        xdebug ("render:", cpost);
        return (
    <div>
      <nav className="navbar navbar-default navbar-fixed-top" style={{lineHeight: '50px', fontSize:24, backgroundColor:'#db3652', color:'#fff', whiteSpace:'nowrap'}}>
        <div className="container">
          <div style={{float:'left', boxSizing:'inner-box'}}><Link to='/coin/search'><span className="glyphicon glyphicon-search" style={{color:'#fff'}}></span></Link></div>
          <div style={{float:'left', paddingLeft: 50}}> <span>一元夺宝</span> </div>
          <div style={{float:'right', boxSizing:'inner-box'}}><Link to='/coin/message'><span className="glyphicon glyphicon-envelope" style={{color:'#fff'}}></span></Link></div>
        </div>
      </nav>
      <div style={{paddingTop: 55}}>
        <ArtworkList db={cpost.db} list={cpost.retrieve && cpost.retrieve.result} />
      </div>
    </div>
        );
    }
}

