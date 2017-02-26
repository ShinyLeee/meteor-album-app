import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import Delta from 'quill-delta';
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
import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import QuillEditor from '/imports/ui/components/Quill/QuillEditor.jsx';
import DatePickerCN from '/imports/ui/components/SubMaterialUI/DatePickerCN.jsx';
import Loader from '/imports/ui/components/Loader/Loader.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';
import styles from './SendNote.style.js';

export default class SendNotePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      processMsg: '',
      isAlertOpen: false,
      receiver: props.initialReceiver,
      title: '',
      content: '',
      sendAt: new Date(),
    };
    this.handleGoBack = this.handleGoBack.bind(this);
    this.handleSentNote = this.handleSentNote.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.initialReceiver && nextProps.initialReceiver) {
      this.setState({ receiver: nextProps.initialReceiver });
    }
  }

  get quillModulesConfig() {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'blockquote', { align: [false, 'center', 'right'] }],
          ['link', 'image'],
        ],
        handlers: {
          image: this.imageHandler,
        },
      },
    };
  }

  imageHandler() {
    // add limit image size feature to quill default image handler
    let fileInput = this.container.querySelector('input.ql-image[type=file]');
    if (fileInput == null) {
      const img = document.createElement('img');
      fileInput = document.createElement('input');
      fileInput.setAttribute('type', 'file');
      fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon, image/svg+xml');
      fileInput.classList.add('ql-image');
      fileInput.addEventListener('change', () => {
        if (fileInput.files != null && fileInput.files[0] != null) {
          const reader = new FileReader();
          reader.onload = (e) => {
            img.src = e.target.result;
            fileInput.value = '';

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 600;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
            canvas.width = width;
            canvas.height = height;
            const nCtx = canvas.getContext('2d');
            nCtx.drawImage(img, 0, 0, width, height);

            const dataUrl = canvas.toDataURL('image/jpeg');
            const range = this.quill.getSelection(true);
            this.quill.updateContents(new Delta()
              .retain(range.index)
              .delete(range.length)
              .insert({ image: dataUrl })
            , 'user');
          };
          reader.readAsDataURL(fileInput.files[0]);
        }
      });
      this.container.appendChild(fileInput);
    }
    fileInput.click();
  }

  handleGoBack() {
    if (this.state.content) {
      this.setState({ isAlertOpen: true });
      return;
    }
    browserHistory.goBack();
  }

  handleSentNote() {
    if (!this.state.receiver) {
      this.props.snackBarOpen('请选择接受用户');
      return;
    }
    this.setState({ isProcessing: true, processMsg: '发送信息中' });
    insertNote.callPromise({
      title: this.state.title,
      content: this.state.content,
      sender: this.props.User.username,
      receiver: this.state.receiver.username,
      sendAt: this.state.sendAt,
      createdAt: new Date(),
    })
    .then(() => {
      // because go to another component so we do not need set inital state
      browserHistory.goBack();
      this.props.snackBarOpen('发送成功');
    })
    .catch((err) => {
      this.setState({ isProcessing: false, processMsg: '' });
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen(err.reason || '发送失败');
      throw new Meteor.Error(err);
    });
  }

  renderContent() {
    return (
      <div className="content__sendNote">
        <AutoComplete
          hintText="发送给"
          maxSearchResults={5}
          dataSource={this.props.otherUsers || []}
          dataSourceConfig={{ text: 'username', value: 'username' }}
          filter={AutoComplete.caseInsensitiveFilter}
          underlineShow={false}
          style={styles.noteTextField}
          onNewRequest={(receiver) => this.setState({ receiver })}
          fullWidth
        >
          { this.state.receiver && (
            <div>
              <span style={styles.noteHint}>发送给</span>
              <Chip
                onRequestDelete={() => this.setState({ receiver: null })}
                style={styles.noteChip}
              >
                <Avatar src={this.state.receiver.profile.avatar} />
                {this.state.receiver.username}
              </Chip>
            </div>
          )
        }
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
        <QuillEditor
          placeholder="内容"
          modules={this.quillModulesConfig}
          onChange={(outline, content) => this.setState({ content })}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <NavHeader
          title="发送信息"
          style={{ backgroundColor: blue500 }}
          iconElementLeft={<IconButton onTouchTap={this.handleGoBack}><ArrowBackIcon /></IconButton>}
          iconElementRight={<IconButton onTouchTap={this.handleSentNote}><SendIcon /></IconButton>}
        />
        <main className="content">
          <Loader
            open={this.state.isProcessing}
            message={this.state.processMsg}
          />
          {
            this.props.dataIsReady
            ? this.renderContent()
            : (<Loading />)
          }
          <Dialog
            title="提示"
            titleStyle={{ border: 'none' }}
            actions={[
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
            ]}
            actionsContainerStyle={{ border: 'none' }}
            open={this.state.isAlertOpen}
            modal={false}
          >您还有未发送的内容，是否确认退出？
          </Dialog>
        </main>
      </div>
    );
  }
}

SendNotePage.displayName = 'SendNotePage';

SendNotePage.propTypes = {
  User: PropTypes.object,
  // Below Pass from Database
  dataIsReady: PropTypes.bool.isRequired,
  initialReceiver: PropTypes.object,
  otherUsers: PropTypes.array.isRequired,
  // Below Pass from Redux
  snackBarOpen: PropTypes.func.isRequired,
};
