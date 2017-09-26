import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import DoneIcon from 'material-ui/svg-icons/action/done';
import { insertDiary } from '/imports/api/diarys/methods.js';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary/Secondary.jsx';
import QuillEditor from '/imports/ui/components/Quill/QuillEditor.jsx';
import Loader from '/imports/ui/components/Loader/Loader.jsx';

export default class WriteDiaryPage extends Component {
  static propTypes = {
    // Below Pass from React-Router
    history: PropTypes.object.isRequired,
    // Below Pass from Redux
    User: PropTypes.object.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      processMsg: '',
      isAlertOpen: false,
      title: '',
      outline: '',
      content: '',
    };
  }

  get quillModulesConfig() {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', { color: [] }, { align: [false, 'center', 'right'] }],
          ['blockquote', 'code-block'],
          ['link', 'image'],
        ],
      },
    };
  }

  _handleGoBack = () => {
    const { history } = this.props;
    if (this.state.content) {
      this.setState({ isAlertOpen: true });
      return;
    }
    history.goBack();
  }

  _handleInsertDiary = () => {
    const { User, history } = this.props;
    const { title, outline, content } = this.state;
    if (!title || !content) {
      this.props.snackBarOpen('请输入必填项');
      return;
    }
    this.setState({ isProcessing: true, processMsg: '添加日记中' });
    insertDiary.callPromise({
      user: User.username,
      title,
      outline,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .then(() => {
      // because go to another component so we do not need set inital state
      history.replace('/diary');
      this.props.snackBarOpen('添加日记成功');
    })
    .catch((err) => {
      console.log(err);
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(`添加日记失败 ${err.reason}`);
    });
  }

  render() {
    const { history } = this.props;
    return (
      <div className="container">
        <SecondaryNavHeader
          title="添加日记"
          iconElementLeft={<IconButton onTouchTap={this._handleGoBack}><ArrowBackIcon /></IconButton>}
          iconElementRight={<IconButton onTouchTap={this._handleInsertDiary}><DoneIcon /></IconButton>}
        />
        <main className="content">
          <Loader
            open={this.state.isProcessing}
            message={this.state.processMsg}
          />
          <div className="content__writeDiary">
            <TextField
              hintText="标题"
              style={{ padding: '0 20px' }}
              underlineShow={false}
              value={this.state.title}
              onChange={(e) => this.setState({ title: e.target.value })}
              fullWidth
            />
            <Divider />
            <QuillEditor
              placeholder="内容"
              modules={this.quillModulesConfig}
              contentType="delta"
              onChange={(outline, content) => this.setState({ outline, content })}
            />
          </div>
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
                onTouchTap={() => history.goBack()}
                primary
              />,
            ]}
            actionsContainerStyle={{ border: 'none' }}
            open={this.state.isAlertOpen}
            modal
          >您还有未保存的日记内容，是否确认退出？
          </Dialog>
        </main>
      </div>
    );
  }
}
