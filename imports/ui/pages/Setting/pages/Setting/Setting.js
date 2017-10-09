import _ from 'lodash';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withStyles } from 'material-ui/styles';
import List, {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import Switch from 'material-ui/Switch';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import DoneIcon from 'material-ui-icons/Done';
import CameraIcon from 'material-ui-icons/PhotoCamera';
import PersonIcon from 'material-ui-icons/Person';
import UserIcon from 'material-ui-icons/AccountBox';
import InboxIcon from 'material-ui-icons/Inbox';
import EmailIcon from 'material-ui-icons/Email';
import blue from 'material-ui/colors/blue';
import settings from '/imports/utils/settings';
import { updateProfile } from '/imports/api/users/methods.js';
import RootLayout from '/imports/ui/layouts/RootLayout';
import { CustomNavHeader, SecondaryNavHeader } from '/imports/ui/components/NavHeader';
import { ModalActions } from '/imports/ui/components/Modal';
import { CircleLoader } from '/imports/ui/components/Loader';

const blue500 = blue['500'];

let initialSettings;

const { domain } = settings;

const uploadURL = window.location.protocol === 'https:' ? 'https://up.qbox.me/' : 'http://upload.qiniu.com';

class SettingPage extends Component {
  static propTypes = {
    User: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const initialUser = props.User;
    this.state = {
      location: 'setting',
      isProcessing: false,
      processMsg: '',
      isEditing: false,
      cover: initialUser.profile.cover,
      avatar: initialUser.profile.avatar,
      nickname: initialUser.profile.nickname || '',
      intro: initialUser.profile.intro || '',
      allowVisitColl: initialUser.profile.settings.allowVisitColl,
      allowVisitHome: initialUser.profile.settings.allowVisitHome,
      allowNoti: initialUser.profile.settings.allowNoti,
      allowMsg: initialUser.profile.settings.allowMsg,
    };
    initialSettings = this.state;
  }

  _handleDiscard = () => {
    const { User } = this.props;
    const { avatar, cover } = this.state;
    const keys = [];

    // if has uploaded, we need to remove it before quit
    if (avatar !== User.profile.avatar) {
      const regex = /\.com\/(.*)\?imageView2/;
      const avatarKey = avatar.split(regex)[1];
      keys.push(avatarKey);
    }
    if (cover !== User.profile.cover) {
      const regex = /\.com\/(.*)/;
      const coverKey = cover.split(regex)[1];
      keys.push(coverKey);
    }

    if (keys.length !== 0) {
      Meteor.call(
        'Qiniu.remove',
        { keys },
        (err) => err && console.log(err)
      );
    }
    this.props.modalClose();
    this.setState(initialSettings);
  }

  _handleSubmit = () => {
    updateProfile.callPromise({
      nickname: this.state.nickname,
      intro: this.state.intro,
      cover: this.state.cover,
      avatar: this.state.avatar,
      settings: {
        allowVisitColl: this.state.allowVisitColl,
        allowVisitHome: this.state.allowVisitHome,
        allowNoti: this.state.allowNoti,
        allowMsg: this.state.allowMsg,
      },
    })
    .then(() => {
      this.props.snackBarOpen('设置保存成功');
      this.setState({ isEditing: false });
    })
    .catch((err) => {
      console.log(err);
      this.props.snackBarOpen('设置保存失败');
    });
  }

  _handleSetCover = (e) => {
    const { User, token } = this.props;
    this.setState({
      isEditing: true,
      isProcessing: true,
      processMsg: '上传封面中',
    });
    const cover = e.target.files[0];
    if (!cover) return;
    const key = `${User.username}/setting/cover/${cover.name}`;
    const formData = new FormData();
    formData.append('file', cover);
    formData.append('key', key);
    formData.append('token', token);

    axios({
      method: 'POST',
      url: uploadURL,
      data: formData,
    })
    .then(({ data }) => {
      this.setState({
        isEditing: true,
        isProcessing: false,
        processMsg: '',
        cover: `${domain}/${data.key}`,
      });
      this.props.snackBarOpen('上传封面成功');
    })
    .catch((err) => {
      console.log(err);
      this.setState({
        isEditing: false,
        isProcessing: false,
        processMsg: '',
      });
      this.props.snackBarOpen(`上传封面失败 ${err}`);
    });
  }

  _handleSetAvatar = (e) => {
    this.setState({
      isEditing: true,
      isProcessing: true,
      processMsg: '上传头像中',
    });
    const avatar = e.target.files[0];
    const size = Math.round(avatar.size / 1024);
    if (size < 200) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataURL = event.target.result;
        this.setState({
          isEditing: true,
          isProcessing: false,
          processMsg: '',
          avatar: dataURL,
        });
        this.props.snackBarOpen('上传头像成功');
      };
      reader.readAsDataURL(avatar);
    } else {
      const key = `${this.props.User.username}/setting/avatar/${avatar.name}`;
      const formData = new FormData();
      formData.append('file', avatar);
      formData.append('key', key);
      formData.append('token', this.props.token);

      axios({
        method: 'POST',
        url: uploadURL,
        data: formData,
      })
      .then(({ data }) => {
        const avatarSrc = `${domain}/${data.key}?imageView2/1/w/240/h/240`;
        this.setState({
          isEditing: true,
          isProcessing: false,
          processMsg: '',
          avatar: avatarSrc,
        });
        this.props.snackBarOpen('上传头像成功');
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isEditing: false,
          isProcessing: false,
          processMsg: '',
        });
        this.props.snackBarOpen(`上传头像失败 ${err}`);
      });
    }
  }

  _handleOpenModal = () => {
    this.props.modalOpen({
      title: '提示',
      content: '您还有尚未保存的设置，是否确认退出？',
      actions: (
        <ModalActions
          sClick={this.props.modalClose}
          pClick={this._handleDiscard}
        />
      ),
    });
  }

  _handleLoaderTimeout = () => {
    this.setState({ isProcessing: false, processMsg: '' });
    this.props.snackBarOpen('上传超时');
  }

  renderContent() {
    const { User, classes, history } = this.props;
    return (
      <div className="content__setting">
        <header className="setting__header">
          <div className="setting__cover" style={{ backgroundImage: `url("${this.state.cover}")` }}>
            <div className="setting__background" />
            <div className="setting__uploader" onClick={() => this.coverInput.click()} >
              <CameraIcon className={classes.icon__camera} />
              <input
                style={{ display: 'none' }}
                type="file"
                ref={(ref) => { this.coverInput = ref; }}
                onChange={this._handleSetCover}
              />
            </div>
          </div>
          <div className="setting__avatar">
            <div className="setting__uploader" onClick={() => this.avatarInput.click()}>
              <Avatar src={this.state.avatar} size={60} />
              <input
                style={{ display: 'none' }}
                type="file"
                ref={(ref) => { this.avatarInput = ref; }}
                onChange={this._handleSetAvatar}
              />
            </div>
          </div>
          <h2 className="setting__username">{User.username}</h2>
        </header>
        <Divider />
        <div className="setting__content">
          { /* General Setting */ }
          <List subheader={<ListSubheader>基础资料</ListSubheader>}>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <TextField
                label="用户名"
                value={User.username}
                fullWidth
                disabled
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <TextField
                label="主邮箱"
                value={_.get(User, 'emails[0].address') || '暂无邮箱'}
                fullWidth
                disabled
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <UserIcon />
              </ListItemIcon>
              <TextField
                label="昵称"
                value={this.state.nickname}
                onChange={(e) => this.setState({ isEditing: true, nickname: e.target.value })}
                fullWidth
                disabled
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <TextField
                label="个人简介"
                value={this.state.intro}
                onChange={(e) => this.setState({ isEditing: true, intro: e.target.value })}
                fullWidth
                disabled
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="头像"
                secondary="更改默认头像"
                onClick={() => this.avatarInput.click()}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="封底"
                secondary="更改封底照片"
                onClick={() => this.coverInput.click()}
              />
            </ListItem>
          </List>
          <Divider />
          { /* Security Setting */ }
          <List subheader={<ListSubheader>账户安全</ListSubheader>}>
            <ListItem>
              <ListItemText
                primary="我的邮箱"
                secondary="查看当前邮箱信息"
                onClick={() => history.push('/setting/emails')}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="更改密码"
                secondary="通过当前密码或电子邮箱更换密码"
                onClick={() => history.push('/setting/password')}
              />
            </ListItem>
          </List>
          <Divider />
          { /* Privacy Setting */ }
          <List subheader={<ListSubheader>隐私设置</ListSubheader>}>
            <ListItem>
              <Checkbox
                checked={this.state.allowVisitHome}
                tabIndex={-1}
                onChange={(e, checked) => this.setState({ isEditing: true, allowVisitHome: checked })}
                disableRipple
              />
              <ListItemText
                primary="公开主页"
                secondary="是否允许游客访问我的主页"
              />
            </ListItem>
            <ListItem>
              <Checkbox
                checked={this.state.allowVisitColl}
                tabIndex={-1}
                onChange={(e, checked) => this.setState({ isEditing: true, allowVisitColl: checked })}
                disableRipple
              />
              <ListItemText
                primary="公开相册"
                secondary="是否默认公开新建相册"
              />
            </ListItem>
          </List>
          <Divider />
          { /* Perference Setting */ }
          <List subheader={<ListSubheader>偏好设置</ListSubheader>}>
            <ListItem>
              <ListItemText primary="允许通知" />
              <ListItemSecondaryAction>
                <Switch
                  checked={this.state.allowNoti}
                  onChange={() => this.setState({ isEditing: true, allowNoti: !this.state.allowNoti })}
                  disabled
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="允许信息" />
              <ListItemSecondaryAction>
                <Switch
                  checked={this.state.allowMsg}
                  onChange={() => this.setState({ isEditing: true, allowMsg: !this.state.allowMsg })}
                  disabled
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </div>
        <Divider />
      </div>
    );
  }

  render() {
    const { User, classes } = this.props;
    return (
      <RootLayout
        loading={!User}
        Topbar={
          this.state.isEditing
          ? (
            <CustomNavHeader
              classnames={{ root: classes.navheader__root, content: classes.navheader__content }}
              title={this.state.isProcessing ? '上传图片中' : '修改设置中'}
              Left={
                <IconButton color="contrast" onClick={this._handleOpenModal}>
                  <ArrowBackIcon />
                </IconButton>
              }
              Right={
                <IconButton color="contrast" onClick={this._handleSubmit}>
                  <DoneIcon />
                </IconButton>
              }
            />
          )
          : <SecondaryNavHeader title="个人设置" />
        }
      >
        <CircleLoader
          open={this.state.isProcessing}
          message={this.state.processMsg}
          onTimeout={this._handleLoaderTimeout}
        />
        { User && this.renderContent() }
      </RootLayout>
    );
  }

}

const styles = {
  icon__camera: {
    height: '38px',
    color: '#fff',
  },

  navheader__root: {
    backgroundColor: blue500,
  },

  navheader__content: {
    color: '#fff',
  },
};

export default withStyles(styles)(SettingPage);
