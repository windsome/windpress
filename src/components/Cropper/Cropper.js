import React, { Component, PropTypes } from 'react'
import classes from './Cropper.scss'
import classNames from 'classnames';
import _ from 'lodash';

// Actions
const ACTION_EAST = 'e';
const ACTION_WEST = 'w';
const ACTION_SOUTH = 's';
const ACTION_NORTH = 'n';
const ACTION_SOUTH_EAST = 'se';
const ACTION_SOUTH_WEST = 'sw';
const ACTION_NORTH_EAST = 'ne';
const ACTION_NORTH_WEST = 'nw';


/*
<div class="cropper-container cropper-bg" style="width: 1350px; height: 400px;">
	<div class="cropper-wrap-box">
		<div class="cropper-canvas" style="width: 643.077px; height: 857.436px; left: 207.462px; top: -240.718px;">
			<img src="" style="width: 643.077px; height: 857.436px; margin-left: 0px; margin-top: 0px; transform: none;"/>
		</div>
	</div>
	<div class="cropper-drag-box cropper-modal cropper-move" data-action="move">
	</div>
	<div className="cropper-crop-box" style="width: 333px; height: 187.312px; left: 395px; top: 78.6875px;">
		<span className="cropper-view-box"><img src="" style="width: 643.077px; height: 857.436px; margin-left: -187.538px; margin-top: -319.405px; transform: none;"/></span>
		<span className="cropper-dashed dashed-h cropper-hidden"></span>
		<span className="cropper-dashed dashed-v cropper-hidden"></span>
		<span className="cropper-center"></span>
		<span className="cropper-face cropper-move" data-action="all"></span>
		<span className="cropper-line line-e" data-action="e"></span>
		<span className="cropper-line line-n" data-action="n"></span>
		<span className="cropper-line line-w" data-action="w"></span>
		<span className="cropper-line line-s" data-action="s"></span>
		<span className="cropper-point point-e" data-action="e"></span>
		<span className="cropper-point point-n" data-action="n"></span>
		<span className="cropper-point point-w" data-action="w"></span>
		<span className="cropper-point point-s" data-action="s"></span>
		<span className="cropper-point point-ne" data-action="ne"></span>
		<span className="cropper-point point-nw" data-action="nw"></span>
		<span className="cropper-point point-sw" data-action="sw"></span>
		<span className="cropper-point point-se" data-action="se"></span>
	</div>
</div>
*/

