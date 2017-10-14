import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TransitionGroup } from 'react-transition-group';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import ArrowBackIcon from 'material-ui-icons/Close';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import { Diarys } from '/imports/api/diarys/diary.js';
import { updateDiary, removeDiary } from '/imports/api/diarys/methods.js';
import { modalOpen, modalClose, diaryOpen, diaryClose, snackBarOpen } from '/imports/ui/redux/actions';
import SlideTransition from '/imports/ui/components/Transition/Slide';
import { CustomNavHeader } from '/imports/ui/components/NavHeader';
import { ModalActions } from '/imports/ui/components/Modal';
import { QuillShower, QuillEditor } from '/imports/ui/components/Quill';
import Loader from '/imports/ui/components/Loader';
import {
  Wrapper,
  Body,
  Article,
  Footer,
  Time,
} from './DiaryHolder.style.js';

const quillConfig = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ['bold', { color: [] }, { align: [false, 'center', 'right'] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
    ],
  },
};

class DiaryHolder extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    diary: PropTypes.object,
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    diaryOpen: PropTypes.func.isRequired,
    diaryClose: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    isProcessing: false,
    processMsg: '',
    isEditing: false,
    updatedOutline: '',
    updatedContent: '',
  }

  componentWillReceiveProps(nextProps) {
    const { open, diary } = nextProps;
    if (this.props.open !== open) {
      if (open) {
        this.setState({ updatedOutline: diary.outline, updatedContent: diary.content });
      } else {
        this.setState({ updatedOutline: '', updatedContent: '' });
      }
    }
  }

  /**
   * @param {string} outline - plain text take from rich text
   * @param {object} content - Delta object from Quill.js
   *
   * Return from QuillEditor component,
   * Fire when Editor content change
   */
  _handleDiaryChange = (outline, content) => {
    this.setState({ updatedOutline: outline, updatedContent: content });
  }

  _handleRemoveDiary = () => {
    const { diary } = this.props;

    this.props.modalClose();
    this.setState({ isProcessing: true, processMsg: '删除日记中' });

    removeDiary.callPromise({ diaryId: diary._id })
      .then(() => {
        this.setState({ isProcessing: false, processMsg: '' });
        this.props.diaryClose();
        this.props.snackBarOpen('删除成功');
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isProcessing: false, processMsg: '' });
        this.props.snackBarOpen(`删除失败 ${err.reason}`);
      });
  }

  _handleUpdateDiary = () => {
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
        console.log(err);
        this.setState({ isProcessing: false, processMsg: '' });
        this.props.snackBarOpen(`修改失败 ${err.reason}`);
      });
  }

  _handleClose = (closeDiary = false) => () => {
    this.setState({ isEditing: false, menuOpen: false });
    if (closeDiary) {
      this.props.diaryClose();
    }
  }

  _handleOpenModal = () => {
    this._handleRequestClose();
    this.props.modalOpen({
      title: '提示',
      content: '您是否确认删除此日记？',
      actions: (
        <ModalActions
          sClick={this.props.modalClose}
          pClick={this._handleRemoveDiary}
        />
      ),
    });
  }

  _handleEditing = () => {
    this._handleRequestClose();
    this.setState({ isEditing: true });
  }

  _handleRequestClose = () => {
    this.setState({ menuOpen: false });
  }

  renderNavHeader() {
    const { diary } = this.props;
    if (this.state.isEditing) {
      return (
        <CustomNavHeader
          title={diary.title}
          Left={
            <IconButton onClick={this._handleClose()}>
              <ArrowBackIcon />
            </IconButton>
          }
          Right={<Button onClick={this._handleUpdateDiary}>保存</Button>}
        />
      );
    }
    return (
      <CustomNavHeader
        title={diary.title}
        Left={
          <IconButton onClick={this._handleClose(true)}>
            <ArrowBackIcon color="#666" />
          </IconButton>
        }
        Right={[
          <IconButton
            key="moreBtn"
            onClick={(e) => this.setState({ anchorEl: e.currentTarget, menuOpen: true })}
          >
            <MoreVertIcon />
          </IconButton>,
          <Menu
            key="moreMenu"
            open={this.state.menuOpen}
            anchorEl={this.state.anchorEl}
            onRequestClose={this._handleRequestClose}
          >
            <MenuItem onClick={this._handleEditing}>编辑</MenuItem>
            <MenuItem onClick={this._handleOpenModal}>删除</MenuItem>
          </Menu>,
        ]}
      />
    );
  }

  render() {
    const { open, diary } = this.props;
    return (
      <TransitionGroup>
        {
          open && (
            <SlideTransition>
              <Wrapper>
                { this.renderNavHeader() }
                <Loader
                  open={this.state.isProcessing}
                  message={this.state.processMsg}
                />
                <Body>
                  <Article>
                    {
                      this.state.isEditing
                      ? (
                        <QuillEditor
                          modules={quillConfig}
                          onChange={this._handleDiaryChange}
                          contentType="delta"
                          content={diary.content}
                        />
                      )
                      : <QuillShower content={diary.content} />
                    }
                  </Article>
                  <Footer>
                    <Time dateTime={diary.time}>
                      { this.state.isEditing ? `编辑中 ${moment().format('YYYY.MM.DD A HH:mm')}` : diary.time}
                    </Time>
                  </Footer>
                </Body>
              </Wrapper>
            </SlideTransition>
          )
        }
      </TransitionGroup>
    );
  }
}

const mapStateToProps = ({ portals }) => ({
  open: portals.diary.open,
  diary: portals.diary.diary,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  modalOpen,
  modalClose,
  diaryOpen,
  diaryClose,
  snackBarOpen,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DiaryHolder);
