import React, { Component, PropTypes } from 'react';

import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import Toggle from 'material-ui/Toggle';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import CameraIcon from 'material-ui/svg-icons/image/photo-camera';
import PersonIcon from 'material-ui/svg-icons/social/person';
import EmailIcon from 'material-ui/svg-icons/communication/email';

import { updateUser } from '/imports/api/users/methods.js';

import NavHeader from '../components/NavHeader.jsx';
import displayAlert from '../lib/displayAlert.js';

const styles = {
  cameraIconStyle: {
    height: '38px',
    color: '#fff',
  },
  liForTextFieldStyle: {
    padding: '0 16px 16px 72px',
  },
  textFieldStyle: {
    marginTop: '-30px',
  },
};

export default class Setting extends Component {

  constructor(props) {
    super(props);
    const { User } = this.props;
    this.state = {
      location: 'setting',
      cover: User.profile.cover,
      avatar: User.profile.avatar,
      nickname: User.profile.nickname,
      nToggle: User.profile.settings.notification,
      mToggle: User.profile.settings.message,
    };
    this.handleTriggerCoverFile = this.handleTriggerCoverFile.bind(this);
    this.handleTriggerAvatarFile = this.handleTriggerAvatarFile.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTriggerCoverFile() {
    this.coverFile.click();
  }

  handleTriggerAvatarFile() {
    this.avatarFile.click();
  }

  handleImgChange(e, state) {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataURL = event.target.result;
      this.setState({
        [state]: dataURL,
      });
    };
    reader.readAsDataURL(file);
  }

  handleTextFieldChange(e, state) {
    this.setState({
      [state]: e.target.value,
    });
  }

  handleToggle(state) {
    this.setState({
      [state]: !this.state[state],
    });
  }

  handleSubmit() {
    updateUser.call({
      nickname: this.state.nickname,
      cover: this.state.cover,
      avatar: this.state.avatar,
      settings: {
        notification: this.state.nToggle,
        message: this.state.mToggle,
      },
    }, (err) => {
      if (err) {
        displayAlert('error', err.reason);
        return false;
      }
      displayAlert('success', 'user.setting.success');
      return true;
    });
  }

  render() {
    const { User } = this.props;
    return (
      <div className="container">
        <NavHeader User={User} location={this.state.location} primary />
        <div className="content">
          <div className="setting-holder">
            <div className="setting-upload">
              <div className="setting-cover">
                <img src={this.state.cover} alt="User-Cover" />
                <div className="setting-cover-upload" onTouchTap={this.handleTriggerCoverFile} >
                  <CameraIcon style={styles.cameraIconStyle} />
                  <input
                    style={{ display: 'none' }}
                    type="file"
                    ref={(ref) => { this.coverFile = ref; }}
                    onChange={(e) => { this.handleImgChange(e, 'cover'); }}
                  />
                </div>
              </div>
              <div className="setting-avatar">
                <div className="setting-avatar-upload" onTouchTap={this.handleTriggerAvatarFile}>
                  <Avatar src={this.state.avatar} size={60} />
                  <input
                    style={{ display: 'none' }}
                    type="file"
                    ref={(ref) => { this.avatarFile = ref; }}
                    onChange={(e) => { this.handleImgChange(e, 'avatar'); }}
                  />
                </div>
                <h2>{User.username}</h2>
              </div>
            </div>
            <Divider />
            <List> { /* General Setting */ }
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
                  value={User.emails[0].address}
                />
              </ListItem>
              <ListItem
                style={styles.liForTextFieldStyle}
                leftIcon={<PersonIcon />}
                disabled
              >
                <TextField
                  style={styles.textFieldStyle}
                  floatingLabelText="昵称"
                  value={this.state.nickname || ''}
                  onChange={(e) => { this.handleTextFieldChange(e, 'nickname'); }}
                />
              </ListItem>
              <ListItem
                primaryText="头像"
                secondaryText="更改默认头像"
                onTouchTap={this.handleTriggerAvatarFile}

              />
              <ListItem
                primaryText="封底"
                secondaryText="更改封底照片"
                onTouchTap={this.handleTriggerCoverFile}
              />
              <ListItem
                primaryText="关联"
                secondaryText="关联独一用户"
              />
            </List>
            <Divider />
            <List> { /* Security Setting */ }
              <Subheader>账户安全</Subheader>
              <ListItem
                primaryText="更改密码"
                secondaryText="通过电子邮箱更换密码"
              />
              <ListItem
                primaryText="状态"
                secondaryText="查看当前账号详细信息"
              />
              <ListItem
                primaryText="Wechat"
                secondaryText="关联微信账号"
              />
            </List>
            <Divider />
            <List> { /* Perference Setting */ }
              <Subheader>偏好设置</Subheader>
              <ListItem
                primaryText="是否接受通知"
                rightToggle={
                  <Toggle
                    defaultToggled={this.state.nToggle}
                    toggled={this.state.nToggle}
                    onToggle={() => this.handleToggle('nToggle')}
                  />
                }
              />
              <ListItem
                primaryText="是否接受信息"
                rightToggle={
                  <Toggle
                    defaultToggled={this.state.mToggle}
                    toggled={this.state.mToggle}
                    onToggle={() => this.handleToggle('mToggle')}
                  />
                }
              />
            </List>
            <Divider />
            <List>
              <Subheader>Hangout Notifications</Subheader>
              <ListItem
                leftCheckbox={<Checkbox />}
                primaryText="Notifications"
                secondaryText="Allow notifications"
              />
              <ListItem
                leftCheckbox={<Checkbox />}
                primaryText="Sounds"
                secondaryText="Hangouts message"
              />
              <ListItem
                leftCheckbox={<Checkbox />}
                primaryText="Video sounds"
                secondaryText="Hangouts video call"
              />
            </List>
            <Divider />
          </div>
          <div className="setting-save">
            <RaisedButton
              style={{ width: '100%' }}
              onTouchTap={this.handleSubmit}
              label="保存"
              primary
            />
          </div>
        </div>
      </div>
    );
  }

}

Setting.propTypes = {
  User: PropTypes.object,
};
