import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

// For Dropdown Menus
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';

// For Modal Dialog
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
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

import NavHeader from '../components/NavHeader.jsx';
import displayAlert from '../lib/displayAlert.js';

import { insertNote } from '../../api/notes/methods.js';

class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: 'user',
      notePage: true,
      likedPage: false,
      relateModal: false,
      noteModal: false,
      relater: undefined,
      title: undefined,
      content: undefined,
      sender: Meteor.userId(),
      receiver: undefined,
      sendAt: undefined,
    };
    this.getUsernames = this.getUsernames.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleAddFriend = this.handleAddFriend.bind(this);
    this.handleSendNotes = this.handleSendNotes.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.relateSubmit = this.relateSubmit.bind(this);
    this.noteSubmit = this.noteSubmit.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleRelaterChange = this.handleRelaterChange.bind(this);
    this.handleReceiverChange = this.handleReceiverChange.bind(this);
    this.handleSendDateChange = this.handleSendDateChange.bind(this);
    this.handleChildCompChange = this.handleChildCompChange.bind(this);
  }

  getUsernames() {
    const { filterUser } = this.props;
    const usernames = filterUser.map((user) => user.username);
    return usernames;
  }

  handleLogout() {
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

  handleAddFriend() {
    this.setState({ relateModal: true });
  }

  handleSendNotes() {
    this.setState({ noteModal: true });
  }

  handleClose() {
    this.setState({
      relateModal: false,
      noteModal: false,
    });
  }

  relateSubmit() {
    // const relater = this.state.receiver;
    // Meteor.call('users.relate', relater);
  }

  noteSubmit() {
    if (!this.state.receiver) {
      displayAlert('error', 'note.send.receiverNotFound');
      return;
    }
    insertNote.call({
      title: this.state.title,
      content: this.state.content,
      sender: this.state.sender,
      receiver: this.state.receiver,
      sendAt: this.state.sendAt || new Date(),
    }, (err) => {
      if (err) {
        displayAlert('error', err.message);
        return false;
      }
      this.handleClose();
      displayAlert('success', 'note.send.success');
      return true;
    });
  }

  handleTextFieldChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleRelaterChange(value) {
    const { filterUser } = this.props;
    let relater;
    filterUser.forEach((user) => {
      if (user.username === value) {
        relater = user.uid;
      }
      return true;
    });
    this.setState({
      relater,
    });
  }

  handleReceiverChange(value) {
    const { filterUser } = this.props;
    let receiver;
    filterUser.forEach((user) => {
      if (user.username === value) {
        receiver = user.uid;
      }
      return true;
    });
    this.setState({
      receiver,
    });
  }

  handleSendDateChange(e, date) {
    this.setState({
      sendAt: date,
    });
  }

  handleChildCompChange() {
    this.setState({
      notePage: !this.state.notePage,
      likedPage: !this.state.likedPage,
    });
  }

  render() {
    const { curUser, userIsReady } = this.props;
    if (!userIsReady) {
      return (
        <div className="container">
          <NavHeader location={this.state.location} />
          <div className="content text-center">
            <CircularProgress style={{ top: '150px' }} size={1} />
          </div>
        </div>
      );
    }
    const isNotePage = classnames('user-note', {
      highlight: this.state.notePage,
    });
    const isLikedPage = classnames('user-liked', {
      highlight: this.state.likedPage,
    });
    const customeTextFieldStyle = {
      marginLeft: 20,
    };
    const customModalContentStyle = {
      width: '100%',
      maxWidth: 'none',
    };
    const relateModalActions = [
      <FlatButton label="取消" onTouchTap={this.handleClose} primary />,
      <FlatButton label="申请关联" onTouchTap={this.relateSubmit} primary />,
    ];
    const noteModalActions = [
      <FlatButton label="取消" onTouchTap={this.handleClose} primary />,
      <FlatButton label="确定发送" onTouchTap={this.noteSubmit} primary />,
    ];
    return (
      <div className="container">
        <NavHeader
          User={curUser}
          location={this.state.location}
        />
        <div className="content">
          <div className="user-holder">
            <div className="user-panel">
              <div className="user-header">
                <div className="user-avatar">
                  <img src={curUser.profile.avatar} alt="user-avatar" />
                  <div className="user-action">
                    <IconMenu
                      iconButtonElement={<IconButton><MoreHorizIcon color="#999" /></IconButton>}
                      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                      targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem
                        primaryText="账号设置"
                        containerElement={<Link to={'/setting'} />}
                        leftIcon={<SettingsIcon />}
                      />
                      <MenuItem
                        primaryText="关联用户"
                        leftIcon={<PersonAddIcon />}
                        onTouchTap={this.handleAddFriend}
                      />
                      <MenuItem
                        primaryText="发送信息"
                        leftIcon={<MessageIcon />}
                        onTouchTap={this.handleSendNotes}
                      />
                      <MenuItem
                        primaryText="帮助"
                        containerElement={<Link to={'/help'} />}
                        leftIcon={<HelpIcon />}
                      />
                      <MenuItem
                        primaryText="登出"
                        leftIcon={<ExitToAppIcon />}
                        onTouchTap={this.handleLogout}
                      />
                    </IconMenu>
                  </div>
                </div>
                <div className="user-name">
                  <h1>{curUser.username}</h1>
                </div>
              </div>
            </div>
            <div className="user-info">
              <Link
                className={isNotePage}
                to="/user/notes"
                onClick={this.handleChildCompChange}
              >
                <span>{curUser.profile.notes}</span>
                <span>Notes</span>
              </Link>
              <Link
                className={isLikedPage}
                to="/user/liked"
                onClick={this.handleChildCompChange}
              >
                <span>{curUser.profile.likes}</span>
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
                onRequestClose={this.handleClose}
              >
                <AutoComplete
                  onNewRequest={this.handleRelaterChange}
                  onUpdateInput={this.handleRelaterChange}
                  floatingLabelText="用户名"
                  filter={AutoComplete.caseInsensitiveFilter}
                  dataSource={this.getUsernames()}
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
                onRequestClose={this.handleClose}
              >
                <TextField
                  onChange={this.handleTextFieldChange}
                  name="title"
                  type="text"
                  floatingLabelText="标题"
                  style={customeTextFieldStyle}
                  underlineShow={false}
                  fullWidth
                />
                <Divider />
                <TextField
                  onChange={this.handleTextFieldChange}
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
                  onNewRequest={this.handleReceiverChange}
                  onUpdateInput={this.handleReceiverChange}
                  floatingLabelText="接收者"
                  style={customeTextFieldStyle}
                  underlineShow={false}
                  filter={AutoComplete.caseInsensitiveFilter}
                  dataSource={this.getUsernames()}
                  openOnFocus
                  fullWidth
                />
                <Divider />
                <DatePicker
                  onChange={this.handleSendDateChange}
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
          { React.cloneElement(this.props.children, { User: curUser }) }
        </div>
      </div>

    );
  }

}

User.propTypes = {
  curUser: PropTypes.object,
  userIsReady: PropTypes.bool.isRequired,
  filterUser: PropTypes.array,
  children: PropTypes.element.isRequired,
};

// If contextTypes is not defined, then context will be an empty object.
User.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('registerUser');
  const uid = Meteor.userId();
  const registerUsers = Meteor.users.find({}).fetch();
  const filterUser = [];
  const curUser = Meteor.user();
  const userIsReady = !!curUser;
  registerUsers.forEach(user => {
    if (user._id === uid) return false;
    filterUser.push({
      uid: user._id,
      username: user.username,
    });
    return true;
  });
  return {
    curUser,
    userIsReady,
    filterUser,
  };
}, User);
