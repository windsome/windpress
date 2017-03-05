import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import _ from 'lodash';
var xdebug = window.myDebug('COIN:ArtworkDetail');

export default class Page extends Component {
    static propTypes = {
        cpost: PropTypes.object.isRequired,
        goBack: PropTypes.func.isRequired,
        retrievePosts: PropTypes.func.isRequired,
    }

    componentDidMount() {
        var { params, cpost, retrievePosts } = this.props;
        if (params && params.id) {
            if (cpost && cpost.db && cpost.db[params.id]) {
                xdebug ("already have this post, no need to retrieve again!");
            } else 
                retrievePosts (params.id);
        }
    }

    componentWillUnmount() {
    }

    render () {
        var {goBack, cpost, params} = this.props;
        var postId = params && params.id;
        var post = cpost && cpost.db && cpost.db[postId];
        var images = post && post.images || ['/images/none.jpg'];
        var imgList = images && images.map ((item, index)=>{
            return (
		                <li key={index}><img src={ item } className='img-responsive' alt={'none'}/></li>
            )
        });

        return (
    <div style={{paddingTop: 50, paddingBottom: 50}}>
      <nav className="navbar navbar-default navbar-fixed-top" style={{backgroundColor:'#fff', color:'#000', lineHeight:'50px', fontSize:'20px'}}>
        <div className="container">
          <Link to="/coin/artwork/1" onClick={(e)=>{e.preventDefault(); goBack && goBack();} }>
            <i className="glyphicon glyphicon-menu-left" style={{top:5, paddingRight:20}}/>
          </Link>
          <span>图文详情-一元艺术夺宝</span>
        </div>
      </nav>

      <div className="container">
        <div className="row text-center">
         	<ul className="col-xs-12" style={{listStyle:'none'}}>
            {imgList}
      	  </ul>
        </div>
      </div>
    </div>
        );
    }
}

