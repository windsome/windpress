/**
 * @file   FileExplorer.js
 * @author windsome.feng <86643838@163.com>
 * @date   Fri Jan  6 15:42:54 2017
 * 
 * @brief  create a file explorer to browse folders and files.
 * <FileExplorer folders=[] files=[] path=[folderRoot/folderLevel2/...] 
 *     selectFolder selectFile createFolder deleteFolder deleteFile moveFolder moveFile 
 *     editFolder editFile />
 * 
 * Folder: { name: 'upgrade', id: 101, desc: 'contain upgrade files', 
 *           parent: 10 }
 * File: { name: 'image1.png', id: 202, desc: 'yellow mountain',
 *         path: '8EB077026D788466D0FFD57A972D15F9.191433.image1.png',
 *         folder: 101, mimetype: 'image/png' }
 */

import React, { Component, PropTypes } from 'react'
import _ from 'lodash';
import classes from './FileExplorer.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

export class CreateFolderPopup extends Component {
    constructor (props) {
        super (props);
        this.state = {
            folderName: ''
        };
    }

    render() {
        const createFolder = () => {
            this.props.createFolder && this.props.createFolder(this.props.currentFolder, this.state.folderName);
            console.log ("what's wrong?"); 
            this.setState({folderName:''});
        }
        return (
  <div className="dropdown-menu" onClick={ (e) => e.stopPropagation() }>
    <input type="text" id="folderName" name="folderName" value={this.state.folderName} placeholder="input new folder name..." onChange={(e) => this.setState({folderName: e.target.value}) }/>
    <div><button type="button" className="btn btn-primary" onClick={createFolder }>创建</button></div>
  </div>
        )
    }
}
CreateFolderPopup.propTypes = {
    currentFolder: React.PropTypes.object,
    createFolder: React.PropTypes.func,
}



export default class FileExplorer extends Component {
    constructor (props) {
        super (props);
        this.state = {
            listStyle: 'th-list',
        };
    }

