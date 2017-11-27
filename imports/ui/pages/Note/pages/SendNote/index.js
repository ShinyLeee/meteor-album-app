import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import SendIcon from 'material-ui-icons/Send';
import { insertNote } from '/imports/api/notes/methods';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import Modal from '/imports/ui/components/Modal';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncSendNoteContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

export default class SendNotePage extends Component {
  static propTypes = {
    User: PropTypes.object.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this._note = {};
  }

  shouldComponentUpdate() {
    return false;
  }

  _handleGoBack = () => {
    if (this._note.content) {
      Modal.showPrompt({
        message: '您还有未发送的内容，是否确认退出？',
        onCancel: Modal.close,
        onConfirm: () => {
          Modal.close();
          this.props.history.goBack();
        },
      });
      return;
    }
    this.props.history.goBack();
  }

  _handleSentNote = async () => {
    const note = this._note;
    if (!note.receiver) {
      this.props.snackBarOpen('请选择接受用户');
      return;
    }
    try {
      await Modal.showLoader('发送信息中');
      await insertNote.callPromise({
        title: note.title,
        content: note.content,
        sender: this.props.User.username,
        receiver: note.receiver,
        sendAt: new Date() || note.sendAt, // TODO remove Date Picker temporary
        createdAt: new Date(),
      });
      Modal.close();
      this.props.history.goBack();
      this.props.snackBarOpen('发送成功');
    } catch (err) {
      console.warn(err);
      Modal.close();
      this.props.snackBarOpen(`发送失败 ${err.reason}`);
    }
  }

  _handleNoteChange = (note) => {
    this._note = note;
  }

  render() {
    return (
      <ViewLayout
        Topbar={
          <SecondaryNavHeader
            title="发送信息"
            Left={<IconButton color="contrast" onClick={this._handleGoBack}><ArrowBackIcon /></IconButton>}
            Right={<IconButton color="contrast" onClick={this._handleSentNote}><SendIcon /></IconButton>}
          />
        }
      >
        <AsyncSendNoteContent onNoteChange={this._handleNoteChange} />
      </ViewLayout>
    );
  }
}
