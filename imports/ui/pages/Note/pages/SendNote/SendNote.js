import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Delta from 'quill-delta';
// TODO
// import Avatar from 'material-ui/Avatar';
// import Chip from 'material-ui/Chip';
import { withStyles } from 'material-ui/styles';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import SendIcon from 'material-ui-icons/Send';
import { insertNote } from '/imports/api/notes/methods.js';
import RootLayout from '/imports/ui/layouts/RootLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import { QuillEditor } from '/imports/ui/components/Quill';
// TODO
// import DatePickerCN from '/imports/ui/components/SubMaterialUI/DatePickerCN.jsx';
import { CircleLoader } from '/imports/ui/components/Loader';
import AutocompleteWrapper from './components/Autocomplete';

class SendNotePage extends Component {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    initialReceiver: PropTypes.object,
    otherUsers: PropTypes.array.isRequired,
    User: PropTypes.object.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  static defaultProps = {
    otherUsers: [],
  }

  state = {
    isProcessing: false,
    processMsg: '',
    isAlertOpen: false,
    receiver: '',
    title: '',
    content: '',
    sendAt: new Date(),
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.initialReceiver !== nextProps.initialReceiver) {
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

  _handleGoBack = () => {
    if (this.state.content) {
      this.setState({ isAlertOpen: true });
      return;
    }
    this.props.history.goBack();
  }

  _handleSentNote = () => {
    console.log(this.state.receiver);
    if (!this.state.receiver) {
      this.props.snackBarOpen('请选择接受用户');
      return;
    }
    this.setState({ isProcessing: true, processMsg: '发送信息中' });
    insertNote.callPromise({
      title: this.state.title,
      content: this.state.content,
      sender: this.props.User.username,
      receiver: this.state.receiver,
      sendAt: new Date() || this.state.sendAt, // TODO remove Date Picker temporary
      createdAt: new Date(),
    })
    .then(() => {
      // because go to another component so we do not need set inital state
      this.props.history.goBack();
      this.props.snackBarOpen('发送成功');
    })
    .catch((err) => {
      console.log(err);
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(`发送失败 ${err.reason}`);
    });
  }

  renderContent() {
    const { classes, otherUsers } = this.props;
    return (
      <div className="content__sendNote">
        <AutocompleteWrapper
          value={this.state.receiver}
          data={otherUsers}
          onChange={(value) => this.setState({ receiver: value })}
          onComplete={(value) => this.setState({ receiver: value })}
        />
        {/* <AutoComplete
          hintText="发送给"
          maxSearchResults={5}
          dataSource={otherUsers || []}
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
        </AutoComplete> */}
        <Divider />
        {/* <DatePickerCN
          hintText="发送时间"
          underlineShow={false}
          style={styles.noteTextField}
          minDate={this.state.sendAt}
          value={this.state.sendAt}
          onChange={(e, date) => this.setState({ sendAt: date })}
          fullWidth
        /><Divider /> */}
        <Input
          className={classes.input}
          placeholder="标题"
          value={this.state.title}
          onChange={(e) => this.setState({ title: e.target.value })}
          disableUnderline
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
    const { dataIsReady, history } = this.props;
    return (
      <RootLayout
        loading={!dataIsReady}
        Topbar={
          <SecondaryNavHeader
            title="发送信息"
            Left={<IconButton color="contrast" onClick={this._handleGoBack}><ArrowBackIcon /></IconButton>}
            Right={<IconButton color="contrast" onClick={this._handleSentNote}><SendIcon /></IconButton>}
          />
        }
      >
        <CircleLoader
          open={this.state.isProcessing}
          message={this.state.processMsg}
        />
        { dataIsReady && this.renderContent() }
        <Dialog
          title="提示"
          titleStyle={{ border: 'none' }}
          actions={[
            <Button
              label="取消"
              onClick={() => this.setState({ isAlertOpen: false })}
              keyboardFocused
              primary
            />,
            <Button
              label="确认"
              onClick={() => history.goBack()}
              primary
            />,
          ]}
          actionsContainerStyle={{ border: 'none' }}
          open={this.state.isAlertOpen}
          modal={false}
        >您还有未发送的内容，是否确认退出？
        </Dialog>
      </RootLayout>
    );
  }
}
const styles = {
  input: {
    display: 'flex',
    alignItems: 'center',
    height: 48,
    padding: '0 20px',
  },
};

export default withStyles(styles)(SendNotePage);
