import _ from 'lodash';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
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
import CameraIcon from 'material-ui-icons/PhotoCamera';
import PersonIcon from 'material-ui-icons/Person';
import UserIcon from 'material-ui-icons/AccountBox';
import InboxIcon from 'material-ui-icons/Inbox';
import EmailIcon from 'material-ui-icons/Email';
import settings from '/imports/utils/settings';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import ModalLoader from '/imports/ui/components/Modal/Common/ModalLoader';

const { domain } = settings;

const uploadURL = window.location.protocol === 'https:' ? 'https://up.qbox.me/' : 'http://upload.qiniu.com';

export default class SettingContent extends PureComponent {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    onProfileChange: PropTypes.func.isRequired,
    User: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  updateProfile = (newProfile) => {
    this.props.onProfileChange({
      ...this.props.profile,
      ...newProfile,
    });
  }

  _handleSetCover = (e) => {
    this.renderLoadModal('上传封面中');

    const { User, token } = this.props;
    const cover = e.target.files[0];
    if (!cover) {
      return;
    }
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
        this.props.modalClose();
        this.props.snackBarOpen('上传封面成功');
        this.updateProfile({ cover: `${domain}/${data.key}` });
      })
      .catch((err) => {
        console.log(err);
        this.props.modalClose();
        this.props.snackBarOpen(`上传封面失败 ${err}`);
      });
  }

  _handleSetAvatar = (e) => {
    this.renderLoadModal('上传头像中');

    const avatar = e.target.files[0];
    const size = Math.round(avatar.size / 1024);
    if (size < 200) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.props.modalClose();
        this.props.snackBarOpen('上传头像成功');
        this.updateProfile({ avatar: evt.target.result });
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
          this.props.modalClose();
          this.props.snackBarOpen('上传头像成功');
          this.updateProfile({ avatar: `${domain}/${data.key}?imageView2/1/w/240/h/240` });
        })
        .catch((err) => {
          console.log(err);
          this.props.modalClose();
          this.props.snackBarOpen(`上传头像失败 ${err}`);
        });
    }
  }

  _handleInputChange = (e) => {
    this.updateProfile({ [e.target.name]: e.target.value });
  }

  _handleSelectChange = (e, selected) => {
    const newSettings = {
      ...this.props.profile.settings,
      [e.target.name]: selected,
    };
    this.updateProfile({ settings: newSettings });
  }

  renderLoadModal = (message, errMsg = '请求超时') => {
    this.props.modalOpen({
      content: <ModalLoader message={message} errMsg={errMsg} />,
      ops: { ignoreBackdropClick: true },
    });
  }

  render() {
    const { profile, User, classes } = this.props;
    return (
      <ContentLayout>
        <div className="content__setting">
          <header className="setting__header">
            <div className="setting__cover" style={{ backgroundImage: `url("${profile.cover}")` }}>
              <div className="setting__background" />
            </div>
            <div className="setting__uploaders">
              <IconButton onClick={() => this.avatarInput.click()}>
                <Avatar className={classes.icon__avatar} src={profile.avatar} size={60} />
                <input
                  style={{ display: 'none' }}
                  type="file"
                  ref={(ref) => { this.avatarInput = ref; }}
                  onChange={this._handleSetAvatar}
                />
              </IconButton>
              <IconButton className={classes.btn__camera} onClick={() => this.coverInput.click()}>
                <CameraIcon className={classes.icon__camera} />
                <input
                  style={{ display: 'none' }}
                  type="file"
                  ref={(ref) => { this.coverInput = ref; }}
                  onChange={this._handleSetCover}
                />
              </IconButton>
            </div>
          </header>
          <h2 className="setting__username">{User.username}</h2>
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
                  name="nickname"
                  value={profile.nickname}
                  onChange={this._handleInputChange}
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
                  name="intro"
                  value={profile.intro}
                  onChange={this._handleInputChange}
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
                  onClick={() => this.props.history.push('/setting/emails')}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="更改密码"
                  secondary="通过当前密码或电子邮箱更换密码"
                  onClick={() => this.props.history.push('/setting/password')}
                />
              </ListItem>
            </List>
            <Divider />
            { /* Privacy Setting */ }
            <List subheader={<ListSubheader>隐私设置</ListSubheader>}>
              <ListItem>
                <Checkbox
                  name="allowVisitHome"
                  checked={profile.settings.allowVisitHome}
                  tabIndex={-1}
                  onChange={this._handleSelectChange}
                  disableRipple
                />
                <ListItemText
                  primary="公开主页"
                  secondary="是否允许游客访问我的主页"
                />
              </ListItem>
              <ListItem>
                <Checkbox
                  name="allowVisitColl"
                  checked={profile.settings.allowVisitColl}
                  tabIndex={-1}
                  onChange={this._handleSelectChange}
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
                    name="allowNoti"
                    checked={profile.settings.allowNoti}
                    onChange={this._handleSelectChange}
                    disabled
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText primary="允许信息" />
                <ListItemSecondaryAction>
                  <Switch
                    name="allowMsg"
                    checked={profile.settings.allowMsg}
                    onChange={this._handleSelectChange}
                    disabled
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </div>
          <Divider />
        </div>
      </ContentLayout>
    );
  }
}
