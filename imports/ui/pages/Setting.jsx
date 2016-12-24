import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
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
import LinearProgress from 'material-ui/LinearProgress';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import DoneIcon from 'material-ui/svg-icons/action/done';
import CameraIcon from 'material-ui/svg-icons/image/photo-camera';
import PersonIcon from 'material-ui/svg-icons/social/person';
import UserIcon from 'material-ui/svg-icons/action/account-box';
import InboxIcon from 'material-ui/svg-icons/content/inbox';
import EmailIcon from 'material-ui/svg-icons/communication/email';
import { blue500 } from 'material-ui/styles/colors';
import { Notes } from '/imports/api/notes/note.js';
import { updateUser } from '/imports/api/users/methods.js';
import NavHeader from '../components/NavHeader.jsx';
import { snackBarOpen } from '../actions/actionTypes.js';

const domain = Meteor.settings.public.domain;
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
  indeterminateProgress: {
    position: 'fixed',
    backgroundColor: 'none',
    zIndex: 99,
  },
};

let initialSettings;

class SettingPage extends Component {

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
    this.setState(initialSettings);
  }

  handleSubmit() {
    const { dispatch } = this.props;
    updateUser.call({
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
        dispatch(snackBarOpen('设置保存失败'));
        throw new Meteor.Error(err);
      }
      dispatch(snackBarOpen('设置保存成功'));
      this.setState({ isEditing: false });
    });
  }

  handleSetCover(e) {
    this.setState({ isEditing: true, isProcessing: true });
    e.preventDefault();
    const { User, uptoken, uploadURL, dispatch } = this.props;
    const cover = e.target.files[0];
    if (!cover) return;
    const key = `${User.username}/setting/cover/${cover.name}`;
    const formData = new FormData();
    formData.append('file', cover);
    formData.append('key', key);
    formData.append('token', uptoken);

    $.ajax({
      method: 'POST',
      url: uploadURL,
      data: formData,
      dataType: 'json',
      contentType: false,
      processData: false,
    })
    .done((res) => {
      this.setState({ isEditing: true, isProcessing: false, cover: `${domain}/${res.key}` });
    })
    .fail((err) => {
      this.setState({ isEditing: false, isProcessing: false });
      dispatch(snackBarOpen('上传封面失败'));
      throw new Meteor.Error(err);
    });
  }

  handleSetAvatar(e) {
    this.setState({ isEditing: true, isProcessing: true });
    const { User, uptoken, uploadURL, dispatch } = this.props;
    e.preventDefault();
    const avatar = e.target.files[0];
    const size = Math.round(avatar.size / 1024);
    if (size < 200) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataURL = event.target.result;
        this.setState({ isEditing: true, isProcessing: false, avatar: dataURL });
      };
      reader.readAsDataURL(avatar);
    } else {
      const key = `${User.username}/setting/avatar/${avatar.name}`;
      const formData = new FormData();
      formData.append('file', avatar);
      formData.append('key', key);
      formData.append('token', uptoken);

      $.ajax({
        method: 'POST',
        url: uploadURL,
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
      })
      .done((res) => {
        const avatarSrc = `${domain}/${res.key}?imageView2/1/w/240/h/240`;
        this.setState({ isEditing: true, isProcessing: false, avatar: avatarSrc });
      })
      .fail((err) => {
        this.setState({ isEditing: false, isProcessing: false });
        dispatch(snackBarOpen('上传头像失败'));
        throw new Meteor.Error(err);
      });
    }
  }

  renderEditingNavHeader() {
    const { User } = this.props;
    return (
      <NavHeader
        User={User}
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

  renderSettingContent() {
    const { User } = this.props;
    return (
      <div className="setting-content">
        <div className="setting-upload">
          <div
            className="setting-cover"
            style={{ backgroundImage: `url(${this.state.cover})` }}
          >
            <div className="setting-cover-background" />
            <div className="setting-cover-upload" onTouchTap={() => this.coverInput.click()} >
              <CameraIcon style={styles.cameraIconStyle} />
              <input
                style={{ display: 'none' }}
                type="file"
                ref={(ref) => { this.coverInput = ref; }}
                onChange={this.handleSetCover}
              />
            </div>
          </div>
          <div className="setting-avatar">
            <div className="setting-avatar-upload" onTouchTap={() => this.avatarInput.click()}>
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
              value={(User.emails && User.emails[0].address) || '暂无邮箱'}
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
        <List> { /* Security Setting */ }
          <Subheader>账户安全(暂未开放)</Subheader>
          <ListItem
            primaryText="更改密码"
            secondaryText="通过电子邮箱更换密码"
            disableKeyboardFocus
            disabled
          />
          <ListItem
            primaryText="账号信息"
            secondaryText="查看当前账号详细信息"
            disableKeyboardFocus
            disabled
          />
          <ListItem
            primaryText="WeChat"
            secondaryText="关联微信账号"
            disableKeyboardFocus
            disabled
          />
        </List>
        <Divider />
        <List> { /* Privacy Setting */ }
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
        <List> { /* Perference Setting */ }
          <Subheader>偏好设置</Subheader>
          <ListItem
            primaryText="允许通知"
            rightToggle={
              <Toggle
                defaultToggled={this.state.allowNoti}
                toggled={this.state.allowNoti}
                onToggle={() => this.setState({ isEditing: true, allowNoti: !this.state.allowNoti })}
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
              />
            }
          />
        </List>
        <Divider />
      </div>
    );
  }

  render() {
    const { User, noteNum } = this.props;
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
          : (<NavHeader User={User} location={this.state.location} noteNum={noteNum} primary />) }
        <div className="content">
          { this.state.isProcessing && <LinearProgress style={styles.indeterminateProgress} mode="indeterminate" /> }
          { User && this.renderSettingContent() }
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
  uploadURL: window.location.protocol === 'https:' ? 'https://up.qbox.me/' : 'http://upload.qiniu.com',
};

SettingPage.propTypes = {
  uptoken: PropTypes.string,
  uploadURL: PropTypes.string.isRequired,
  User: PropTypes.object,
  noteNum: PropTypes.number.isRequired,
  dispatch: PropTypes.func,
};

const mapStateToProps = (state) => ({
  uptoken: state.uptoken,
});

const MeteorContainer = createContainer(() => {
  Meteor.subscribe('Notes.own');
  const noteNum = Notes.find({ isRead: { $ne: true } }).count();
  return {
    noteNum,
  };
}, SettingPage);

export default connect(mapStateToProps)(MeteorContainer);
