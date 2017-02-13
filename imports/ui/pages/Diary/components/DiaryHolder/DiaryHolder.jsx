import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/close';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { blue500 } from 'material-ui/styles/colors';
import { Diarys } from '/imports/api/diarys/diary.js';
import { updateDiary, removeDiary } from '/imports/api/diarys/methods.js';
import { diaryOpen, diaryClose, snackBarOpen } from '/imports/ui/redux/actions/index.js';
import QuillShower from '/imports/ui/components/Quill/QuillShower.jsx';
import QuillEditor from '/imports/ui/components/Quill/QuillEditor.jsx';
import Loader from '/imports/ui/components/Loader/Loader.jsx';

class DiaryHolder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      processMsg: '',
      isEditing: false,
      isAlertOpen: false,
      updatedOutline: '',
      updatedContent: '',
    };
    this.handleDiaryChange = this.handleDiaryChange.bind(this);
    this.handleRemoveDiary = this.handleRemoveDiary.bind(this);
    this.handleUpdateDiary = this.handleUpdateDiary.bind(this);
    this.handleQuitEditing = this.handleQuitEditing.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { open, diary } = nextProps;
    if (this.props.open !== open) {
      if (open) this.setState({ updatedOutline: diary.outline, updatedContent: diary.content });
      else this.setState({ updatedOutline: '', updatedContent: '' });
    }
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

    /**
     * @param {string} outline - plain text take from rich text
     * @param {object} content - Delta object from Quill.js
     *
     * Return from QuillEditor component,
     * Fire when Editor content change
     */
  handleDiaryChange(outline, content) {
    this.setState({ updatedOutline: outline, updatedContent: content });
  }

  handleRemoveDiary() {
    const { diary } = this.props;

    this.setState({ isProcessing: true, processMsg: '删除日记中' });

    removeDiary.callPromise({ diaryId: diary._id })
    .then(() => {
      this.setState({ isProcessing: false, processMsg: '', isAlertOpen: false });
      this.props.diaryClose();
      this.props.snackBarOpen('删除成功');
    })
    .catch((err) => {
      this.setState({ isProcessing: false, processMsg: '', isAlertOpen: false });
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen(err.reason || '删除失败');
      throw new Meteor.Error(err);
    });
  }

  handleUpdateDiary() {
    const { diary } = this.props;
    const { updatedOutline, updatedContent } = this.state;

    this.setState({ isProcessing: true, processMsg: '更新日记中' });

    updateDiary.callPromise({
      diaryId: diary._id,
      outline: updatedOutline,
      content: updatedContent,
    })
    .then(() => {
      this.setState({ isProcessing: false, processMsg: '', isEditing: false, updatedOutline: '', updatedContent: '' });
      this.props.diaryOpen(Diarys.findOne(diary._id));
      this.props.snackBarOpen('修改成功');
    })
    .catch((err) => {
      this.setState({ isProcessing: false, processMsg: '' });
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen(err.reason || '修改失败');
      throw new Meteor.Error(err);
    });
  }

  handleQuitEditing() {
    this.setState({ isEditing: false });
    this.props.diaryClose();
  }

  disableMobileScroll(e) { e.preventDefault(e); }

  render() {
    const { open, diary } = this.props;
    return (
      <ReactCSSTransitionGroup
        transitionName="zoomer"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
        {
          open && (
            <div className="component__DiaryHolder">
              {
                this.state.isEditing
                ? (
                  <AppBar
                    title={diary.title}
                    style={{ backgroundColor: blue500 }}
                    iconElementLeft={<IconButton onTouchTap={() => this.setState({ isEditing: false })}><ArrowBackIcon /></IconButton>}
                    iconElementRight={<FlatButton label="保存" onTouchTap={this.handleUpdateDiary} />}
                  />
                )
                : (
                  <AppBar
                    title={diary.title}
                    titleStyle={{ color: '#666' }}
                    style={{ backgroundColor: '#fff' }}
                    iconElementLeft={<IconButton onTouchTap={this.handleQuitEditing}><ArrowBackIcon color="#666" /></IconButton>}
                    iconElementRight={
                      <IconMenu
                        iconButtonElement={<IconButton iconStyle={{ fill: '#666' }}><MoreVertIcon /></IconButton>}
                        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                      >
                        <MenuItem primaryText="编辑" onTouchTap={() => this.setState({ isEditing: true })} />
                        <MenuItem primaryText="删除" onTouchTap={() => this.setState({ isAlertOpen: true })} />
                      </IconMenu>
                    }
                  />
                )
              }
              <div className="DiaryHolder__body" ref={(node) => { this.diaryBody = node; }}>
                <div className="DiaryHolder__content">
                  {
                    this.state.isEditing
                    ? (
                      <QuillEditor
                        modules={this.quillModulesConfig}
                        onChange={this.handleDiaryChange}
                        contentType="delta"
                        content={diary.content}
                      />
                    )
                    : (<QuillShower content={diary.content} />)
                  }
                </div>
                <div className="DiaryHolder__footer">
                  <span className="DiaryHolder__time">
                    { this.state.isEditing ? `编辑中 ${moment().format('YYYY.MM.DD A HH:mm')}` : diary.time}
                  </span>
                </div>
              </div>
              <Loader
                open={this.state.isProcessing}
                message={this.state.processMsg}
              />
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
                    onTouchTap={this.handleRemoveDiary}
                    primary
                  />,
                ]}
                actionsContainerStyle={{ border: 'none' }}
                open={this.state.isAlertOpen}
                modal
              >您是否确认删除此日记？
              </Dialog>
            </div>
          )
        }
      </ReactCSSTransitionGroup>
    );
  }
}

DiaryHolder.displayName = 'DiaryHolder';

DiaryHolder.defaultProps = {
  clientHeight: document.body.clientHeight,
};

DiaryHolder.propTypes = {
  clientHeight: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  diary: PropTypes.object,
  // Below Pass from redux
  diaryOpen: PropTypes.func.isRequired,
  diaryClose: PropTypes.func.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  open: state.diary.open,
  diary: state.diary.diary,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  diaryOpen,
  diaryClose,
  snackBarOpen,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DiaryHolder);
