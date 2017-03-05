import React from 'react'
import styles from './Styles.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const MIME_TYPE_IMGS = "image/jpg,image/jpeg,image/png,image/gif";
const MIME_TYPE_BINS = "*.bin,*.hex";

export const FileInput = (props) => (
<div className="weui_uploader_input_wrp">
  <input id={props.id || 'file'} name={props.name || 'file'} className="weui_uploader_input" type="file" accept={props.accept || "image/*"} onChange={props.addFile} multiple/>
</div>
)
FileInput.propTypes = {
    accept: React.PropTypes.string,
    addFile: React.PropTypes.func
}

export default FileInput;