export class WorkBench extends Component {
    constructor (props) {
        super (props);
        this.state = {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            headerHeight: 50,
            hoeHeaderClass: null,
            hoeappContainerClass: null,
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render () {
        console.log ("WorkBench:", this.props);
        var imgsrc = this.props.src;
        var guides=this.props.guides;
        var benchSize=this.props.benchSize;
        var imgSize = this.props.imgSize;
        var imgPos = this.props.imgPos;
        var cropRect=this.props.cropRect;

        //var guides=true;
        //var benchSize={width: 1350, height: 400};
        //var imgSize = {width: 643.077, height: 857.436};
        //var cropRect={width: 333, height: 187.312, left: 395, top: 78.6875};

        //var imgCanvasPos = {left: 207.462, top: -240.718};
        //var imgCropPos = {marginLeft: -187.538, marginTop: -319.405}

        var imgCanvasStyle = {...imgSize, ...imgPos};
        var img1Style = {...imgSize, marginLeft: 0, marginTop: 0, transform: 'none'}
        var img2Style = {...imgSize, marginLeft: (imgPos.left-cropRect.left), marginTop: (imgPos.top-cropRect.top), transform: 'none'};

        return (
<div className="cropper-container cropper-bg" style={benchSize}>
	<div className="cropper-wrap-box">
		<div className="cropper-canvas" style={imgCanvasStyle}>
			<img src={imgsrc} style={img1Style}/>
		</div>
	</div>
	<div className="cropper-drag-box cropper-modal cropper-move" data-action="move"/>
	<div className="cropper-crop-box" style={cropRect}>
		<span className="cropper-view-box"><img src={imgsrc} style={img2Style}/></span>
		<span className={classNames("cropper-dashed dashed-h", {"cropper-hidden":!guides})}></span>
		<span className={classNames("cropper-dashed dashed-v", {"cropper-hidden":!guides})}></span>
		<span className="cropper-center"></span>
		<span className="cropper-face cropper-move" data-action="all"></span>
		<span className="cropper-line line-e" data-action="e"></span>
		<span className="cropper-line line-n" data-action="n"></span>
		<span className="cropper-line line-w" data-action="w"></span>
		<span className="cropper-line line-s" data-action="s"></span>
		<span className="cropper-point point-e" data-action="e"></span>
		<span className="cropper-point point-n" data-action="n"></span>
		<span className="cropper-point point-w" data-action="w"></span>
		<span className="cropper-point point-s" data-action="s"></span>
		<span className="cropper-point point-ne" data-action="ne"></span>
		<span className="cropper-point point-nw" data-action="nw"></span>
		<span className="cropper-point point-sw" data-action="sw"></span>
		<span className="cropper-point point-se" data-action="se"></span>
	</div>
</div>
        )
    }
}

export class Cropper extends Component {
    constructor (props) {
        super (props);
        this.state = {
            reset: true,
        };
        this.options = {...props.options};
    }

    componentDidMount() {
        console.log ("component did mount!");
        if (this.imageRef && this.imageRef.complete) {
            console.log ("componentDidMount: image already loaded!");
            this.imgLoadOk();
        }
    }

    componentWillUnmount() {
    }

    componentWillReceiveProps (nextProps) {
        console.log ("componentWillReceiveProps");
        const { src } = nextProps;
        if( src != this.props.src ) {
            console.log ("change image!");
            this.setState({reset: true});
        }
    }


    imgLoadOk () {
        console.log ("image load ok!");
        if (!this.state.reset) {
            console.log ("already init image.");
            return;
        }
        if (this.benchRef) {
            var benchSize1= {width:this.benchRef.clientWidth, height:this.benchRef.clientHeight};
            var benchSize= {width:this.benchRef.scrollWidth, height:this.benchRef.scrollHeight};
            var cropRect = {width: benchSize.width / 2, height: benchSize.height/2, left: benchSize.width/4, top: benchSize.height/4};
            //var cropRect = {width: benchSize.width / 2, height: benchSize.height/2, left: 0, top: 0};
            var imgPos = {left: 0, top: 0};
            var imgNaturalSize = {...benchSize};
            if (this.imageRef) {
                imgNaturalSize.width = this.imageRef.naturalWidth;
                imgNaturalSize.height = this.imageRef.naturalHeight;
            }
            var bodyRect = document.body.getBoundingClientRect();
            var benchRect = this.benchRef.getBoundingClientRect();
            benchRect = {left: benchRect.left-bodyRect.left, top: benchRect.top-bodyRect.top, width:benchRect.width, height: benchRect.height};
            console.log ("init:", {reset: false, benchSize, imgNaturalSize, imgSize:benchSize, imgPos, cropRect, benchRect});
            this.setState ({reset: false, benchSize, benchRect, imgNaturalSize, imgSize:benchSize, imgPos, cropRect});
        }
    }
    imgLoadFail () {
        console.log ("image load fail!");
    }

    onWheel (e) {
        if (this.state.reset) {
            return;
        }
        e.preventDefault();
        console.log ("onWheel:", e.deltaMode, e.deltaX, e.deltaY, e.deltaZ, e.wheelDelta, e.detail);
        
        let delta = 1;
        if (e.deltaY) {
            delta = e.deltaY > 0 ? 1 : -1;
        } else if (e.wheelDelta) {
            delta = -e.wheelDelta / 120;
        } else if (e.detail) {
            delta = e.detail > 0 ? 1 : -1;
        }
        console.log ("onWheel:", delta);
        let ratio = Number(this.options.wheelZoomRatio) || 0.1;
        ratio = -delta * ratio;
        if (ratio < 0) {
            ratio = 1 / (1 - ratio);
        } else {
            ratio = 1 + ratio;
        }
        
        let imgCenterPos = {left: (this.state.imgPos.left+this.state.imgSize.width/2), top: (this.state.imgPos.top+this.state.imgSize.height/2)};
        let aspectRatio = this.state.imgNaturalSize.width / this.state.imgNaturalSize.height;
        let imgSize = {width: this.state.imgSize.width*ratio, height: this.state.imgSize.width*ratio/aspectRatio};
        if (imgSize.width < 2)
            imgSize = {width: 2, height: 2/aspectRatio};
        let imgPos = {left: imgCenterPos.left-imgSize.width/2, top: imgCenterPos.top-imgSize.height/2}
        this.setState ({imgPos, imgSize});
    }

    cropStart (e) {
        //console.log ("cropStart:", e.target);
        var action = '';
        var name='action';
        var element = e.target;
        if (_.isObject(element[name])) {
            action = element[name];
        } else if (element.dataset) {
            action = element.dataset[name];
        } else 
            action = element.getAttribute("data-action");
        var benchRect = this.state.benchRect;
        var mousePos = {left: (e.pageX - benchRect.left), top: (e.pageY - benchRect.top)};
        this.setState({action, actionPos:mousePos});
        console.log ("cropStart action:", action, ",mousePos:", mousePos);
    }
    cropStop (e) {
        console.log ("cropStop:", e.target);
        this.setState({action: null});
        if (this.props.getCanvas) {
            var canvas = this.getCroppedCanvas ();
            this.props.getCanvas (canvas);
        }
    }
    cropMove (e) {
        if (!this.state.action) {
            return;
        }
        //console.log ("cropMove:", e, ",page:", e.pageX, e.pageY, ",client:", e.clientX, e.clientY, ",screen:", e.screenX, e.screenY);
        var benchRect = this.state.benchRect;
        var mousePos = {left: (e.pageX - benchRect.left), top: (e.pageY - benchRect.top)};
        var anchorPos = null;
        var cropRect = this.state.cropRect;
        switch (this.state.action) {
        case 'move':
            anchorPos = this.state.actionPos || {left: cropRect.left+cropRect.width/2, top: cropRect.top + cropRect.height/2}
            var deltaX = mousePos.left-anchorPos.left;
            var deltaY = mousePos.top - anchorPos.top;
            let imgPos = {left: this.state.imgPos.left+deltaX, top: this.state.imgPos.top+deltaY}
            this.setState ({imgPos, actionPos:mousePos});
            break;
        case 'zoom':
        case 'crop':
            break;
        case 'all':
            anchorPos = this.state.actionPos || {left: cropRect.left+cropRect.width/2, top: cropRect.top + cropRect.height/2}
            var deltaX = mousePos.left-anchorPos.left;
            var deltaY = mousePos.top - anchorPos.top;
            var destRect = {...cropRect, left: cropRect.left+deltaX, top: cropRect.top+deltaY};
            
            if (cropRect.left+deltaX < 0) destRect.left = 0;
            if (cropRect.left+cropRect.width+deltaX > this.state.benchSize.width) destRect.left = this.state.benchSize.width-cropRect.width;
            if (cropRect.top+deltaY < 0) destRect.top = 0;
            if (cropRect.top+cropRect.height+deltaY > this.state.benchSize.height) destRect.top = this.state.benchSize.height-cropRect.height;
            console.log ('all:', destRect);
            this.setState ({cropRect: destRect, actionPos:mousePos});
            break;
        case ACTION_EAST:
            anchorPos = {left: cropRect.left, top: cropRect.top + cropRect.height/2}
            if (mousePos.left-anchorPos.left <=0) {
                this.setState ({ action:ACTION_WEST, cropRect: {...cropRect, width:anchorPos.left-mousePos.left, left: mousePos.left} });
            } else {
                this.setState ({ cropRect: {...cropRect, width:mousePos.left - anchorPos.left} });
            }
            break;
        case ACTION_WEST:
            anchorPos = {left: cropRect.left+cropRect.width, top: cropRect.top + cropRect.height/2}
            if (anchorPos.left-mousePos.left <=0) {
                this.setState ({ action:ACTION_EAST, cropRect: {...cropRect, width:mousePos.left-anchorPos.left, left: anchorPos.left} });
            } else {
                this.setState ({ cropRect: {...cropRect, width:anchorPos.left - mousePos.left, left:mousePos.left} });
            }
            break;
        case ACTION_SOUTH:
            anchorPos = {left: cropRect.left+cropRect.width/2, top: cropRect.top}
            if (mousePos.top-anchorPos.top <=0) {
                this.setState ({ action:ACTION_NORTH, cropRect: {...cropRect, height:anchorPos.top-mousePos.top, top: mousePos.top} });
            } else {
                //console.log ("south actionPos:",this.state.actionPos, ",mouse:", mousePos, ", anchor:", anchorPos,", crop:", cropRect, ", dest: ",{...cropRect, height:mousePos.top - anchorPos.top}, ",bench:", benchRect);
                this.setState ({ cropRect: {...cropRect, height:mousePos.top - anchorPos.top} });
            }
            break;
        case ACTION_NORTH:
            anchorPos = {left: cropRect.left+cropRect.width/2, top: cropRect.top + cropRect.height}
            if (anchorPos.top-mousePos.top <=0) {
                this.setState ({ action:ACTION_SOUTH, cropRect: {...cropRect, height:mousePos.top-anchorPos.top, top: anchorPos.top} });
            } else {
                console.log ("north actionPos:",this.state.actionPos, ",mouse:", mousePos, ", anchor:", anchorPos,", crop:", cropRect, ", dest: ",{...cropRect, height:anchorPos.top - mousePos.top, top:mousePos.top}, ", bench:", benchRect);
                this.setState ({ cropRect: {...cropRect, height:anchorPos.top - mousePos.top, top:mousePos.top} });
            }
            break;
        case ACTION_SOUTH_EAST:
            anchorPos = {left: cropRect.left, top: cropRect.top}
            var nextRect = {...cropRect};
            var nextAction = ACTION_SOUTH_EAST;
            if (mousePos.top-anchorPos.top <=0) {
                nextRect = {...nextRect, height:anchorPos.top-mousePos.top, top: mousePos.top};
                nextAction = ACTION_NORTH_WEST;
            } else {
                nextRect = {...nextRect, height:mousePos.top - anchorPos.top};
            }
            if (mousePos.left-anchorPos.left <=0) {
                nextRect = {...nextRect, width:anchorPos.left-mousePos.left, left: mousePos.left};
                nextAction = ACTION_NORTH_WEST;
            } else {
                nextRect = {...nextRect, width:mousePos.left - anchorPos.left};
            }
            this.setState ({ cropRect: nextRect, action: nextAction });
            break;
        case ACTION_SOUTH_WEST:
            anchorPos = {left: cropRect.left+cropRect.width, top: cropRect.top}
            var nextRect = {...cropRect};
            var nextAction = ACTION_SOUTH_WEST;
            if (mousePos.top-anchorPos.top <=0) {
                nextRect = {...nextRect, height:anchorPos.top-mousePos.top, top: mousePos.top};
                nextAction = ACTION_NORTH_EAST;
            } else {
                nextRect = {...nextRect, height:mousePos.top - anchorPos.top};
            }
            if (anchorPos.left-mousePos.left <=0) {
                nextRect = {...nextRect, width:mousePos.left-anchorPos.left, left: anchorPos.left};
                nextAction = ACTION_NORTH_EAST;
            } else {
                nextRect = {...nextRect, width:anchorPos.left - mousePos.left, left:mousePos.left};
            }
            this.setState ({ cropRect: nextRect, action: nextAction });
            break;
        case ACTION_NORTH_EAST:
            anchorPos = {left: cropRect.left, top: cropRect.top+cropRect.height}
            var nextRect = {...cropRect};
            var nextAction = ACTION_SOUTH_WEST;
            if (mousePos.top-anchorPos.top <=0) {
                nextRect = {...nextRect, height:anchorPos.top-mousePos.top, top: mousePos.top};
                nextAction = ACTION_NORTH_EAST;
            } else {
                nextRect = {...nextRect, height:mousePos.top - anchorPos.top};
            }
            if (anchorPos.left-mousePos.left <=0) {
                nextRect = {...nextRect, width:mousePos.left-anchorPos.left, left: anchorPos.left};
                nextAction = ACTION_NORTH_EAST;
            } else {
                nextRect = {...nextRect, width:anchorPos.left - mousePos.left, left:mousePos.left};
            }
            this.setState ({ cropRect: nextRect, action: nextAction });
            break;
        case ACTION_NORTH_WEST:
            anchorPos = {left: cropRect.left+cropRect.width, top: cropRect.top+cropRect.height}
            var nextRect = {...cropRect};
            var nextAction = ACTION_SOUTH_EAST;
            if (mousePos.top-anchorPos.top <=0) {
                nextRect = {...nextRect, height:anchorPos.top-mousePos.top, top: mousePos.top};
                nextAction = ACTION_NORTH_WEST;
            } else {
                nextRect = {...nextRect, height:mousePos.top - anchorPos.top};
            }
            if (mousePos.left-anchorPos.left <=0) {
                nextRect = {...nextRect, width:anchorPos.left-mousePos.left, left: mousePos.left};
                nextAction = ACTION_NORTH_WEST;
            } else {
                nextRect = {...nextRect, width:mousePos.left - anchorPos.left};
            }
            this.setState ({ cropRect: nextRect, action: nextAction });
            break;
        }
    }

    getCroppedCanvas () {
        if (this.state.reset) {
            console.log ("getCroppedCanvas: not init!");
            return null;
        }

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = this.state.cropRect.width;
        canvas.height = this.state.cropRect.height;
        
        if (this.options.fillColor) {
            context.fillStyle = this.options.fillColor;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        var src = this.state.imgNaturalSize;
        var cropRect = this.state.cropRect;
        var imgPos = this.state.imgPos;
        var imgSize = this.state.imgSize;
        console.log ("getCroppedCanvas1:", this.imageRef, ", this.state:", this.state);
        console.log ("getCroppedCanvas2:", 0, 0, src.width, src.height, cropRect.left-imgPos.left, cropRect.top-imgPos.top, imgSize.width, imgSize.height);
        context.drawImage(this.imageRef, 0, 0, src.width, src.height, imgPos.left - cropRect.left, imgPos.top - cropRect.top, imgSize.width, imgSize.height);
        return canvas;
    }

    render () {
        var {src, children, history, location, params, route, routeParams, routes, getCanvas, ...otherProps} = this.props;
        return (
<div {...otherProps} ref={(v)=>{ console.log ("get div ref:", v); this.benchRef=v;} } onWheel={(e)=>this.onWheel(e)} onMouseDown={(e)=>this.cropStart(e)} onTouchStart={(e)=>this.cropStart(e)} onTouchEnd={(e)=>this.cropStop(e)} onTouchCancel={(e)=>this.cropStop(e)} onMouseUp={(e)=>this.cropStop(e)} onTouchMove={(e)=>this.cropMove(e)} onMouseMove={(e)=>this.cropMove(e)}>
    <img src={src} style={{width: '100%', opacity: 0.2, display:this.state.reset?'block':'none'}} onLoad={()=>this.imgLoadOk()} onError={()=>this.imgLoadFail()} ref={(v)=>{console.log("get img ref:", v); this.imageRef=v;} }/>

  {!this.state.reset && 
    <WorkBench src={src} guides={true} benchSize={this.state.benchSize} imgSize={this.state.imgSize} imgPos={this.state.imgPos} cropRect={this.state.cropRect} imgNaturalSize={this.state.imgNaturalSize}/>
  }
</div>
        )
    }
}

Cropper.propTypes = {
//  children: React.PropTypes.element.isRequired
}


export default Cropper

