import React from 'react'
//import classes from './Widgets.scss'
//import classNames from 'classnames';
import styles from './ImageUploader.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/*
const PreviewImage = (props) => (
<div className={cx('previewImageContainer')}>
  <img src={ props.src } className={ cx('responsive-imgwh') } alt={props.alt}/>
  <div className={cx('imgRemove')}/>
</div>
)
*/
const PreviewImage = (props) => (
<div className={cx('weui_uploader_file')}>
  { !props.src &&
  <div className={ cx('weui_uploader_file_alt') }> {props.alt} </div>
  }
  <div className={ cx('weui_uploader_image_outer') }><img src={ props.src } className={ cx('responsive-imgwh') }/></div>
  <div className={cx('imgRemove')} onClick={props.removeImage}/>
</div>
)

const FileInput = (props) => (
<div className={cx('weui_uploader_input_wrp')}>
  <input id={props.id || 'file'} name={props.name || 'file'} className={cx('weui_uploader_input')} type="file" accept="image/jpg,image/jpeg,image/png,image/gif" onChange={props.addImage} multiple/>
</div>
)

const ImageUploader = (props) => {
    var data = props.data;
    var imgs = props.info && props.info.map( (image, index) => {
        return <PreviewImage key={index} src={data[image.filename] || ''} alt={image.filename} removeImage={ ()=>{props.removeImage(image)} } />
    });
    return (
<div>
  { imgs }
  <FileInput name='file' id='file' addImage={props.addImage}/>
</div>
)
}

ImageUploader.propTypes = {
    addImage: React.PropTypes.func,
    removeImage: React.PropTypes.func,
    info: React.PropTypes.array,
    data: React.PropTypes.object,
}

export default ImageUploader
