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
        goBack: PropTypes.func.isRequired,
    }

    constructor (props) {
        super (props);
        this.state = {
            images:[],
            uploaded: [],
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
        var ret = imageFileListScale (evt.target.files, {maxWidth:800, maxHeight: 800, keepRatio:true})
        //var ret = imageFileListScale (evt.target.files)
            .then ((ret1) => {
                xdebug ("uploadFile in callback:", ret1);
                this.setState ({images:this.state.images.concat(ret1)})
                return hash$UploadDataURLs (ret1, { onProgress: (percent)=> {
                    xdebug ("uploadFile2:", percent);
                } });
            } )
            .then ( (ret2) => {
                xdebug ("ret2:", ret2);
                this.setState ({uploaded: this.state.uploaded.concat(ret2)});
            } );
        //xdebug ("uploadFile:", ret);
    }

    setPrice (evt) {
        var value = evt.target.value;
        var intVal = parseInt(value);
        if (_.isNaN(intVal))
            intVal = null;
        this.setState({price:intVal})
    }

    setUnit (evt) {
        var value = evt.target.value;
        var intVal = parseInt(value);
        if (_.isNaN(intVal))
            intVal = null;
        this.setState({unit:intVal})
    }

    setCount (evt) {
        var value = evt.target.value;
        var intVal = parseInt(value);
        if (_.isNaN(intVal))
            intVal = null;
        this.setState({count:intVal})
    }

    createArtwork () {
        var images = this.state.uploaded && this.state.uploaded.map ((item)=>{
            return item.url;
        });
        var item = { 
            status:0, owner: 2, 
            unit: this.state.unit, 
            count: this.state.count, 
            images: images,
            desc: {
                name: this.state.name
            },
        }
        var {createPost} = this.props;
        createPost(item);
    }

    render () {
        var {goBack, cpost} = this.props;
        var images = this.state.images.map ((item) => {
            return {src: item.dataURL}
        });

        var creating = cpost && cpost.create && cpost.create.fetching;
        var submitStyle = {cursor: 'pointer'};
        if (creating) submitStyle = {cursor: 'wait', backgroundColor:'#ccc'};

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
      <ImageSlide images={images}/>

      <div className="container">
        <div className="row">

          <div className="col-xs-12" style={{marginTop:10}}>
             <div><FileInput accept="*.bin" addFile={this.uploadFile2.bind(this)}/></div>
          </div>

          <div className="col-xs-12" style={{marginTop:10}}>
            <div className="input-group">
              <span className="input-group-addon" id="basic-addon1"></span>
              <textarea className="form-control" rows="3" placeholder="请输入艺术品名称" aria-describedby="basic-addon1" id="name" onChange={(e) => {this.setState({name: e.target.value})}} value={this.state.name}></textarea>
              {/*<input type="text" className="form-control" placeholder="请输入艺术品名称" aria-describedby="basic-addon1" id="name" onChange={(e) => {this.setState({name: e.target.value})}} value={this.state.name}/>*/}
            </div>
          </div>

          <div className="col-xs-12" style={{marginTop:10}}>
            <div className="input-group">
              <span className="input-group-addon"></span>
              <input type="text" className="form-control" placeholder="每一注几元(数字1,10)" aria-label="Amount (to the nearest dollar)" id="price" onChange={this.setUnit.bind(this)} value={this.state.unit||''}/>
              <span className="input-group-addon">元</span>
            </div>
          </div>

          <div className="col-xs-12" style={{marginTop:10}}>
            <div className="input-group">
              <span className="input-group-addon"></span>
              <input type="text" className="form-control" placeholder="共多少注（数字）" aria-label="Amount (to the nearest dollar)" id="price" onChange={this.setCount.bind(this)} value={this.state.count||''}/>
              <span className="input-group-addon">注</span>
            </div>
          </div>

          <div className="col-xs-12" style={{marginTop:10}}>
            <div className="input-group">
              <span>总价为<b style={{color:'#db3652'}}>{this.state.unit && this.state.count && (this.state.unit * this.state.count) || '---'}</b>元</span>
            </div>
          </div>

          <div className="col-xs-12" style={{marginTop:10}}>
            <div style={{backgroundColor:'#db3652', color:'#fff', textAlign:'center', fontSize:20, padding:5, ...submitStyle}} onClick={this.createArtwork.bind(this)}>
              <span>提交</span>
            </div>
          </div>

        </div>
      </div>
    </div>
        );
    }
}

