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
import CollHolder from '/imports/ui/components/CollHolder';
import ModalLoader from '/imports/ui/components/Modal/Common/ModalLoader';
import DataLoader from '/imports/ui/components/Loader/DataLoader';
import { TabView } from '../styles';

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
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  _handleAddCollection = () => {
    const { curUser } = this.props;
    // eslint-disable-next-line no-extra-boolean-cast
    if (modalState.errorText) {
      this.props.snackBarOpen(modalState.errorText);
      this.closeModal('add');
      return;
    }
    const name = modalState.newCollName;
    this.closeModal('add');
    this.renderLoadModal('新建相册中');
    insertCollection.callPromise({
      name,
      user: curUser.username,
      cover: `/img/pattern/VF_ac${getRandomInt(1, 28)}.jpg`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
      .then(() => {
        this.props.modalClose();
        this.props.snackBarOpen('新建相册成功');
      })
      .catch((err) => {
        console.log(err);
        this.props.modalClose();
        this.props.snackBarOpen('新建相册失败');
      });
  }

  _handleRemoveCollection = (coll) => {
    const { curUser } = this.props;
    this.closeModal('remove');
    this.renderLoadModal('删除相册中');
    removeCollection.callPromise({
      username: curUser.username,
      collName: coll.name,
    })
      .then(() => {
        this.props.modalClose();
        this.props.snackBarOpen('删除相册成功');
      })
      .catch((err) => {
        console.log(err);
        this.props.modalClose();
        this.props.snackBarOpen(`删除相册失败 ${err.reason}`);
      });
  }


  _handleLockCollection = (collection) => {
    const { curUser } = this.props;
    const msg = collection.private ? '公开' : '加密';
    this.renderLoadModal('加密相册中');
    lockCollection.callPromise({
      username: curUser.username,
      collId: collection._id,
      collName: collection.name,
      privateStat: collection.private,
    })
      .then(() => {
        this.props.modalClose();
        this.props.snackBarOpen(`${msg}相册成功`);
      })
      .catch((err) => {
        console.log(err);
        this.props.modalClose();
        this.props.snackBarOpen(`${msg}相册失败 ${err.reason}`);
      });
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
    this.props.modalClose();
  }

  renderAddModal = () => {
    this.props.modalOpen({
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
    this.props.modalOpen({
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

  renderLoadModal = (message, errMsg = '请求超时') => {
    this.props.modalOpen({
      content: <ModalLoader message={message} errMsg={errMsg} />,
      ops: { ignoreBackdropClick: true },
    });
  }

  render() {
    const { dataIsReady, isOwner, curUser, colls, classes } = this.props;
    if (!dataIsReady) {
      return <DataLoader />;
    }
    return (
      <TabView>
        {
          isOwner && (
            <Paper className={classes.paper} onClick={this.renderAddModal}>
              <IconButton><AddIcon classes={{ root: classes.icon }} /></IconButton>
              <Typography className={classes.text}>添加相册</Typography>
            </Paper>
          )
        }
        {
          colls.map((coll) => (
            <CollHolder
              key={coll._id}
              coll={coll}
              avatarSrc={curUser.profile.avatar}
              onToggleLock={this._handleLockCollection}
              onRemove={this.renderRemoveModal}
              showActions={isOwner}
              showDetails
            />
          ))
        }
      </TabView>
    );
  }
}
