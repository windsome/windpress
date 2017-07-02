var xdebug = window.myDebug('COIN:ArtworkList')
import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import ReactModal from 'react-modal';
import _ from 'lodash';
import moment from 'moment';
//import classNames from 'classnames';
import styles2 from './styles.scss';
import styles from 'components/widgets/Widgets.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
import {utilPostStatusToString} from '../modules/utils';
import { userHasCap } from '../common';
ReactModal.setAppElement('#root');

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
    var ops = art.ops;
    //xdebug ("art:", art);
    var id = art && art.id || 0;
    var userId = art && art.userId || 0;
    var name = art && art.desc && art.desc.name || '未命名艺术作品';
    var createdAt = art && moment(new Date(art.createdAt)).format('YYYY-MM-DD HH:mm') || '　';
    var excerpt = art && art.desc && art.desc.excerpt || '无摘要艺术作品';
    var images = art && art.images || ['/images/none.jpg'];
    var statusString = utilPostStatusToString (art.status);
    var viewUrl = '/coin/shop/'+userId+'/'+id;
    return (
  <div className="clearfix" style={{marginTop:5, marginBottom:5, paddingBottom:5, backgroundColor:'#f6f6f6'}}>
    <div className={ cx('imageContainer') }>
      <Link className={ cx('media-photo', 'media-cover') } to={ viewUrl }>
        <div className={ cx('listing-img-container','media-cover','text-center') }>
          <img src={ images[0] } className={ cx('responsive-imgwh') } alt={excerpt}/>
        </div>
      </Link>
    </div>
    <div className={cx('infoContainer')}>
        <Link className={cx('linkContainer')} to={ viewUrl }>
          <Progress total={art.count} current={art.paid}/>
          <div>
            <div className={cx('text_size_small_weight_light_inline')}>
              <div className={cx('detailContainer')} style={{textOverflow: 'ellipsis',overflow: 'hidden'}}>{"编号"+id+" "+name }</div>
            </div>
          </div>
        </Link>
        <div>
          <div className={cx('text_size_small_weight_light_inline')} style={{float:'left'}}>
            <div className={cx('detailContainer')} style={{textOverflow: 'ellipsis',overflow: 'hidden'}}><sub>{ statusString+" "+createdAt }</sub></div>
          </div>
          { ops && ops.opEdit &&
          <Link onClick={(e)=>{ops.opEdit(e, id)}} to={ '/coin/edit/'+id } style={{marginLeft:5, marginRight:5}}>
            <span>编辑</span>
          </Link>
          }
          { ops && ops.opDelete &&
          <Link onClick={(e)=>{ops.opDelete(e, id)}} style={{marginLeft:5, marginRight:5}}>
            <span>删除</span>
          </Link>
          }
          { ops && ops.opCheckRequest &&
          <Link onClick={(e)=>{ops.opCheckRequest(e, id)}} style={{marginLeft:5, marginRight:5}}>
            <span>提交审核</span>
          </Link>
          }
          { ops && ops.opCheckFail &&
          <Link onClick={(e)=>{ops.opCheckFail(e, id)}} style={{marginLeft:5, marginRight:5}}>
            <span>退回修改</span>
          </Link>
          }
          { ops && ops.opPublish &&
          <Link onClick={(e)=>{ops.opPublish(e, id)}} style={{marginLeft:5, marginRight:5}}>
            <span>发布</span>
          </Link>
          }
          { ops && ops.opSetFavor &&
          <Link onClick={(e)=>{ops.opSetFavor(e, id)}} style={{marginLeft:5, marginRight:5}}>
            <span>推荐</span>
          </Link>
          }
          { ops && ops.opUnsetFavor &&
          <Link onClick={(e)=>{ops.opUnsetFavor(e, id)}} style={{marginLeft:5, marginRight:5}}>
            <span>取消推荐</span>
          </Link>
          }
          { ops && ops.opRefund &&
          <Link onClick={(e)=>{ops.opRefund(e, id)}} style={{marginLeft:5, marginRight:5}}>
            <span>退款</span>
          </Link>
          }
        </div>
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
    没有上传宝贝，返回发布一个
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
        retrievePosts: PropTypes.func.isRequired,
        removePost: PropTypes.func.isRequired,
        updatePost: PropTypes.func.isRequired,
        refundPost: PropTypes.func.isRequired,
        retrieveSomePosts: PropTypes.func.isRequired,

        pageName: PropTypes.string.isRequired,
        postStatus: PropTypes.object.isRequired,
        postDb: PropTypes.object.isRequired,
        refund: PropTypes.object.isRequired,
        cuser: PropTypes.object.isRequired,
    }

    constructor (props) {
        super (props);
        this.state = {
            modalIsOpen: false,
            modalMessage: '',
            modalFunc: null,
        }

    }

    componentDidMount() {
        this.props.retrievePosts ();
    }

    deletePost (id) {
        var { removePost, retrievePosts } = this.props;
        this.setState({modalIsOpen:false, modalMessage:null, modalFunc:null});
        if (id) {
            removePost && removePost (id).then ((retobj)=> {
                if (retobj && retobj.count > 0) {
                    xdebug ("delete ok! refresh post list!");
                    retrievePosts && retrievePosts ();
                } else {
                    xdebug ("delete fail!");
                }
            })
        }
    }
    
    updatePostStatus (id, status) {
        var { updatePost, retrievePosts, retrieveSomePosts } = this.props;
        this.setState({modalIsOpen:false, modalMessage:null, modalFunc:null});
        if (id) {
            updatePost && updatePost ({id, status}).then ((retobj)=> {
                if (retobj && retobj.count > 0) {
                    xdebug ("delete ok! refresh post list!");
                    retrieveSomePosts && retrieveSomePosts ([id]);
                } else {
                    xdebug ("delete fail!");
                }
            })
        }
    }
    updatePostFavor (id, favor) {
        var { updatePost, retrievePosts, retrieveSomePosts } = this.props;
        this.setState({modalIsOpen:false, modalMessage:null, modalFunc:null});
        if (id) {
            updatePost && updatePost ({id, favor}).then ((retobj)=> {
                if (retobj && retobj.count > 0) {
                    xdebug ("delete ok! refresh post list!");
                    retrieveSomePosts && retrieveSomePosts ([id]);
                } else {
                    xdebug ("delete fail!");
                }
            })
        }
    }
    refundOnePost (id) {
        var { refundPost, retrieveSomePosts } = this.props;
        this.setState({modalIsOpen:false, modalMessage:null, modalFunc:null});
        if (id) {
            refundPost && refundPost (id).then ((retobj)=> {
                if (retobj && retobj.count > 0) {
                    xdebug ("refund ok! refresh post list!");
                    retrieveSomePosts && retrieveSomePosts ([id]);
                } else {
                    xdebug ("refund fail!", retobj);
                }
            })
        }
    }
    render () {
        var { goBack, push, replace, retrievePosts, postDb, postStatus, pageName, cuser } = this.props;
        var userId = cuser && cuser.user && cuser.user.id;
        var postList = postStatus && postStatus.result || [];
        xdebug ("render:", this.props);
        var isRoot = userHasCap (cuser.user, 'ROOT');
        var canPostFavor = userHasCap (cuser.user, 'POST_FAVOR');
        var canPublish = userHasCap (cuser.user, 'SHOP_AGENT');
        var canPostPublish = userHasCap (cuser.user, 'POST_PUBLISH');
        var canPostRefund = userHasCap (cuser.user, 'POST_REFUND');

        var total = postStatus && postStatus.total || 0;
        var count = postStatus && postStatus.result && postStatus.result.length || 0;
        var page = postStatus && postStatus.page || 0;
        const retriveRefresh = () => {
            retrievePosts (0);
        }
        const retriveMore = () => {
            retrievePosts (page+1);
        }

        var isFetching = postStatus && postStatus.fetching;
        var message = postStatus && postStatus.error && postStatus.error.message;
        if (isFetching) message = "正在加载中。。。";

        var opEdit = (evt, id) => {
            evt.preventDefault();
            push ('/coin/edit/'+id);
        };

        var opDelete = (evt, id) => {
            evt.preventDefault();
            this.setState({modalIsOpen:true, modalMessage: '确定要删除吗？', modalFunc: ()=>this.deletePost(id)});
        };

        var opCheckRequest = (evt, id) => {
            evt.preventDefault();
            this.setState({modalIsOpen:true, modalMessage: '确定要提交审核吗？', modalFunc: ()=>this.updatePostStatus(id,1)});
        };

        var opCheckFail = (evt, id) => {
            evt.preventDefault();
            this.setState({modalIsOpen:true, modalMessage: '确定要打回修改吗？', modalFunc: ()=>this.updatePostStatus(id,3)});
        };

        var opPublish = (evt, id) => {
            evt.preventDefault();
            this.setState({modalIsOpen:true, modalMessage: '确定要发布吗？', modalFunc: ()=>this.updatePostStatus(id,2)});
        };
        var opSetFavor = (evt, id) => {
            evt.preventDefault();
            this.setState({modalIsOpen:true, modalMessage: '确定要推荐吗？', modalFunc: ()=>this.updatePostFavor(id,1)});
        };
        var opUnsetFavor = (evt, id) => {
            evt.preventDefault();
            this.setState({modalIsOpen:true, modalMessage: '确定要取消推荐吗？', modalFunc: ()=>this.updatePostFavor(id,0)});
        };
        var opRefund = (evt, id) => {
            evt.preventDefault();
            this.setState({modalIsOpen:true, modalMessage: '确定要退款吗？', modalFunc: ()=>this.refundOnePost(id)});
        };

        var handleCloseModal = () => {
            this.setState({modalIsOpen:false, modalMessage:null, modalFunc:null});
        }

        var artworks = postList && postList.map ((id, index)=>{
            var artwork = postDb && postDb[id];
            var status = artwork.status;
            var favor = artwork.favor;
            var isOwner = artwork.owner == userId;

            var ops = {};
            switch (status) {
            case 0:
            case 3:
                if (isRoot) {
                    if (isOwner)
                        ops = {opEdit, opDelete, opPublish};
                    else
                        ops = {opEdit, opDelete, opCheckFail, opPublish};
                } else if (isOwner) {
                    if (canPublish) {
                        ops = {opEdit, opDelete, opPublish};
                    } else {
                        ops = {opEdit, opDelete, opCheckRequest};
                    }
                }
                break;
            case 1:
                if (isRoot) {
                    ops = { opCheckFail, opPublish };
                } else if (isOwner) {
                    if (canPublish) {
                        ops = { opCheckFail, opPublish };
                    }
                }
                break;
            case 2:
                if (canPostFavor) {
                    if (favor == 1)
                        ops = { ...ops, opUnsetFavor };
                    else
                        ops = { ...ops, opSetFavor };
                }
                break;
            case 4:
            case 5:
            case 6:
                ops = { opRefund };
                break;
            case 7:
                break;
            }
            artwork.ops = ops;
            return artwork;
        });

        return (
    <div style={{paddingTop:50}}>
      <nav className="navbar navbar-default navbar-fixed-top" style={{lineHeight:'50px', fontSize:20, backgroundColor:'#db3652', color:'#fff', whiteSpace:'nowrap'}}>
        <div style={{float:'left', marginLeft:5, boxSizing:'inline-block'}}><Link to="/coin" onClick={(e)=>{e.preventDefault(); goBack && goBack();} }>
          <i className="glyphicon glyphicon-menu-left img-circle" style={{top:5, color:'#ddd', opacity:1, backgroundColor:'#333', padding:5}}/>
        </Link></div>
        <div style={{float:'left', paddingLeft: 50}}> <span>{pageName}</span> </div>
      </nav>
      <div>
        {message}
      </div>
      <div>
        { (count != 0) &&
        <div style={{marginTop:10, textAlign:'center'}} onClick={retriveRefresh}>点此可刷新</div>
        }
        <ArtworkList items={artworks}/>
        { count < total &&
        <div style={{marginTop:10, textAlign:'center'}} onClick={retriveMore}>点此加载更多...</div>
        }
      </div>

      <ReactModal isOpen={this.state.modalIsOpen}
            contentLabel="对话框"
            onRequestClose={handleCloseModal}>
          <div className="modal-content"  style={{zIndex:1000}}>
            <div className="modal-header">
              <button type="button" className="close" onClick={handleCloseModal}>
                <span aria-hidden="true">&times;</span>
                <span className="sr-only">Close</span>
              </button>
              <h5 className="modal-title">确认您的操作！</h5>
            </div>

            <div className="modal-body container" style={{textAlign: 'center'}}>
              <h4>{this.state.modalMessage || '错误操作！'}</h4>
            </div>
            <div className="modal-footer">
              <div style={{backgroundColor:'#db3652', color:'#fff', textAlign:'center', fontSize:20, padding:5}} onClick={this.state.modalFunc}>
                <span>确定</span>
              </div>
            </div>

          </div>
      </ReactModal>

    </div>
        );
    }
}

