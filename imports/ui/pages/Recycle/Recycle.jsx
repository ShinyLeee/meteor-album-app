import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import RecoveryIcon from 'material-ui/svg-icons/av/replay';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import { blue500, purple500 } from 'material-ui/styles/colors';
import { removeImages, recoveryImages } from '/imports/api/images/methods.js';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary/Secondary.jsx';
import EmptyHolder from '/imports/ui/components/EmptyHolder/EmptyHolder.jsx';
import Loader from '/imports/ui/components/Loader/Loader.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';
import JustifiedSelectIcon from '/imports/ui/components/JustifiedLayout/components/snippet/JustifiedSelectIcon.jsx';
import ConnectedGridLayout from '/imports/ui/components/JustifiedLayout/components/GridLayout/GridLayout.jsx';

export default class RecyclePage extends Component {
  static propTypes = {
    // Below Pass from Database
    dataIsReady: PropTypes.bool.isRequired,
    images: PropTypes.array.isRequired,
    // Below Pass From Redux
    User: PropTypes.object.isRequired,
    selectImages: PropTypes.array.isRequired,
    counter: PropTypes.number.isRequired,
    selectCounter: PropTypes.func.isRequired,
    disableSelectAll: PropTypes.func.isRequired,
    enableSelectAll: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isAllSelect: false,
      isProcessing: false,
      processMsg: '',
      isEditing: false,
      recoveryAlert: false,
      deleteAlert: false,
    };
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

  _handleQuitEditing = (e) => {
    e.preventDefault();
    this.props.disableSelectAll();
  }

  _handleToggleSelectAll = () => {
    const { images } = this.props;
    if (this.state.isAllSelect) {
      this.props.disableSelectAll();
    } else {
      const counter = images.length;
      this.props.enableSelectAll({
        selectImages: images,
        group: { recycle: counter },
        counter,
      });
    }
  }

  _handleOpenAlert = (type) => {
    const { selectImages } = this.props;
    if (selectImages.length === 0) {
      this.props.snackBarOpen('您尚未选择相片');
      return;
    }
    this.setState({ [type]: true });
  }

  _handleRecoveryImgs = () => {
    const { selectImages } = this.props;
    this.setState({ isProcessing: true, processMsg: '恢复相片中', recoveryAlert: false });
    const selectImagesIds = selectImages.map((image) => image._id);
    recoveryImages.callPromise({ selectImages: selectImagesIds })
    .then(() => {
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen('恢复相片成功');
      this.props.disableSelectAll();
    })
    .catch((err) => {
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(`恢复相片失败 ${err.reason}`);
    });
  }

  _handleDeleteImgs = () => {
    const { selectImages } = this.props;
    this.setState({ isProcessing: true, processMsg: '删除相片中', deleteAlert: false });
    const selectImagesIds = selectImages.map((image) => image._id);
    const keys = selectImages.map((image) => {
      const key = `${image.user}/${image.collection}/${image.name}.${image.type}`;
      return key;
    });
    Meteor.callPromise('Qiniu.remove', { keys })
    .then(() => removeImages.callPromise({ selectImages: selectImagesIds }))
    .then(() => {
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen('删除相片成功');
      this.props.disableSelectAll();
    })
    .catch((err) => {
      console.log(err);
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(`删除相片失败 ${err.reason}`);
    });
  }

  renderContent() {
    const { images } = this.props;
    if (images.length === 0) {
      return (<EmptyHolder mainInfo="您的回收站是空的" />);
    }
    return (
      <div className="content__recycle">
        <header className="recycle__header">
          <h2 className="recycle__title">回收站</h2>
          <div className="recycle__desc">回收站中的内容会在 30 天后永久删除</div>
        </header>
        <div className="recycle__content">
          <div className="recycle__toolbox">
            <div className="recycle__toolbox_left" onTouchTap={this._handleToggleSelectAll}>
              <JustifiedSelectIcon activate={this.state.isAllSelect} />
              <h4>选择全部</h4>
            </div>
          </div>
          <ConnectedGridLayout
            isEditing={this.state.isEditing}
            images={images}
          />
        </div>
      </div>
    );
  }

  render() {
    const { dataIsReady, counter } = this.props;
    return (
      <div className="container">
        <SecondaryNavHeader
          title={counter ? `选择了${counter}张照片` : '回收站'}
          style={{ backgroundColor: this.state.isEditing ? blue500 : purple500 }}
          iconElementLeft={
            this.state.isEditing &&
            (<IconButton onTouchTap={this._handleQuitEditing}><CloseIcon /></IconButton>)
          }
          iconElementRight={
            <div>
              <IconButton
                iconStyle={{ color: '#fff' }}
                onTouchTap={() => this._handleOpenAlert('recoveryAlert')}
              ><RecoveryIcon />
              </IconButton>
              <IconButton
                iconStyle={{ color: '#fff' }}
                onTouchTap={() => this._handleOpenAlert('deleteAlert')}
              ><RemoveIcon />
              </IconButton>
            </div>
          }
        />
        <main className="content">
          <Loader
            open={this.state.isProcessing}
            message={this.state.processMsg}
          />
          {
            dataIsReady
            ? this.renderContent()
            : (<Loading />)
          }
          <Dialog
            title="提示"
            titleStyle={{ border: 'none' }}
            actions={[
              <FlatButton
                label="取消"
                onTouchTap={() => this.setState({ recoveryAlert: false })}
                primary
              />,
              <FlatButton
                label="恢复"
                onTouchTap={this._handleRecoveryImgs}
                primary
              />,
            ]}
            actionsContainerStyle={{ border: 'none' }}
            open={this.state.recoveryAlert}
            onRequestClose={() => this.setState({ recoveryAlert: false })}
          >是否确认恢复所选图片？
          </Dialog>
          <Dialog
            title="提示"
            titleStyle={{ border: 'none' }}
            actions={[
              <FlatButton
                label="取消"
                onTouchTap={() => this.setState({ deleteAlert: false })}
                primary
              />,
              <FlatButton
                label="彻底删除"
                onTouchTap={this._handleDeleteImgs}
                primary
              />,
            ]}
            actionsContainerStyle={{ border: 'none' }}
            open={this.state.deleteAlert}
            onRequestClose={() => this.setState({ deleteAlert: false })}
          >是否确认彻底删除所选图片？
          </Dialog>
        </main>
      </div>
    );
  }

}