    render() {
        const { path, folders, files, selectFolder, createFolder, selectFile, deleteFolder, deleteFile, moveFolder, moveFile, editFolder, editFile } = this.props;

        //console.log ("FileExplorer props:", this.props);
        var pathlinks = path && path.map ( (folder, index) => {
            if (index == path.length - 1) {
                return (<span key={index}> {' / ' + folder.name} </span>)
            } else {
                return (
                <span key={index}> 
                    <span>{' / '}</span>
                    <a onClick={ () => selectFolder && selectFolder(folder) }> 
                    {folder.name}
                    </a>
                </span>
                )
            }
        } );

        var current = path && _.last(path);
        var currentFolderId = (current && current.id) || 0;

        var listStyleContent = null;
        if (this.state.listStyle == 'th-list') {
            var folderlist = folders && folders.map ( (folder, index) => {
                if (folder.parent == currentFolderId)
                    return (
              <tr key={index}> 
                <td className={classes.fileicon}><span className="glyphicon glyphicon-folder-open" aria-hidden="true"></span></td>
                <td className={classes.itemName}><a onClick={ () => selectFolder && selectFolder(folder) }>
                    {folder.name}</a>
                    <span className={classes.fileOperate}>
                    <a onClick={ () => editFolder && editFolder(folder) }>编辑</a> | <a onClick={ () => deleteFolder && deleteFolder(folder) }>删除</a> | <a onClick={ () => moveFolder && moveFolder(folder) }>移动</a>
                    </span>
                </td> 
                <td></td>
                <td>{folder.desc}</td> 
              </tr>
                    )
            } );
            
            var filelist = files && files.map ( (file, index) => {
                if (file.folder == currentFolderId) {
                    var fileClass = "glyphicon glyphicon-file";
                    if (file.mimetype && (file.mimetype.indexOf('image') >= 0)) 
                        fileClass = "glyphicon glyphicon-picture";
                    return (
              <tr key={index}>
                <td className={classes.fileicon}><span className={fileClass} aria-hidden="true"></span></td>
                <td className={classes.itemName}><a onClick={ () => selectFile && selectFile(file) }>{file.name}</a>
                    <span className={classes.fileOperate}>
                    <a onClick={ () => editFile && editFile(file) }>编辑</a> | <a onClick={ () => deleteFile && deleteFile(file) }>删除</a> | <a onClick={ () => moveFile && moveFile(file) }>移动</a>
                    </span>
                </td>
                <td>{file.path}</td>
                <td>{file.mimetype}</td> 
              </tr>
                    )
                }
            } );
            listStyleContent = (
          <table className={cx("table table-hover", 'filetable')}> 
            <tbody> {folderlist} {filelist} </tbody> 
          </table>
            )
        } else {
            var wrapClass = "col-xs-2 col-sm-1";
            if (this.state.listStyle == 'th-large') {
                wrapClass = "col-xs-4 col-sm-2";
            }
            wrapClass = classNames(wrapClass, classes.cardContainer);
            var innerClass = classNames("img-responsive center-block", classes.imgInner);
            var folderlist = folders && folders.map ( (folder, index) => {
                if (folder.parent == currentFolderId)
                    return (
                        <div className={wrapClass} key={index}>
                          <div className={classes.imgWrapper}>
                            <img src={"/images/folder1.png"} className={innerClass} alt="Responsive image" />
                            <div className={classes.infoInner}>
                            <a onClick={ () => selectFolder && selectFolder(folder) }>
                            {folder.name}</a><br/>
                            <span className={classes.fileOperate}>
                            <a onClick={ () => editFolder && editFolder(folder) }>编辑</a> | <a onClick={ () => deleteFolder && deleteFolder(folder) }>删除</a> | <a onClick={ () => moveFolder && moveFolder(folder) }>移动</a>
                            </span>
                            </div>

                          </div>
                          <div className={classes.fileName}>
                            <a onClick={ () => selectFolder && selectFolder(folder) }>{folder.name||'未命名'}</a>
                          </div>
                        </div>
                        )
            } );
            
            var filelist = files && files.map ( (file, index) => {
                if (file.folder == currentFolderId) {
                    var fileClass = "glyphicon glyphicon-file";
                    if (file.mimetype && (file.mimetype.indexOf('image') >= 0)) 
                        fileClass = "glyphicon glyphicon-picture";
                    return (
                            <div className={wrapClass} key={index}>
                            <div className={classes.imgWrapper}>
                              <img src={"/"+file.path} className={innerClass} alt="Responsive image" />
                              <div className={classes.infoInner}>
                                <a onClick={ () => selectFile && selectFile(file) }>{file.name}</a>
                                <br/>
                                <span className={classes.fileOperate}>
                                  <a onClick={ () => editFile && editFile(file) }>编辑</a> | <a onClick={ () => deleteFile && deleteFile(file) }>删除</a> | <a onClick={ () => moveFile && moveFile(file) }>移动</a>
                                </span>
                              </div>
                            </div>
                            <div className={classes.fileName}><a onClick={ () => selectFile && selectFile(file) }>{file.name||'未命名'}</a></div>
                            </div>
                    )
                }
            } );
            listStyleContent = (
                    <div style={ {margin:0} }> 
                    <div className="row">{folderlist} {filelist}</div>
                    </div>
            )
        }

        var toggleDropdown = (name, e) => {
            console.log ("toggleDropdown:"+name);
            e && e.stopPropagation();
            this.setState({dropdown:(!this.state.dropdown || this.state.dropdown != name)?name:null });
        }

        return (
  <div className={classes.wrapper}>
    <div className='clearfix' />
    <div className={classes.pathinfo}>
      <div>
        <a onClick={ () => this.setState({listStyle:'th-list'}) }><span className="glyphicon glyphicon-th-list" aria-hidden="true"></span></a>&nbsp;
        <a onClick={ () => this.setState({listStyle:'th'}) }><span className="glyphicon glyphicon-th" aria-hidden="true"></span></a>&nbsp;
        <a onClick={ () => this.setState({listStyle:'th-large'}) }><span className="glyphicon glyphicon-th-large" aria-hidden="true"></span></a>&nbsp;
        <span>当前目录：</span>{pathlinks}
        <ul className="right-navbar fe-toolbar">
					<li className={classNames("dropdown hoe-rheader-submenu hoe-header-profile", this.state.dropdown == 'createFolder' && 'open')}>
						<a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown" onClick={ (e) => toggleDropdown('createFolder',e) } >
              <span>新建目录</span>
						</a>
              <CreateFolderPopup currentFolder={current} createFolder={createFolder}/>
					</li>
					<li className="dropdown hoe-rheader-submenu hidden-xs">
						<a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown">
              <span>管理目录</span>
            </a> 
					</li> 
				</ul>
      </div>
    </div>

    <div>
      {listStyleContent}
    </div>
  </div>
        )
    }
}

FileExplorer.propTypes = {
    path: React.PropTypes.array,
    folders: React.PropTypes.array,
    files: React.PropTypes.array,
    createFolder: React.PropTypes.func,
    selectFolder: React.PropTypes.func,
    selectFile: React.PropTypes.func,
    deleteFolder: React.PropTypes.func, 
    deleteFile: React.PropTypes.func, 
    moveFolder: React.PropTypes.func, 
    moveFile: React.PropTypes.func, 
    editFolder: React.PropTypes.func, 
    editFile: React.PropTypes.func
}

