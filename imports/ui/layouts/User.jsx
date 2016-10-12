import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// For Dropdown Menus
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';

// For Modal Dialog
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import HelpIcon from 'material-ui/svg-icons/action/help-outline';
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';
import PersonAddIcon from 'material-ui/svg-icons/social/person-add';
import MessageIcon from 'material-ui/svg-icons/communication/message';

import { Link } from 'react-router';

import displayAlert from '../lib/displayAlert.js';
import defaultUser from '../lib/defaultUser.js';

class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      relateModal: false,
      noteModal: false,
      relater: null,
      title: '',
      content: '',
      sender: Meteor.userId(),
      receiver: null,
      sendAt: new Date(),
    };
    this._handleLogout = this._handleLogout.bind(this);
    this._handleAddFriend = this._handleAddFriend.bind(this);
    this._handleSendNotes = this._handleSendNotes.bind(this);
    this._handleClose = this._handleClose.bind(this);
    this._relateSubmit = this._relateSubmit.bind(this);
    this._noteSubmit = this._noteSubmit.bind(this);
    this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
    this._handleRelaterChange = this._handleRelaterChange.bind(this);
    this._handleReceiverChange = this._handleReceiverChange.bind(this);
    this._handleSendDateChange = this._handleSendDateChange.bind(this);
    this._getUsernames = this._getUsernames.bind(this);
  }

  _getUsernames() {
    const { filterUser } = this.props;
    const usernames = filterUser.map((user) => user.username);
    return usernames;
  }

  _handleLogout() {
    Meteor.logout((err) => {
      if (err) {
        displayAlert('error', 'user.logout.unexpectedError');
        return console.error(err); // TODO LOG
      }
      this.context.router.replace('/login');
      displayAlert('success', 'user.logout.success');
      return true;
    });
  }

  _handleAddFriend() {
    this.setState({ relateModal: true });
  }

  _handleSendNotes() {
    this.setState({ noteModal: true });
  }

  _handleClose() {
    this.setState({
      relateModal: false,
      noteModal: false,
    });
  }

  _relateSubmit() {
    // const relater = this.state.receiver;
    // Meteor.call('users.relate', relater);
  }

  _noteSubmit() {
    const sendData = {
      title: this.state.title,
      content: this.state.content,
      sender: this.state.sender,
      receiver: this.state.receiver,
      sendAt: this.state.sendAt,
    };
    Meteor.call('notes.insert', sendData);
    this._handleClose();
    displayAlert('success', 'note.send.success');
  }

  _handleTextFieldChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  _handleRelaterChange(searchText) {
    const { filterUser } = this.props;
    let relater;
    filterUser.forEach((user) => {
      if (user.username === searchText) {
        relater = user.uid;
      }
      return true;
    });
    this.setState({
      relater,
    });
  }

  _handleReceiverChange(searchText) {
    const { filterUser } = this.props;
    let receiver;
    filterUser.forEach((user) => {
      if (user.username === searchText) {
        receiver = user.uid;
      }
      return true;
    });
    this.setState({
      receiver,
    });
  }

  _handleSendDateChange(e, date) {
    this.setState({
      sendAt: date,
    });
  }

  render() {
    const customeTextFieldStyle = {
      marginLeft: 20,
    };
    const customModalContentStyle = {
      width: '100%',
      maxWidth: 'none',
    };
    const relateModalActions = [
      <FlatButton label="取消" onTouchTap={this._handleClose} primary />,
      <FlatButton label="申请关联" onTouchTap={this._relateSubmit} primary />,
    ];
    const noteModalActions = [
      <FlatButton label="取消" onTouchTap={this._handleClose} primary />,
      <FlatButton label="确定发送" onTouchTap={this._noteSubmit} primary />,
    ];

    return (
      <div className="content">
        <div className="user-holder">
          <div className="user-panel">
            <div className="user-header">
              <div className="user-avatar">
                <img src={this.props.User.profile.avatar} alt="user-avatar" />
                <div className="user-action">
                  <IconMenu
                    iconButtonElement={<IconButton><MoreHorizIcon color="#999" /></IconButton>}
                    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                    targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem
                      primaryText="账号设置"
                      containerElement={<Link to={'/user/settings'} />}
                      leftIcon={<SettingsIcon />}
                    />
                    <MenuItem
                      primaryText="关联用户"
                      leftIcon={<PersonAddIcon />}
                      onTouchTap={this._handleAddFriend}
                    />
                    <MenuItem
                      primaryText="发送信息"
                      leftIcon={<MessageIcon />}
                      onTouchTap={this._handleSendNotes}
                    />
                    <MenuItem
                      primaryText="帮助"
                      containerElement={<Link to={'/help'} />}
                      leftIcon={<HelpIcon />}
                    />
                    <MenuItem
                      primaryText="登出"
                      leftIcon={<ExitToAppIcon />}
                      onTouchTap={this._handleLogout}
                    />
                  </IconMenu>
                </div>
              </div>
              <div className="user-name">
                <h1>{this.props.User.username}</h1>
              </div>
            </div>
          </div>
          <div className="user-info">
            <Link className="user-note" to="/user/notes">
              <span>{this.props.User.profile.notes}</span>
              <span>Notes</span>
            </Link>
            <Link className="user-like" to="/user/liked">
              <span>{this.props.User.profile.likes}</span>
              <span>Liked</span>
            </Link>
          </div>
          <div className="user-modal">
            <Dialog
              title="关联"
              actions={relateModalActions}
              modal={false}
              open={this.state.relateModal}
              contentStyle={customModalContentStyle}
              onRequestClose={this._handleClose}
            >
              <AutoComplete
                onNewRequest={this._handleRelaterChange}
                floatingLabelText="用户名"
                filter={AutoComplete.caseInsensitiveFilter}
                dataSource={this._getUsernames()}
              />
              <br />
              注: 请关联你的男朋友或者女朋友
            </Dialog>
            <Dialog
              title="发送信息"
              actions={noteModalActions}
              modal={false}
              open={this.state.noteModal}
              contentStyle={customModalContentStyle}
              onRequestClose={this._handleClose}
            >
              <TextField
                onChange={this._handleTextFieldChange}
                name="title"
                type="text"
                floatingLabelText="标题"
                style={customeTextFieldStyle}
                underlineShow={false}
                fullWidth
              />
              <Divider />
              <TextField
                onChange={this._handleTextFieldChange}
                name="content"
                type="text"
                floatingLabelText="内容"
                style={customeTextFieldStyle}
                underlineShow={false}
                rows={1}
                rowsMax={2}
                fullWidth
                multiLine
              />
              <Divider />
              <AutoComplete
                onNewRequest={this._handleReceiverChange}
                floatingLabelText="接受者"
                style={customeTextFieldStyle}
                underlineShow={false}
                filter={AutoComplete.caseInsensitiveFilter}
                dataSource={this._getUsernames()}
                openOnFocus
                fullWidth
              />
              <Divider />
              <DatePicker
                onChange={this._handleSendDateChange}
                floatingLabelText="发送时间"
                style={customeTextFieldStyle}
                underlineShow={false}
                defaultDate={this.state.sendAt}
                value={this.state.sendAt}
              />
              <Divider />
              <br />
            </Dialog>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }

}

User.propTypes = {
  filterUser: PropTypes.array,
  User: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

// If contextTypes is not defined, then context will be an empty object.
User.contextTypes = {
  router: PropTypes.object.isRequired,
};

const MeteorContainer = createContainer(() => {
  Meteor.subscribe('registerUser');
  const uid = Meteor.userId();
  const registerUsers = Meteor.users.find({}).fetch();
  const filterUser = [];
  registerUsers.forEach(user => {
    if (user._id === uid) return false;
    filterUser.push({
      uid: user._id,
      username: user.username,
    });
    return true;
  });
  return {
    filterUser,
  };
}, User);

const mapStateToProps = (state) => ({
  User: state.user || defaultUser,
});

export default connect(mapStateToProps)(MeteorContainer);
