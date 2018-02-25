import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import DoneIcon from 'material-ui-icons/Done';
import { insertDiary } from '/imports/api/diarys/methods';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import Modal from '/imports/ui/components/Modal';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncWriteContent = withLoadable({
  loader: () => import('./components/Content'),
});

export default class WriteDiaryPage extends PureComponent {
  static propTypes = {
    User: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    title: '',
    outline: '',
    content: '',
  }

  _handleGoBack = () => {
    if (!!this.state.title || !!this.state.content) {
      Modal.showPrompt({
        message: '您还有未保存的日记内容，是否确认退出？',
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

  _handleInsertDiary = async () => {
    const { User } = this.props;
    const { title, outline, content } = this.state;
    if (!title || !content) {
      this.props.snackBarOpen('请输入必填项');
      return;
    }
    try {
      await Modal.showLoader('添加日记中');
      await insertDiary.callPromise({
        user: User.username,
        title,
        outline,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      Modal.close();
      this.props.history.replace('/diary');
      this.props.snackBarOpen('添加日记成功');
    } catch (err) {
      console.warn(err);
      Modal.close();
      this.props.snackBarOpen(`添加日记失败 ${err.error}`);
    }
  }

  _handleTitleChange = (title) => {
    this.setState({ title });
  }

  _handleContentChange = (outline, content) => {
    this.setState({ outline, content });
  }

  render() {
    return (
      <ViewLayout
        Topbar={
          <SecondaryNavHeader
            title="添加日记"
            Left={
              <IconButton
                color="contrast"
                onClick={this._handleGoBack}
              ><ArrowBackIcon />
              </IconButton>
            }
            Right={
              <IconButton
                color="contrast"
                onClick={this._handleInsertDiary}
              ><DoneIcon />
              </IconButton>
            }
          />
        }
      >
        <AsyncWriteContent
          onTitleChange={this._handleTitleChange}
          onContentChange={this._handleContentChange}
        />
      </ViewLayout>
    );
  }
}
