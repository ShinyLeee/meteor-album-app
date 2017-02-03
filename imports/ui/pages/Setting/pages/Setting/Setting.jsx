import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import Toggle from 'material-ui/Toggle';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import DoneIcon from 'material-ui/svg-icons/action/done';
import CameraIcon from 'material-ui/svg-icons/image/photo-camera';
import PersonIcon from 'material-ui/svg-icons/social/person';
import UserIcon from 'material-ui/svg-icons/action/account-box';
import InboxIcon from 'material-ui/svg-icons/content/inbox';
import EmailIcon from 'material-ui/svg-icons/communication/email';
import { blue500 } from 'material-ui/styles/colors';
import { updateProfile } from '/imports/api/users/methods.js';

import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import Loader from '/imports/ui/components/Loader/Loader.jsx';
import styles from '../../Setting.style.js';

let initialSettings;

export default class SettingPage extends Component {

  constructor(props) {
    super(props);
    const initialUser = props.User;
    this.state = {
      location: 'setting',
      isEditing: false,
      isProcessing: false,
      isAlertOpen: false,
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
    this.handleDiscard = this.handleDiscard.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSetCover = this.handleSetCover.bind(this);
    this.handleSetAvatar = this.handleSetAvatar.bind(this);
  }

  handleDiscard() {
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
      Meteor.call('Qiniu.remove', { keys }, (err) => err && console.log(err)); // eslint-disable-line no-console
    }
    this.setState(initialSettings);
  }

  handleSubmit() {
    updateProfile.call({
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
    }, (err) => {
      if (err) {
        this.props.snackBarOpen('设置保存失败');
        console.log(err); // eslint-disable-line no-console
        throw new Meteor.Error(err);
      }
      this.props.snackBarOpen('设置保存成功');
      this.setState({ isEditing: false });
    });
  }

  handleSetCover(e) {
    this.setState({
      isEditing: true,
      isProcessing: true,
      processMsg: '上传封面中',
    });
    e.preventDefault();
    const cover = e.target.files[0];
    if (!cover) return;
    const key = `${this.props.User.username}/setting/cover/${cover.name}`;
    const formData = new FormData();
    formData.append('file', cover);
    formData.append('key', key);
    formData.append('token', this.props.uptoken);

    $.ajax({
      method: 'POST',
      url: this.props.uploadURL,
      data: formData,
      dataType: 'json',
      contentType: false,
      processData: false,
      timeout: 5000,
    })
    .done((res) => {
      this.setState({
        isEditing: true,
        isProcessing: false,
        processMsg: '',
        cover: `${this.props.domain}/${res.key}`,
      });
      this.props.snackBarOpen('上传封面成功');
    })
    .fail((err) => {
      this.setState({
        isEditing: false,
        isProcessing: false,
        processMsg: '',
      });
      this.props.snackBarOpen('上传封面失败');
      throw new Meteor.Error(err);
    });
  }

