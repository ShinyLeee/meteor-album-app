import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import AddIcon from 'material-ui-icons/AddCircleOutline';
import { insertCollection, lockCollection, removeCollection } from '/imports/api/collections/methods.js';
import { getRandomInt } from '/imports/utils';
import CollHolder from '/imports/ui/components/CollHolder';
import { CircleLoader } from '/imports/ui/components/Loader';
import { snackBarOpen } from '/imports/ui/redux/actions';
import {
  inlineStyles,
  AddWrapper,
  AddSvgWrapper,
  AddMessage,
} from './Own.style.js';

class OwnedCollection extends Component {
  static propTypes = {
    isGuest: PropTypes.bool.isRequired,
    curUser: PropTypes.object.isRequired,
    colls: PropTypes.array.isRequired,
    existCollNames: PropTypes.array,
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    isProcessing: false,
    processMsg: '',
    addDialog: false,
    newCollName: undefined,
    errorText: undefined,
    removeDialog: false,
    waitRemoveColl: undefined,
    isConfirmRemove: false,
  }

  // 用于创建新相册时检查该相册名是否已用过
  _handleChangeCollName = (e) => {
    const { existCollNames } = this.props;
    const newCollName = e.target.value;
    if (newCollName.length > 10) {
      this.setState({ errorText: '相册名不能超过十个字符' });
    } else if (existCollNames.indexOf(newCollName) >= 0) {
      this.setState({ errorText: '该相册已存在' });
    } else {
      this.setState({ newCollName });
    }
  }

  _handleAddCollection = () => {
    if (this.state.errorText) {
      this.props.snackBarOpen(this.state.errorText);
      this._handleCloseDialog('add');
      return;
    }
    this._handleCloseDialog('add');
    this.setState({ isProcessing: true, processMsg: '新建相册中' });
    insertCollection.callPromise({
      name: this.state.newCollName,
      user: this.props.curUser.username,
      cover: `/img/pattern/VF_ac${getRandomInt(1, 28)}.jpg`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .then(() => {
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen('新建相册成功');
    })
    .catch((err) => {
      console.log(err);
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen('新建相册失败');
    });
  }

  // 用于删除相册时确认要删除掉相册名
  _handleConfirmCollName = (e) => {
    const { waitRemoveColl } = this.state;
    this.setState({ isConfirmRemove: waitRemoveColl === e.target.value });
  }

  _handleRemoveCollection = () => {
    const { curUser } = this.props;
    this._handleCloseDialog('remove');
    this.setState({ isProcessing: true, processMsg: '删除相册中' });
    removeCollection.callPromise({
      username: curUser.username,
      collName: this.state.waitRemoveColl,
    })
    .then(() => {
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen('删除相册成功');
    })
    .catch((err) => {
      console.log(err);
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(`删除相册失败 ${err.reason}`);
    });
  }


  _handleLockCollection = (collection) => {
    const { curUser } = this.props;
    const msg = collection.private ? '公开' : '加密';
    this.setState({ isProcessing: true, processMsg: '加密相册中' });
    lockCollection.callPromise({
      username: curUser.username,
      collId: collection._id,
      collName: collection.name,
      privateStat: collection.private,
    })
    .then(() => {
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(`${msg}相册成功`);
    })
    .catch((err) => {
      console.log(err);
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(`${msg}相册失败 ${err.reason}`);
    });
  }

  _handleCloseDialog = (type) => {
    switch (type) {
      case 'add':
        this.setState({ addDialog: false, newCollName: undefined, errorText: undefined });
        break;
      case 'remove':
        this.setState({ removeDialog: false, removeColl: undefined, isConfirmRemove: false });
        break;
      default:
        break;
    }
  }

  _handleOnTimeout = () => {
    this.setState({ isProcessing: false, processMsg: '' });
    this.props.snackBarOpen('请求超时，请重试');
  }

  render() {
    const { isGuest, curUser, colls } = this.props;
    return (
      <div>
        {
          !isGuest && (
            <AddWrapper onClick={() => this.setState({ addDialog: true })}>
              <AddSvgWrapper><AddIcon style={inlineStyles.AddIcon} /></AddSvgWrapper>
              <AddMessage>添加相册</AddMessage>
            </AddWrapper>
          )
        }
        {
          colls.map((coll, i) => (
            <CollHolder
              key={i}
              coll={coll}
              avatarSrc={curUser.profile.avatar}
              onToggleLock={this._handleLockCollection}
              onRemove={(collection) => this.setState({ removeDialog: true, waitRemoveColl: collection.name })}
              showActions={!isGuest}
              showDetails
            />
          ))
        }
        <CircleLoader
          open={this.state.isProcessing}
          message={this.state.processMsg}
          onTimeout={this._handleOnTimeout}
        />
        <Dialog
          title="新建相册"
          actions={[
            <Button
              label="取消"
              onClick={() => this._handleCloseDialog('add')}
              primary
            />,
            <Button
              label="新建"
              onClick={this._handleAddCollection}
              disabled={!this.state.newCollName}
              primary
            />,
          ]}
          open={this.state.addDialog}
          onRequestClose={() => this._handleCloseDialog('add')}
        >
          <TextField
            name="addColl"
            hintText="相册名"
            onChange={this._handleChangeCollName}
            errorText={this.state.errorText}
            fullWidth
          />
        </Dialog>
        <Dialog
          title="删除相册"
          actions={[
            <Button
              label="取消"
              onClick={() => this._handleCloseDialog('remove')}
              primary
            />,
            <Button
              label="确认删除"
              onClick={this._handleRemoveCollection}
              disabled={!this.state.isConfirmRemove}
              primary
            />,
          ]}
          open={this.state.removeDialog}
          onRequestClose={() => this._handleCloseDialog('remove')}
        >
          <small>请输入该相册名以确认删除该相册</small>
          <TextField
            name="removeColl"
            onChange={this._handleConfirmCollName}
            fullWidth
          />
        </Dialog>
        {/* <Dialog
          open={this.state.infoDialog}
          onRequestClose={() => this.setState({ infoDialog: false })}
        >
          <div>
            <InfoHeader><StyledHeartIcon style={{ color: '#999' }} />喜欢</InfoHeader>
            <InfoNumer>{image.liker.length}</InfoNumer>
          </div>
          <div>
            <InfoHeader><StyledEyeIcon style={{ color: '#999' }} />浏览</InfoHeader>
            <InfoNumer>{(image.view && image.view + 1) || 1}</InfoNumer>
          </div>
          <div>
            <InfoHeader><StyledCameraIcon style={{ color: '#999' }} />所属相册</InfoHeader>
            <InfoNumer>{image.collection}</InfoNumer>
          </div>
        </Dialog>*/}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default connect(null, mapDispatchToProps)(OwnedCollection);
