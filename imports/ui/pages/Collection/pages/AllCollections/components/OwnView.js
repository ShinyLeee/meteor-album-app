import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Button from 'material-ui/Button';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import AddIcon from 'material-ui-icons/AddCircleOutline';
import { insertCollection, lockCollection, removeCollection } from '/imports/api/collections/methods';
import { getRandomInt } from '/imports/utils';
import CollList from '/imports/ui/components/CollList';
import Modal from '/imports/ui/components/Modal';
import DataLoader from '/imports/ui/components/Loader/DataLoader';

const modalState = {
  newCollName: null,
  errorText: null,
  confirmRemove: false,
};

export default class OwnView extends PureComponent {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,
    curUser: PropTypes.object.isRequired,
    colls: PropTypes.array.isRequired,
    existCollNames: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  _handleAddCollection = async () => {
    const { curUser } = this.props;
    if (modalState.errorText) {
      this.props.snackBarOpen(modalState.errorText);
      this.closeModal('add');
      return;
    }
    try {
      const name = modalState.newCollName;
      await Modal.showLoader('新建相册中');
      await insertCollection.callPromise({
        name,
        user: curUser.username,
        cover: `/img/pattern/VF_ac${getRandomInt(1, 28)}.jpg`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      this.closeModal('add');
      this.props.snackBarOpen('新建相册成功');
    } catch (err) {
      console.warn(err);
      this.closeModal('add');
      this.props.snackBarOpen('新建相册失败');
    }
  }

  _handleRemoveCollection = async (coll) => {
    const { curUser } = this.props;
    try {
      await Modal.showLoader('删除相册中');
      await removeCollection.callPromise({
        username: curUser.username,
        collName: coll.name,
      });
      this.closeModal('remove');
      this.props.snackBarOpen('删除相册成功');
    } catch (err) {
      console.warn(err);
      this.closeModal('remove');
      this.props.snackBarOpen(`删除相册失败 ${err.reason}`);
    }
  }


  _handleLockCollection = async (collection) => {
    const { curUser } = this.props;
    const msg = collection.private ? '公开' : '加密';
    try {
      await Modal.showLoader(`${msg}相册中`);
      await lockCollection.callPromise({
        username: curUser.username,
        collId: collection._id,
        collName: collection.name,
        privateStat: collection.private,
      });
      Modal.close();
      this.props.snackBarOpen(`${msg}相册成功`);
    } catch (err) {
      console.warn(err);
      Modal.close();
      this.props.snackBarOpen(`${msg}相册失败 ${err.reason}`);
    }
  }

  _handleRemoveNameChange = (e, coll) => {
    modalState.confirmRemove = coll.name === e.target.value;
    this.renderRemoveModal(coll);
  }

  // 用于创建新相册时检查该相册名是否已用过
  _handleCollNameChange = (e) => {
    const { existCollNames } = this.props;
    const newCollName = e.target.value;
    modalState.newCollName = newCollName;
    if (newCollName.length > 10) {
      modalState.errorText = '相册名不能超过十个字符';
    } else if (existCollNames.indexOf(newCollName) >= 0) {
      modalState.errorText = '该相册已存在';
    } else {
      modalState.errorText = '';
    }
    this.renderAddModal();
  }

  closeModal = (type) => {
    if (type === 'add') {
      modalState.newCollName = null;
      modalState.errorText = null;
    } else if (type === 'remove') {
      modalState.confirmRemove = false;
    }
    Modal.close();
  }

  renderAddModal = () => {
    Modal.show({
      title: '新建相册',
      content: (
        <FormControl error={modalState.errorText} fullWidth>
          <InputLabel htmlFor="collName">相册名</InputLabel>
          <Input
            name="collName"
            onChange={this._handleCollNameChange}
            fullWidth
          />
          { modalState.errorText && <FormHelperText>{modalState.errorText}</FormHelperText> }
        </FormControl>
      ),
      actions: [
        <Button
          key="action__cancel"
          color="primary"
          onClick={() => this.closeModal('add')}
        >取消
        </Button>,
        <Button
          key="action__add"
          color="primary"
          onClick={this._handleAddCollection}
          disabled={!modalState.newCollName}
        >新建
        </Button>,
      ],
      ops: { ignoreBackdropClick: true },
    });
  }

  renderRemoveModal = (coll) => {
    Modal.show({
      title: '删除相册',
      content: [
        <small key="content__tip">请输入该相册名以确认删除该相册</small>,
        <Input
          key="content__input"
          onChange={(e) => this._handleRemoveNameChange(e, coll)}
          fullWidth
        />,
      ],
      actions: [
        <Button
          key="action__cancel"
          color="primary"
          onClick={() => this.closeModal('remove')}
        >取消
        </Button>,
        <Button
          key="action__confirm"
          color="primary"
          onClick={() => this._handleRemoveCollection(coll)}
          disabled={!modalState.confirmRemove}
        >确认删除
        </Button>,
      ],
      ops: { ignoreBackdropClick: true },
    });
  }

  render() {
    const {
      dataIsReady,
      isOwner,
      colls,
      classes,
    } = this.props;
    if (!dataIsReady) {
      return <DataLoader />;
    }
    return (
      <CollList
        colls={colls}
        onToggleLock={this._handleLockCollection}
        onRemove={this.renderRemoveModal}
        showActions={isOwner}
        showDetails
      >
        {
          isOwner && (
            <Paper className={classes.paper} onClick={this.renderAddModal}>
              <IconButton><AddIcon classes={{ root: classes.icon }} /></IconButton>
              <Typography className={classes.text}>添加相册</Typography>
            </Paper>
          )
        }
      </CollList>
    );
  }
}