  handleSetAvatar(e) {
    this.setState({
      isEditing: true,
      isProcessing: true,
      processMsg: '上传头像中',
    });
    e.preventDefault();
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
      formData.append('token', this.props.uptoken);

      $.ajax({
        method: 'POST',
        url: this.props.uploadURL,
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        timeout: 5000,
      })
      .done((res) => {
        const avatarSrc = `${this.props.domain}/${res.key}?imageView2/1/w/240/h/240`;
        this.setState({
          isEditing: true,
          isProcessing: false,
          processMsg: '',
          avatar: avatarSrc,
        });
        this.props.snackBarOpen('上传头像成功');
      })
      .fail((err) => {
        this.setState({
          isEditing: false,
          isProcessing: false,
          processMsg: '',
        });
        this.props.snackBarOpen('上传头像失败');
        throw new Meteor.Error(err);
      });
    }
  }

  renderEditingNavHeader() {
    return (
      <NavHeader
        User={this.props.User}
        title={this.state.isProcessing ? '上传图片中' : '修改设置中'}
        style={{ backgroundColor: blue500 }}
        iconElementLeft={
          <IconButton onTouchTap={() => this.setState({ isAlertOpen: true })}>
            <ArrowBackIcon />
          </IconButton>
        }
        iconElementRight={
          <IconButton onTouchTap={this.handleSubmit}>
            <DoneIcon />
          </IconButton>
        }
      />
    );
  }

  renderContent() {
    const { User } = this.props;
    return (
      <div className="content__setting">
        <div className="setting__header">
          <div
            className="setting__cover"
            style={{ backgroundImage: `url("${this.state.cover}")` }}
          >
            <div className="setting__background" />
            <div className="setting__uploader" onTouchTap={() => this.coverInput.click()} >
              <CameraIcon style={styles.cameraIconStyle} />
              <input
                style={{ display: 'none' }}
                type="file"
                ref={(ref) => { this.coverInput = ref; }}
                onChange={this.handleSetCover}
              />
            </div>
          </div>
          <div className="setting__avatar">
            <div className="setting__uploader" onTouchTap={() => this.avatarInput.click()}>
              <Avatar src={this.state.avatar} size={60} />
              <input
                style={{ display: 'none' }}
                type="file"
                ref={(ref) => { this.avatarInput = ref; }}
                onChange={this.handleSetAvatar}
              />
            </div>
            <h2>{User.username}</h2>
          </div>
        </div>
        <Divider />
        <div className="setting__content">
          <List className="setting__primary"> { /* General Setting */ }
            <Subheader style={{ paddingBottom: '32px' }}>基础资料</Subheader>
            <ListItem
              style={styles.liForTextFieldStyle}
              leftIcon={<PersonIcon />}
              disableKeyboardFocus
              disabled
            >
              <TextField
                style={styles.textFieldStyle}
                floatingLabelText="用户名"
                value={User.username}
                fullWidth
                disabled
              />
            </ListItem>
            <ListItem
              style={styles.liForTextFieldStyle}
              leftIcon={<EmailIcon />}
              disableKeyboardFocus
              disabled
            >
              <TextField
                style={styles.textFieldStyle}
                floatingLabelText="邮箱"
                value={(User.emails && User.emails[0].address) || '暂无邮箱'}
                fullWidth
                disabled
              />
            </ListItem>
            <ListItem
              style={styles.liForTextFieldStyle}
              leftIcon={<UserIcon />}
              disabled
            >
              <TextField
                style={styles.textFieldStyle}
                floatingLabelText="昵称"
                value={this.state.nickname}
                onChange={(e) => this.setState({ isEditing: true, nickname: e.target.value })}
                fullWidth
              />
            </ListItem>
            <ListItem
              style={styles.liForTextFieldStyle}
              leftIcon={<InboxIcon />}
              disabled
            >
              <TextField
                style={styles.textFieldStyle}
                floatingLabelText="个人简介"
                value={this.state.intro}
                onChange={(e) => this.setState({ isEditing: true, intro: e.target.value })}
                fullWidth
              />
            </ListItem>
            <ListItem
              primaryText="头像"
              secondaryText="更改默认头像"
              onTouchTap={() => this.avatarInput.click()}
            />
            <ListItem
              primaryText="封底"
              secondaryText="更改封底照片"
              onTouchTap={() => this.coverInput.click()}
            />
          </List>
          <Divider />
          <List className="setting__security"> { /* Security Setting */ }
            <Subheader>账户安全</Subheader>
            <ListItem
              primaryText="我的邮箱"
              secondaryText="查看当前邮箱信息"
              disableKeyboardFocus
              onTouchTap={() => browserHistory.push('/setting/emails')}
            />
            <ListItem
              primaryText="更改密码"
              secondaryText="通过电子邮箱更换密码"
              disableKeyboardFocus
              disabled
            />
          </List>
          <Divider />
          <List className="setting__privacy"> { /* Privacy Setting */ }
            <Subheader>隐私设置</Subheader>
            <ListItem
              leftCheckbox={
                <Checkbox
                  defaultChecked={this.state.allowVisitColl}
                  onCheck={(e, checked) => this.setState({ isEditing: true, allowVisitColl: checked })}
                />
              }
              primaryText="公开相册"
              secondaryText="是否默认公开新建相册"
            />
            <ListItem
              leftCheckbox={
                <Checkbox
                  defaultChecked={this.state.allowVisitHome}
                  onCheck={(e, checked) => this.setState({ isEditing: true, allowVisitHome: checked })}
                />
              }
              primaryText="公开主页"
              secondaryText="是否允许游客访问我的主页"
            />
          </List>
          <Divider />
          <List className="setting__perference"> { /* Perference Setting */ }
            <Subheader>偏好设置</Subheader>
            <ListItem
              primaryText="允许通知"
              rightToggle={
                <Toggle
                  defaultToggled={this.state.allowNoti}
                  toggled={this.state.allowNoti}
                  onToggle={() => this.setState({ isEditing: true, allowNoti: !this.state.allowNoti })}
                  disabled
                />
              }
            />
            <ListItem
              primaryText="允许信息"
              rightToggle={
                <Toggle
                  defaultToggled={this.state.allowMsg}
                  toggled={this.state.allowMsg}
                  onToggle={() => this.setState({ isEditing: true, allowMsg: !this.state.allowMsg })}
                  disabled
                />
              }
            />
          </List>
        </div>
        <Divider />
      </div>
    );
  }

  render() {
    const actions = [
      <FlatButton
        label="取消"
        onTouchTap={() => this.setState({ isAlertOpen: false })}
        keyboardFocused
        primary
      />,
      <FlatButton
        label="确认"
        onTouchTap={this.handleDiscard}
        primary
      />,
    ];
    return (
      <div className="container">
        { this.state.isEditing
          ? this.renderEditingNavHeader()
          : (
            <NavHeader
              User={this.props.User}
              location={this.state.location}
              primary
            />) }
        <div className="content">
          <Loader
            open={this.state.isProcessing}
            message={this.state.processMsg}
            onTimeout={() => this.props.snackBarOpen('上传超时，请重试')}
          />
          { this.props.User && this.renderContent() }
          <Dialog
            title="提示"
            titleStyle={{ border: 'none' }}
            actions={actions}
            actionsContainerStyle={{ border: 'none' }}
            open={this.state.isAlertOpen}
            autoScrollBodyContent
            modal
          >您还有尚未保存的设置，是否确认退出？
          </Dialog>
        </div>
      </div>
    );
  }

}

SettingPage.defaultProps = {
  domain: Meteor.settings.public.domain,
  uploadURL: window.location.protocol === 'https:' ? 'https://up.qbox.me/' : 'http://upload.qiniu.com',
};

SettingPage.propTypes = {
  User: PropTypes.object.isRequired,
  domain: PropTypes.string.isRequired,
  uploadURL: PropTypes.string.isRequired,
  // Below Pass from Redux
  uptoken: PropTypes.string.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
};
