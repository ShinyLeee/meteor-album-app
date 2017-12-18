import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import ArrowBackIcon from 'material-ui-icons/Close';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import { Diarys } from '/imports/api/diarys/diary';
import { updateDiary, removeDiary } from '/imports/api/diarys/methods';
import { diaryOpen, diaryClose, snackBarOpen } from '/imports/ui/redux/actions';
import Portal from '/imports/ui/components/Portal';
import SlideTransition from '/imports/ui/components/Transition/Slide';
import CustomNavHeader from '/imports/ui/components/NavHeader/Custom';
import Modal from '/imports/ui/components/Modal';
import { QuillShower, QuillEditor } from '/imports/ui/components/Quill';
import {
  Wrapper,
  Body,
  Article,
  Footer,
  Time,
} from '../styles/DiaryViewer.style';

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

class DiaryViewer extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    diary: PropTypes.object,
    diaryOpen: PropTypes.func.isRequired,
    diaryClose: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    isEditing: false,
    updatedOutline: '',
    updatedContent: '',
  }

  // TODO bug fix
  // componentDidUpdate(prevProps) {
  //   if (prevProps.visible !== this.props.visible) {
  //     if (this.props.visible) {
  //       document.body.style.overflow = 'hidden';
  //     } else {
  //       document.body.style.overflow = '';
  //     }
  //   }
  // }

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

  _handleRemoveDiary = async () => {
    const { diary } = this.props;
    try {
      await Modal.showLoader('删除日记中');
      await removeDiary.callPromise({ diaryId: diary._id });
      Modal.close();
      this.props.diaryClose();
      this.props.snackBarOpen('删除成功');
    } catch (err) {
      console.warn(err);
      Modal.close();
      this.props.snackBarOpen(`删除失败 ${err.reason}`);
    }
  }

  _handleUpdateDiary = async () => {
    const { diary } = this.props;
    const { updatedOutline, updatedContent } = this.state;
    try {
      await Modal.showLoader('更新日记中');
      await updateDiary.callPromise({
        diaryId: diary._id,
        outline: updatedOutline,
        content: updatedContent,
      });
      Modal.close();
      this.props.diaryOpen(Diarys.findOne(diary._id));
      this.props.snackBarOpen('修改成功');
      this.setState({ isEditing: false, updatedOutline: '', updatedContent: '' });
    } catch (err) {
      console.warn(err);
      Modal.close();
      this.props.snackBarOpen(`修改失败 ${err.reason}`);
    }
  }

  _handleClose(closeDiary = false) {
    this.setState({ isEditing: false, menuOpen: false });
    if (closeDiary) {
      this.props.diaryClose();
    }
  }

  _handleEditing = () => {
    this._handleClose();
    this.setState({ isEditing: true });
  }

  _handleClose = () => {
    this.setState({ menuOpen: false });
  }

  renderPrompt = () => {
    this._handleClose();
    Modal.showPrompt({
      message: '您是否确认删除此日记？',
      onCancel: Modal.close,
      onConfirm: this._handleRemoveDiary,
    });
  }

  render() {
    const { visible, diary } = this.props;
    return (
      <Portal name="DiaryViewer">
        <TransitionGroup>
          {
            visible && (
              <SlideTransition>
                <Wrapper>
                  {
                    this.state.isEditing
                    ? (
                      <CustomNavHeader
                        title={diary.title}
                        Left={
                          <IconButton onClick={() => this._handleClose()}>
                            <ArrowBackIcon />
                          </IconButton>
                        }
                        Right={<Button onClick={this._handleUpdateDiary}>保存</Button>}
                      />
                    )
                    : (
                      <CustomNavHeader
                        title={diary.title}
                        Left={
                          <IconButton onClick={() => this._handleClose(true)}>
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
                            onClose={this._handleClose}
                          >
                            <MenuItem onClick={this._handleEditing}>编辑</MenuItem>
                            <MenuItem onClick={this.renderPrompt}>删除</MenuItem>
                          </Menu>,
                        ]}
                      />
                    )
                  }
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
      </Portal>
    );
  }
}

const mapStateToProps = ({ portals }) => ({
  visible: portals.diary.open,
  diary: portals.diary.content,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  diaryOpen,
  diaryClose,
  snackBarOpen,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DiaryViewer);
