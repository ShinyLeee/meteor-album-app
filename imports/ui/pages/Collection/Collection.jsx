import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CircularProgress from 'material-ui/CircularProgress';
import AddIcon from 'material-ui/svg-icons/content/add';
import { insertCollection } from '/imports/api/collections/methods.js';

import ConnectedNavHeader from '../../containers/NavHeaderContainer.jsx';
import Recap from '../../components/Recap/Recap.jsx';
import ColHolder from '../../components/ColHolder/ColHolder.jsx';

const styles = {
  floatBtn: {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
  },
  colHolder: {
    padding: '0 12px',
  },
};

export default class CollectionPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      newColName: '',
      errorText: '',
      location: 'collection',
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddCollection = this.handleAddCollection.bind(this);
  }

  componentWillMount() {
    const { cols } = this.props;
    if (cols) {
      const existColNames = cols.map((col) => col.name);
      this.setState({ existColNames });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { cols } = this.props.cols;
    if (cols !== nextProps.cols) {
      const existColNames = nextProps.cols.map((col) => col.name);
      this.setState({ existColNames });
    }
  }

  handleClose() {
    this.setState({ open: false, newColName: '', errorText: '' });
  }

  handleChange(e) {
    const newColName = e.target.value;
    if (newColName.length > 10) {
      this.setState({ errorText: '相册名不能超过十个字符' });
    } else if (this.state.existColNames.indexOf(newColName) >= 0) {
      this.setState({ errorText: '该相册已存在' });
    } else {
      this.setState({ newColName, errorText: '' });
    }
  }

  handleAddCollection() {
    if (this.state.errorText) {
      this.props.snackBarOpen(this.state.errorText);
      this.handleClose();
      return;
    }
    this.handleClose();
    insertCollection.call({
      name: this.state.newColName,
      user: this.props.User.username,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, (err) => {
      if (err) {
        this.props.snackBarOpen('新建相册失败');
        throw new Meteor.Error(err);
      }
      this.props.snackBarOpen('新建相册成功');
    });
  }

  renderColHolder() {
    if (this.props.cols.length === 0) {
      return (
        <div className="Empty">
          <div className="Empty__container">
            <img
              className="Empty__logo"
              src={`${this.props.sourceDomain}/GalleryPlus/Default/empty.png`}
              role="presentation"
            />
            <h2 className="Empty__header">Oops</h2>
            <p className="Empty__info">你还尚未创建相册</p>
            <p className="Empty__info">点击右下角按钮创建属于自己的相册吧</p>
          </div>
        </div>
      );
    }
    return this.props.cols.map((col) => (
      <ColHolder
        key={col._id}
        User={this.props.curUser}
        col={col}
        clientWidth={this.props.clientWidth}
      />
    ));
  }

  renderLoader() {
    return (
      <div className="content text-center">
        <CircularProgress style={{ top: '150px' }} />
      </div>
    );
  }

  render() {
    const { User, curUser, cols, noteNum, dataIsReady, isGuest } = this.props;
    const actions = [
      <FlatButton
        label="取消"
        onTouchTap={this.handleClose}
        primary
      />,
      <FlatButton
        label="新建"
        onTouchTap={this.handleAddCollection}
        disabled={!this.state.newColName}
        primary
      />,
    ];
    return (
      <div className="container">
        { isGuest
          ? (
            <ConnectedNavHeader
              User={User}
              title="相册"
              iconElementLeft={
                <IconButton onTouchTap={() => browserHistory.goBack()}>
                  <ArrowBackIcon />
                </IconButton>
              }
            />)
          : (<ConnectedNavHeader User={User} location={this.state.location} noteNum={noteNum} primary />)
        }
        <div className="content">
          { isGuest
            ? (
              <Recap
                title={curUser.username}
                detailFir={curUser.profile.intro || '暂无简介'}
              />)
            : cols.length > 0 && (
              <Recap
                title="Collections"
                detailFir="所有创建相册都在这里"
                detailSec="可以点击右下角的按钮添加相册"
              />)
            }
          <div className="col-holder-container" style={styles.colHolder}>
            { dataIsReady ? this.renderColHolder() : this.renderLoader() }
          </div>
          <div className="dialog">
            <Dialog
              title="新建相册"
              actions={actions}
              open={this.state.open}
              onRequestClose={this.handleClose}
              modal
            >
              <TextField
                hintText="相册名"
                onChange={this.handleChange}
                errorText={this.state.errorText}
                fullWidth
              />
            </Dialog>
          </div>
        </div>
        { isGuest
          ? null
          : (
            <FloatingActionButton
              style={styles.floatBtn}
              onTouchTap={() => { this.setState({ open: true }); }}
              secondary
            >
              <AddIcon />
            </FloatingActionButton>)
        }
      </div>
    );
  }

}

CollectionPage.defaultProps = {
  clientWidth: document.body.clientWidth,
  sourceDomain: Meteor.settings.public.sourceDomain,
};

CollectionPage.propTypes = {
  User: PropTypes.object,
  clientWidth: PropTypes.number.isRequired,
  sourceDomain: PropTypes.string.isRequired,
  // Below Pass from database
  dataIsReady: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  curUser: PropTypes.object.isRequired,
  cols: PropTypes.array.isRequired,
  noteNum: PropTypes.number.isRequired,
  // Below Pass from Redux
  snackBarOpen: PropTypes.func.isRequired,
};
