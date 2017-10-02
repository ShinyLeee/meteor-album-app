import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import Input from 'material-ui/Input';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import DoneIcon from 'material-ui-icons/Done';
import { insertDiary } from '/imports/api/diarys/methods.js';
import RootLayout from '/imports/ui/layouts/RootLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import { QuillEditor } from '/imports/ui/components/Quill';
import { CircleLoader } from '/imports/ui/components/Loader';

class WriteDiaryPage extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    User: PropTypes.object.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    isProcessing: false,
    processMsg: '',
    isAlertOpen: false,
    title: '',
    outline: '',
    content: '',
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

  _handleTitleChange = (e) => {
    this.setState({ title: e.target.value });
  }

  _handleContentChange = (outline, content) => {
    this.setState({ outline, content });
  }

  renderContent() {
    const { classes } = this.props;
    return (
      <div className="content__writeDiary">
        <Input
          className={classes.input}
          value={this.state.title}
          placeholder="标题"
          onChange={this._handleTitleChange}
          disableUnderline
          fullWidth
        />
        <Divider />
        <QuillEditor
          placeholder="内容"
          modules={this.quillModulesConfig}
          contentType="delta"
          onChange={this._handleContentChange}
        />
      </div>
    );
  }

  render() {
    return (
      <RootLayout
        loading={false}
        Topbar={
          <SecondaryNavHeader
            title="添加日记"
            Left={<IconButton color="contrast" onClick={this._handleGoBack}><ArrowBackIcon /></IconButton>}
            Right={<IconButton color="contrast" onClick={this._handleInsertDiary}><DoneIcon /></IconButton>}
          />
        }
      >
        <CircleLoader
          open={this.state.isProcessing}
          message={this.state.processMsg}
        />
        { this.renderContent() }
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
          modal
        >
          您还有未保存的日记内容，是否确认退出？
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

export default withStyles(styles)(WriteDiaryPage);
