import PropTypes from 'prop-types';
import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import DoneIcon from 'material-ui-icons/Done';
import { insertDiary } from '/imports/api/diarys/methods';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import { ModalActions, ModalLoader } from '/imports/ui/components/Modal/Common';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncWriteContent = withLoadable({
  loader: () => import('./components/Content'),
});

export default class WriteDiaryPage extends Component {
  static propTypes = {
    User: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    title: '',
    outline: '',
    content: '',
  }

  _handleGoBack = () => {
    if (this.state.content) {
      this.props.modalOpen({
        title: '提示',
        content: '您还有未保存的日记内容，是否确认退出？',
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
      return;
    }
    this.props.history.goBack();
  }

  _handleInsertDiary = () => {
    const { User } = this.props;
    const { title, outline, content } = this.state;
    if (!title || !content) {
      this.props.snackBarOpen('请输入必填项');
      return;
    }
    this.renderLoadModal('添加日记中');
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
        this.props.history.replace('/diary');
        this.props.modalClose();
        this.props.snackBarOpen('添加日记成功');
      })
      .catch((err) => {
        console.log(err);
        this.props.modalClose();
        this.props.snackBarOpen(`添加日记失败 ${err.reason}`);
      });
  }

  _handleTitleChange = (title) => this.setState({ title });

  _handleContentChange = (outline, content) => this.setState({ outline, content });

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
