import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import RecoveryIcon from 'material-ui/svg-icons/av/replay';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import { blue500 } from 'material-ui/styles/colors';
import { removeImages, recoveryImages } from '/imports/api/images/methods.js';
import scrollTo from '/imports/utils/scrollTo.js';

import NavHeader from '../../components/NavHeader/NavHeader.jsx';
import EmptyHolder from '../../components/EmptyHolder/EmptyHolder.jsx';
import GridLayout from '../../components/GridLayout/GridLayout.jsx';
import SelectableImageHolder from '../../components/Justified/SelectableImageHolder.jsx';
import { SelectableIcon } from '../../components/Justified/SelectableStatus.jsx';

const styles = {
  AppBarIconSvg: {
    width: '26px',
    height: '26px',
    color: '#fff',
  },
  indeterminateProgress: {
    position: 'fixed',
    backgroundColor: 'none',
    zIndex: 99,
  },
};

export default class RecyclePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAllSelect: false,
      isEditing: false,
      isProcessing: false,
      recoveryAlert: false,
      deleteAlert: false,
    };
    this.handleQuitEditing = this.handleQuitEditing.bind(this);
    this.handleToggleSelectAll = this.handleToggleSelectAll.bind(this);
    this.handleOpenAlert = this.handleOpenAlert.bind(this);
    this.handleRecoveryImgs = this.handleRecoveryImgs.bind(this);
    this.handleDeleteImgs = this.handleDeleteImgs.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { images } = this.props;
    const { counter } = nextProps;
    if (counter > 0) {
      this.setState({ isEditing: true });
      if (images.length === counter) this.setState({ isAllSelect: true });
      else this.setState({ isAllSelect: false });
    } else {
      this.setState({ isEditing: false, isAllSelect: false });
    }
  }

  handleQuitEditing(e) {
    e.preventDefault();
    this.props.disableSelectAll();
  }

  handleToggleSelectAll() {
    const { images } = this.props;
    if (this.state.isAllSelect) {
      this.props.disableSelectAll();
    } else {
      const counter = images.length;
      this.props.enableSelectAll({ selectImages: images, group: { recycle: counter }, counter });
    }
  }

  handleOpenAlert(type) {
    const { selectImages } = this.props;
    if (selectImages.length === 0) {
      this.props.snackBarOpen('您尚未选择相片');
      return;
    }
    this.setState({ [type]: true });
  }

  handleRecoveryImgs() {
    this.setState({ isProcessing: true });
    const selectImagesIds = this.props.selectImages.map((image) => image._id);
    recoveryImages.call({ selectImages: selectImagesIds }, (err) => {
      if (err) {
        this.props.snackBarOpen('恢复相片失败');
        throw new Meteor.Error(err);
      }
      this.props.snackBarOpen('恢复相片成功');
      this.props.disableSelectAll();
      this.setState({ isProcessing: false, recoveryAlert: false });
    });
  }

  handleDeleteImgs() {
    this.setState({ isProcessing: true });
    const selectImagesIds = this.props.selectImages.map((image) => image._id);
    const keys = this.props.selectImages.map((image) => {
      const key = `${image.user}/${image.collection}/${image.name}.${image.type}`;
      return key;
    });
    Meteor.callPromise('Qiniu.remove', { keys })
    .then(() => {
      removeImages.callPromise({ selectImages: selectImagesIds });
    })
    .then(() => {
      this.props.snackBarOpen('删除相片成功');
      this.props.disableSelectAll();
      this.setState({ isProcessing: false, deleteAlert: false });
    })
    .catch((err) => {
      this.props.snackBarOpen('删除相片失败');
      throw new Meteor.Error(err);
    });
  }

  renderContent() {
    if (this.props.images.length === 0) {
      return (<EmptyHolder mainInfo="您的回收站是空的" />);
    }
    return (
      <div className="content__recycle">
        <div className="recycle__header">
          <div className="recycle__title">回收站</div>
          <div className="recycle__desc">回收站中的内容会在 30 天后永久删除</div>
        </div>
        <div className="recycle__content">
          <div className="recycle__toolbox">
            <div className="recycle__toolbox_left" onTouchTap={this.handleToggleSelectAll}>
              <SelectableIcon activate={this.state.isAllSelect} />
              <h4>选择全部</h4>
            </div>
          </div>
          <GridLayout>
            {
              this.props.images.map((image, i) => (
                <SelectableImageHolder
                  key={i}
                  isEditing
                  image={image}
                  total={this.props.images.length}
                  counter={this.props.counter}
                  selectCounter={this.props.selectCounter}
                />
              ))
            }
          </GridLayout>
        </div>
      </div>
    );
  }

  render() {
    const { dataIsReady, User, counter } = this.props;
    const recoveryActions = [
      <FlatButton
        label="取消"
        onTouchTap={() => this.setState({ recoveryAlert: false })}
        primary
      />,
      <FlatButton
        label="恢复"
        onTouchTap={this.handleRecoveryImgs}
        primary
      />,
    ];
    const deleteActions = [
      <FlatButton
        label="取消"
        onTouchTap={() => this.setState({ deleteAlert: false })}
        primary
      />,
      <FlatButton
        label="彻底删除"
        onTouchTap={this.handleDeleteImgs}
        primary
      />,
    ];
    const navHeaderStyle = this.state.isEditing ? { backgroundColor: blue500 } : {};
    const navHeaderIconLeft = this.state.isEditing
      ? (<IconButton onTouchTap={this.handleQuitEditing}><CloseIcon /></IconButton>)
      : (<IconButton onTouchTap={() => browserHistory.goBack()}><ArrowBackIcon /></IconButton>);
    return (
      <div className="container">
        <NavHeader
          User={User}
          title={counter ? `选择了${counter}张照片` : '回收站'}
          onTitleTouchTap={() => scrollTo(0, 1500)}
          style={navHeaderStyle}
          iconElementLeft={navHeaderIconLeft}
          iconElementRight={
            <div>
              <IconButton
                iconStyle={styles.AppBarIconSvg}
                onTouchTap={() => this.handleOpenAlert('recoveryAlert')}
              ><RecoveryIcon />
              </IconButton>
              <IconButton
                iconStyle={styles.AppBarIconSvg}
                onTouchTap={() => this.handleOpenAlert('deleteAlert')}
              ><RemoveIcon />
              </IconButton>
            </div>
          }
        />
        <div className="content">
          { this.state.isProcessing
            && <LinearProgress style={styles.indeterminateProgress} mode="indeterminate" /> }
          { dataIsReady
            ? this.renderContent()
            : (<LinearProgress style={styles.indeterminateProgress} mode="indeterminate" />) }
          <Dialog
            title="提示"
            titleStyle={{ border: 'none' }}
            actions={recoveryActions}
            actionsContainerStyle={{ border: 'none' }}
            open={this.state.recoveryAlert}
            onRequestClose={() => this.setState({ recoveryAlert: false })}
          >是否确认恢复所选图片？
          </Dialog>
          <Dialog
            title="提示"
            titleStyle={{ border: 'none' }}
            actions={deleteActions}
            actionsContainerStyle={{ border: 'none' }}
            open={this.state.deleteAlert}
            onRequestClose={() => this.setState({ deleteAlert: false })}
          >是否确认彻底删除所选图片？
          </Dialog>
        </div>
      </div>
    );
  }

}

RecyclePage.displayName = 'RecyclePage';

RecyclePage.propTypes = {
  User: PropTypes.object,
  // Below Pass from database
  dataIsReady: PropTypes.bool.isRequired,
  images: PropTypes.array.isRequired,
  // Below Pass From Redux
  uptoken: PropTypes.string.isRequired,
  selectImages: PropTypes.array.isRequired,
  counter: PropTypes.number.isRequired,
  selectCounter: PropTypes.func.isRequired,
  disableSelectAll: PropTypes.func.isRequired,
  enableSelectAll: PropTypes.func.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
};
