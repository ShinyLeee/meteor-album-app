import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import AutoComplete from 'material-ui/AutoComplete';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import SendIcon from 'material-ui/svg-icons/content/send';
import { blue500 } from 'material-ui/styles/colors';
import { insertNote } from '/imports/api/notes/methods.js';
import NavHeader from '../components/NavHeader.jsx';
import DatePickerCN from '../components/DatePickerCN.jsx';
import { snackBarOpen } from '../actions/actionTypes.js';

const styles = {
  noteTextField: {
    marginLeft: '20px',
  },
  noteHint: {
    position: 'absolute',
    left: 0,
    top: '12px',
    color: 'rgba(0, 0, 0, 0.298039)',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
  },
  noteChip: {
    position: 'absolute',
    left: '100px',
    top: '8px',
    width: 'auto',
    height: 'auto',
    backgroundColor: '#e7e7e7',
  },
};

class SendNote extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAlertOpen: false,
      receiver: undefined,
      sendAt: new Date(),
      title: '',
      content: '',
    };
    this.handleBack = this.handleBack.bind(this);
    this.handleSent = this.handleSent.bind(this);
    this.handleChosenReceiver = this.handleChosenReceiver.bind(this);
  }

  handleBack() {
    if (this.state.content) {
      this.setState({ isAlertOpen: true });
      return;
    }
    browserHistory.goBack();
  }

  handleSent() {
    const { User, dispatch } = this.props;
    const { receiver, sendAt, title, content } = this.state;
    const sender = User._id;
    if (!receiver) {
      dispatch(snackBarOpen('请选择接受用户'));
      return;
    }
    insertNote.call({
      title,
      content,
      sender,
      receiver: receiver.id,
      sendAt,
    }, (err) => {
      if (err) {
        dispatch(snackBarOpen(err.message));
        throw new Meteor.Error(err);
      }
      browserHistory.goBack();
      dispatch(snackBarOpen('发送成功'));
    });
  }

  handleChosenReceiver(receiver) {
    this.setState({ receiver });
  }

  renderNoteContent() {
    const { otherUsers } = this.props;
    return (
      <div className="note-content">
        <AutoComplete
          hintText="发送给"
          dataSource={otherUsers || []}
          dataSourceConfig={{ text: 'username', value: 'username' }}
          filter={AutoComplete.caseInsensitiveFilter}
          underlineShow={false}
          style={styles.noteTextField}
          onNewRequest={this.handleChosenReceiver}
          fullWidth
        >
          { this.state.receiver ? (
            <div>
              <span style={styles.noteHint}>发送给</span>
              <Chip
                onRequestDelete={() => this.setState({ receiver: undefined })}
                style={styles.noteChip}
              >
                <Avatar src={this.state.receiver.avatar} />
                {this.state.receiver.username}
              </Chip>
            </div>
          ) : null }
        </AutoComplete>
        <Divider />
        <DatePickerCN
          hintText="发送时间"
          underlineShow={false}
          style={styles.noteTextField}
          minDate={this.state.sendAt}
          value={this.state.sendAt}
          onChange={(e, date) => this.setState({ sendAt: date })}
          fullWidth
        /><Divider />
        <TextField
          hintText="标题"
          underlineShow={false}
          style={styles.noteTextField}
          value={this.state.title}
          onChange={(e) => this.setState({ title: e.target.value })}
          fullWidth
        /><Divider />
        <TextField
          hintText="内容"
          underlineShow={false}
          style={styles.noteTextField}
          value={this.state.content}
          onChange={(e) => this.setState({ content: e.target.value })}
          fullWidth
          multiLine
        />
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
        onTouchTap={() => browserHistory.goBack()}
        primary
      />,
    ];
    return (
      <div className="container note-container">
        <NavHeader
          title="发送信息"
          style={{ backgroundColor: blue500 }}
          iconElementLeft={<IconButton onTouchTap={this.handleBack}><ArrowBackIcon /></IconButton>}
          iconElementRight={<IconButton onTouchTap={this.handleSent}><SendIcon /></IconButton>}
        />
        <div className="content">
          {this.renderNoteContent()}
        </div>
        <Dialog
          title="提示"
          titleStyle={{ border: 'none' }}
          actions={actions}
          actionsContainerStyle={{ border: 'none' }}
          open={this.state.isAlertOpen}
          modal={false}
        >您还有未发送的内容，是否确认退出？
        </Dialog>
      </div>
    );
  }
}

SendNote.propTypes = {
  User: PropTypes.object,
  otherUsers: PropTypes.array.isRequired,
  dispatch: PropTypes.func,
};

const MeteorContainer = createContainer(() => {
  Meteor.subscribe('Users.allUser');
  const uid = Meteor.userId();
  const otherUsers = Meteor.users.find({ _id: { $ne: uid } }).map((user) => ({
    id: user._id,
    avatar: user.profile.avatar,
    username: user.username,
  }));
  return {
    otherUsers,
  };
}, SendNote);

export default connect()(MeteorContainer);
