import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import SendIcon from 'material-ui-icons/Send';
import { insertNote } from '/imports/api/notes/methods';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import { ModalActions, ModalLoader } from '/imports/ui/components/Modal/Common';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncSendNoteContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

export default class SendNotePage extends Component {
  static propTypes = {
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this._note = {};
  }

  _handleGoBack = () => {
    if (this._note.content) {
      this.renderPrompt();
      return;
    }
    this.props.history.goBack();
  }

  _handleSentNote = () => {
    const note = this._note;
    if (!note.receiver) {
      this.props.snackBarOpen('请选择接受用户');
      return;
    }
    this.renderLoadModal('发送信息中');
    insertNote.callPromise({
      title: note.title,
      content: note.content,
      receiver: note.receiver,
      sendAt: new Date() || note.sendAt, // TODO remove Date Picker temporary
      createdAt: new Date(),
    })
      .then(() => {
      // because go to another component so we do not need set inital state
        this.props.history.goBack();
        this.props.snackBarOpen('发送成功');
      })
      .catch((err) => {
        console.log(err);
        this.props.modalClose();
        this.props.snackBarOpen(`发送失败 ${err.reason}`);
      });
  }

  _handleNoteChange = (note) => {
    this._note = note;
  }

  renderPrompt = () => {
    this.props.modalOpen({
      title: '提示',
      content: '您还有未发送的内容，是否确认退出？',
      actions: (
        <ModalActions
          sClick={this.props.modalClose}
          pClick={() => {
            this.props.modalClose();
            this.props.history.goBack();
          }}
        />
      ),
    });
  }

  renderLoadModal = (message, errMsg = '请求超时') => {
    this.props.modalOpen({
      content: <ModalLoader message={message} errMsg={errMsg} />,
      ops: { ignoreBackdropClick: true },
    });
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
