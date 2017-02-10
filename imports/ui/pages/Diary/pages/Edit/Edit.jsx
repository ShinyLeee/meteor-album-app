import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import DoneIcon from 'material-ui/svg-icons/action/done';
import { blue500 } from 'material-ui/styles/colors';
import { updateDiary } from '/imports/api/diarys/methods.js';

import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import QuillEditor from '/imports/ui/components/Quill/QuillEditor.jsx';

export default class EditDiary extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAlertOpen: false,
      title: props.initialDiary.title,
      content: props.initialDiary.content,
    };
    this.handleGoBack = this.handleGoBack.bind(this);
    this.handleUpdateDiary = this.handleUpdateDiary.bind(this);
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

  handleGoBack() {
    if (this.state.content) {
      this.setState({ isAlertOpen: true });
      return;
    }
    browserHistory.goBack();
  }

  handleUpdateDiary() {
    const { initialDiary } = this.props;
    const { title, content } = this.state;
    if (!content) {
      this.props.snackBarOpen('请输入必填项');
      return;
    }
    updateDiary.callPromise({
      diaryId: initialDiary._id,
      title,
      content,
      updatedAt: new Date(),
    })
    .then(() => {
      browserHistory.replace('/diary');
      this.props.snackBarOpen('更新日记成功');
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen(err.reason || '更新日记失败');
      throw new Meteor.Error(err);
    });
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
      <div className="container">
        <NavHeader
          title="更新日记"
          style={{ backgroundColor: blue500 }}
          iconElementLeft={<IconButton onTouchTap={this.handleGoBack}><ArrowBackIcon /></IconButton>}
          iconElementRight={<IconButton onTouchTap={this.handleUpdateDiary}><DoneIcon /></IconButton>}
        />
        <div className="content">
          <div className="content__updateDiary">
            <TextField
              hintText="标题"
              style={{ padding: '0 20px' }}
              underlineShow={false}
              value={this.state.title}
              fullWidth
            />
            <Divider />
            <QuillEditor
              placeholder={this.state.content}
              modules={this.quillModulesConfig}
              onChange={(content) => this.setState({ content })}
            />
          </div>
        </div>
        <Dialog
          title="提示"
          titleStyle={{ border: 'none' }}
          actions={actions}
          actionsContainerStyle={{ border: 'none' }}
          open={this.state.isAlertOpen}
          modal
        >您是否确认放弃修改？
        </Dialog>
      </div>
    );
  }
}

EditDiary.propTypes = {
  User: PropTypes.object,
  // Below Pass from Database and Redux
  initialDiary: PropTypes.object.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
};
