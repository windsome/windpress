import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import _ from 'lodash';
import classes from './styles.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);
import FileInput from 'components/Wordpress/FileUploader';
import { imageFileScale, imageFileScale2, imageFileScaleWrapper, imageFileListScale } from 'utils/imageScale';
import { hash$UploadFile, hash$UploadDataURLs } from 'utils/upload';
import dataURL2Blob from 'utils/dataURL2Blob';

var xdebug = window.myDebug('COIN:ArtworkEditor');

const isEmpty = (obj) => {
    if (!_.isObject (obj)) return false;
    if (_.isEmpty (obj)) return true;
    var vals = _.values(obj);
    return vals.reduce ((result, current) => {
        if (current) return false;
        else return result;
    }, true);
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
        var image = this.props.images && this.props.images[current] || {desc:'No image', src:'/images/none.jpg'};
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
        cpost: PropTypes.object.isRequired,
        editor: PropTypes.object.isRequired,

        goBack: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
        retrievePosts: PropTypes.func.isRequired,
        createPost: PropTypes.func.isRequired,
        updatePost: PropTypes.func.isRequired,
        setPostEditor: PropTypes.func.isRequired,
        updatePostEditor: PropTypes.func.isRequired,
    }

    constructor (props) {
        super (props);
        this.state = {
            images: [],
            imageMessages: ['　', '点击左边 + 添加图片'],
            uploaded: [],
        }
    }
    
    componentDidMount() {
        var { params, cpost, editor, retrievePosts, setPostEditor } = this.props;
        var postId = params && params.id;
        if (postId) {
            xdebug ("need to edit post="+postId);
            var post = cpost && cpost.db && cpost.db[postId];
            if (post) {
                xdebug ("find this post in cache!");
                setPostEditor (post);
            } else {
                xdebug ("not find this post in cache, retrieve post="+postId);
                retrievePosts (postId).then (result => {
                    var post2 = result && result.db && result.db[postId];
                    if (post2) {
                        xdebug ("retrieve ok! post="+postId);
                        setPostEditor (post2);
                    } else {
                        xdebug ("error! not retrieve post="+postId+", switch to create mode!");
                    }
                }).catch(error => {
                    xdebug ("error! componentDidMount, retrievePosts fail! post="+postId);
                });
            }
        } else {
            xdebug ("need to create new post!");
            setPostEditor ({});
        }
    }

    uploadFile (evt) {
        //var ret = imageFileListScale (evt.target.files, {maxWidth:800, maxHeight: 800, keepRatio:true}).then ((ret1) => {
        var ret = imageFileListScale (evt.target.files).then ((ret1) => {
            xdebug ("uploadFile in callback:", ret1);
            this.setState ({images:this.state.images.concat(ret1)})
            var blob = dataURL2Blob (ret1[0].dataURL);
            xdebug ("blob:", blob);
            hash$UploadFile (blob, {filename: ret1[0].filename});
        });
        xdebug ("uploadFile:", ret);
    }

    uploadFile2 (evt) {
        var {updatePostEditor, editor} = this.props;
        var msg = null;
        var ret = imageFileListScale (evt.target.files, {maxWidth:800, maxHeight: 800, keepRatio:true, onProgress: (percent => {
            xdebug ("scale progress:", percent);
            msg = "压缩进度："+Math.floor(percent)+"%";
            this.setState ({imageMessages: [...this.state.imageMessages, msg]});
        })})
        //var ret = imageFileListScale (evt.target.files)
            .then ((ret1) => {
                xdebug ("scaled images:"+(ret1 && ret1.length));
                msg = "已压缩"+(ret1 && ret1.length || 0)+"张";
                this.setState ({images:this.state.images.concat(ret1), imageMessages: [...this.state.imageMessages, msg]});
                return hash$UploadDataURLs (ret1, { hashProgress: (percent)=> {
                    xdebug ("hash progress:", percent);
                    msg = "计算哈希值进度："+Math.floor(percent)+"%";
                    this.setState ({imageMessages: [...this.state.imageMessages, msg]});
                }, uploadProgress: (percent)=> {
                    xdebug ("upload progress:", percent);
                    msg = "上传进度："+Math.floor(percent)+"%";
                    this.setState ({imageMessages: [...this.state.imageMessages, msg]});
                } });
            } )
            .then ( (ret2) => {
                xdebug ("uploaded images:"+(ret2 && ret2.length));
                msg = "已上传"+(ret2 && ret2.length || 0)+"张";
                var images = ret2 && ret2.map ((item)=>{
                    return item.url;
                });
                this.setState ({imageMessages: [...this.state.imageMessages, msg], uploaded: this.state.uploaded.concat(images)})
            } )
            .catch(error => {
                xdebug ("error! uploadFile2 fail: ", error.message);
            });
        //xdebug ("uploadFile:", ret);
    }

    saveOrUpdate (evt) {
        evt.preventDefault ();
        var {createPost, updatePost, retrievePosts, setPostEditor, editor, replace} = this.props;
        var postId = editor.id;
        var images = (editor && editor.images || []).concat(this.state.uploaded);
        if (postId) {
            updatePost({...editor, images}).then (ret => {
                retrievePosts (postId).then ( ret2 => {
                    var post2 = ret2 && ret2.db && ret2.db[postId];
                    if (post2) {
                        xdebug ("retrieve ok! post="+postId);
                        setPostEditor (post2);
                    } else {
                        xdebug ("error! not retrieve post="+postId+", switch to create mode!");
                    }
                });
            });
        } else {
            createPost({...editor, images}).then (post => {
                if (post) {
                    replace ('/coin/myown');
                    //setPostEditor (post);
                } else {
                    xdebug ("create post fail!");
                }
            });
        }
    }

    render () {
        var {goBack, params, cpost, editor, updatePostEditor} = this.props;
        var postId = params && params.id;
        
        var dataURLs = this.state.images.map ((item) => {
            return {src: item.dataURL}
        });
        var uploaded = (editor.images || []).map (url => {
            return {src: url}
        });
        var imageList = uploaded.concat (dataURLs);
        xdebug ("dataURLs:"+dataURLs.length+", uploaded:"+uploaded.length+", toShow:"+imageList.length);

        var msgList = this.state.imageMessages && this.state.imageMessages.slice(-4).map ((msg, index) => {
            return (
                <p key={index}>{msg}</p>
            )
        })

        var postChanged = !!(this.state.images && (this.state.images.length > 0));
        var submiting  = false;
        var error = null;
        var result = null;
        if (postId) {
            submiting = cpost && cpost.update && cpost.update.fetching;
            error = cpost && cpost.update && cpost.update.error;
            result = cpost && cpost.update && cpost.update.result;
            var oldPost = postId && cpost && cpost.db && cpost.db[postId];
            if (!_.isEqual(oldPost, editor)) postChanged = true;
            xdebug ("postChanged:", postChanged, ", oldPost=", oldPost, ", editor=", editor);
        } else {
            submiting = cpost && cpost.create && cpost.create.fetching;
            error = cpost && cpost.create && cpost.create.error;
            result = cpost && cpost.create && cpost.create.result;
            if (!isEmpty(editor)) postChanged = true;
        }

        var disabled = {};
        var btnMsg = "提交";
        if (!postChanged || submiting) {
            disabled = {disabled: 'disabled'};
            if (submiting) {
                btnMsg = "正在提交";
            } else if (!postChanged) {
                btnMsg = "请先填写内容";
            }
        }

        var infoMsg = "";
        if (error) {
            infoMsg = "错误："+error.message;
        } else if (result) {
            if (postId) {
                infoMsg = '结果：更新成功，编号为：'+postId;
            } else {
                infoMsg = '结果：创建成功，编号为：'+result;
            }
        }
        xdebug ("postId="+postId+", error="+(error && JSON.stringify(error) ||'')+", result="+(result && JSON.stringify(result) || ''));

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

      {/*<ImageSlide images={[{desc:'art1', src:'/images/art1.jpg'}, {desc:'art2', src:'/images/art2.jpg'}]}/>*/}
      <ImageSlide images={imageList}/>

      <div className="container">
        <div className="row">

          <div className="col-xs-12" style={{marginTop:10}}>
             <div style={{float: 'left'}}><FileInput accept="*.bin" addFile={this.uploadFile2.bind(this)}/></div>
             <div style={{float: 'left'}}>
                 {msgList}
             </div>
          </div>

          <div className="col-xs-12" style={{marginTop:10}}>
            <div className="input-group">
              <span className="input-group-addon" id="basic-addon1"></span>
              <textarea className="form-control" rows="3" placeholder="请输入艺术品名称" aria-describedby="basic-addon1" id="name" onChange={ (evt) => updatePostEditor({ desc: { name: evt.target.value } }) } value={editor && editor.desc && editor.desc.name || ''}></textarea>
            </div>
          </div>

          <div className="col-xs-12" style={{marginTop:10}}>
            <div className="input-group">
              <span className="input-group-addon"></span>
              <input type="text" className="form-control" placeholder="每一注几元(数字1,10)" aria-label="Amount (to the nearest dollar)" id="price" onChange={(evt) => updatePostEditor({ unit:parseInt(evt.target.value) }) } value={editor.unit||''}/>
              <span className="input-group-addon">元</span>
            </div>
          </div>

          <div className="col-xs-12" style={{marginTop:10}}>
            <div className="input-group">
              <span className="input-group-addon"></span>
              <input type="text" className="form-control" placeholder="共多少注（数字）" aria-label="Amount (to the nearest dollar)" id="price" onChange={(evt) => updatePostEditor({count: parseInt(evt.target.value)}) }value={editor.count||''}/>
              <span className="input-group-addon">注</span>
            </div>
          </div>

          <div className="col-xs-12" style={{marginTop:10}}>
            <div className="input-group">
              <span>总价为<b style={{color:'#db3652'}}>{editor.unit && editor.count && (editor.unit * editor.count) || '---'}</b>元</span>
            </div>
          </div>

          { infoMsg &&
          <div className="col-xs-12" style={{marginTop:10}}>
            <div className="input-group">
              <span>{infoMsg}</span>
            </div>
          </div>
          }

          <div className="col-xs-12" style={{marginTop:10}}>
            <button type="button" className="btn btn-primary btn-lg btn-block" onClick={evt => this.saveOrUpdate(evt)} {...disabled}>{btnMsg}</button>
          </div>

        </div>
      </div>
    </div>
        );
    }
}

