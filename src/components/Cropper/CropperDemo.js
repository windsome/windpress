import React, { Component, PropTypes } from 'react'
import Cropper from './Cropper'

export class CropperDemo extends Component {
    constructor (props) {
        super (props);
        this.state = {
            canvas:null
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render2 () {
        return (
<div style={{padding:20}}>
  <Cropper src="/images/1.jpg" style={{maxWidth: 640, padding: '20px auto'}}/>
</div>
        )
    }
    render () {
        var dataurl = this.state.canvas && this.state.canvas.toDataURL();
        //console.log ("canvas:", this.state.canvas, ", dataurl:", dataurl);
        return (
<div>
  <Cropper src="/images/1.jpg" style={{maxWidth: 640, float:'left'}} getCanvas={(e)=>this.setState({canvas:e})}/>
  <div style={{width:400, float:'left'}}><img src={dataurl}/></div>
</div>
        )
    }
}


export default CropperDemo

