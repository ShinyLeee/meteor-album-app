import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import CircularProgress from 'material-ui/CircularProgress';
import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import RecoveryIcon from 'material-ui/svg-icons/av/replay';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import { blue500 } from 'material-ui/styles/colors';
import { Images } from '/imports/api/images/image.js';
import { removeImages, recoveryImages } from '/imports/api/images/methods.js';
import scrollTo from '/imports/utils/scrollTo.js';
import { SelectIcon } from '/imports/ui/components/Justified/SelectStatus.jsx';
import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import SelectableImage from '/imports/ui/components/Justified/SelectableImage.jsx';
import GridLayout from '/imports/ui/components/GridLayout/GridLayout.jsx';
import { enableSelectAll, disableSelectAll, snackBarOpen } from '/imports/ui/redux/actions/actionTypes.js';

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

class RecyclePage extends Component {
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
    this.handleRecovery = this.handleRecovery.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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
    const { dispatch } = this.props;
    e.preventDefault();
    dispatch(disableSelectAll());
  }

  handleToggleSelectAll() {
    const { images, dispatch } = this.props;
    if (this.state.isAllSelect) {
      dispatch(disableSelectAll());
    } else {
      const counter = images.length;
      dispatch(enableSelectAll({ selectImages: images, group: { recycle: counter }, counter }));
    }
  }

  handleOpenAlert(type) {
    const { selectImages, dispatch } = this.props;
    if (selectImages.length === 0) {
      dispatch(snackBarOpen('您尚未选择相片'));
      return;
    }
    this.setState({ [type]: true });
  }

  handleRecovery() {
    const { selectImages, dispatch } = this.props;
    this.setState({ isProcessing: true });
    const selectImagesIds = selectImages.map((image) => image._id);
    recoveryImages.call({ selectImages: selectImagesIds }, (err) => {
      if (err) {
        dispatch(snackBarOpen('恢复相片失败'));
        throw new Meteor.Error(err);
      }
      dispatch(snackBarOpen('恢复相片成功'));
      dispatch(disableSelectAll());
      this.setState({ isProcessing: false, recoveryAlert: false });
    });
  }

  handleDelete() {
    const { selectImages, dispatch } = this.props;
    this.setState({ isProcessing: true });
    const selectImagesIds = selectImages.map((image) => image._id);
    const keys = selectImages.map((image) => {
      const key = `${image.user}/${image.collection}/${image.name}.${image.type}`;
      return key;
    });
    Meteor.callPromise('Qiniu.remove', { keys })
    .then(() => {
      removeImages.callPromise({ selectImages: selectImagesIds });
    })
    .then(() => {
      dispatch(snackBarOpen('删除相片成功'));
      dispatch(disableSelectAll());
      this.setState({ isProcessing: false, deleteAlert: false });
    })
    .catch((err) => {
      dispatch(snackBarOpen('删除相片失败'));
      throw new Meteor.Error(err);
    });
  }

  renderRecycle() {
    const { images } = this.props;
    if (images.length === 0) {
      return (
        <div className="Empty">
          <div className="Empty__container">
            <img className="Empty__logo" src="/img/empty.png" role="presentation" />
            <h2 className="Empty__header">Oops!</h2>
            <p className="Empty__info">您的回收站暂时是空闲的</p>
          </div>
        </div>
      );
    }
    return (
      <div className="recycle">
        <div className="recycle__header">
          <div className="recycle__title">回收站</div>
          <div className="recycle__desc">回收站中的内容会在 30 天后永久删除</div>
        </div>
        <div className="recycle__content">
          <div className="recycle__toolbox">
            <div className="recycle__toolbox_left" onTouchTap={this.handleToggleSelectAll}>
              <SelectIcon activate={this.state.isAllSelect} />
              <h4>选择全部</h4>
            </div>
          </div>
          <GridLayout>
            {
              images.map((image, i) => (
                <SelectableImage
                  key={i}
                  image={image}
                  total={images.length}
                  isEditing
                />
              ))
            }
          </GridLayout>
        </div>
      </div>
    );
  }

  renderLoader() {
    return (
      <div className="content text-center">
        <CircularProgress style={{ top: '150px' }} />
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
        onTouchTap={this.handleRecovery}
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
        onTouchTap={this.handleDelete}
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
              >
                <RecoveryIcon />
              </IconButton>
              <IconButton
                iconStyle={styles.AppBarIconSvg}
                onTouchTap={() => this.handleOpenAlert('deleteAlert')}
              >
                <RemoveIcon />
              </IconButton>
            </div>
          }
        />
        <div className="content">
          { this.state.isProcessing && <LinearProgress style={styles.indeterminateProgress} mode="indeterminate" /> }
          { dataIsReady
            ? this.renderRecycle()
            : this.renderLoader() }
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

RecyclePage.propTypes = {
  User: PropTypes.object,
  // Below is Pass from database
  dataIsReady: PropTypes.bool.isRequired,
  images: PropTypes.array.isRequired,
  // Below Pass From Redux
  uptoken: PropTypes.string,
  selectImages: PropTypes.array,
  counter: PropTypes.number,
  dispatch: PropTypes.func,
};

const MeteorContainer = createContainer(() => {
  const imageHandle = Meteor.subscribe('Images.recycle');
  const dataIsReady = imageHandle.ready();
  const images = Images.find({}, { sort: { shootAt: -1 } }).fetch();
  return {
    dataIsReady,
    images,
  };
}, RecyclePage);

const mapStateToProps = (state) => ({
  uptoken: state.uptoken,
  selectImages: state.selectCounter.selectImages,
  counter: state.selectCounter.counter,
});

export default connect(mapStateToProps)(MeteorContainer);
