import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CircularProgress from 'material-ui/CircularProgress';
import AddIcon from 'material-ui/svg-icons/content/add';

import { Collections } from '/imports/api/collections/collection.js';
import { insertCollection } from '/imports/api/collections/methods.js';

import NavHeader from '../components/NavHeader.jsx';
import Recap from '../components/Recap.jsx';
import ColHolder from '../components/ColHolder.jsx';
import { snackBarOpen } from '../actions/actionTypes.js';

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

class Collection extends Component {
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
    // this.handleConfirmAdd = this.handleConfirmAdd.bind(this);
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

  // handleConfirmAdd() {
  //   TEMP NOT USE BC IT NEED USE REDUX-THUNK OR REDUX-SAGA FOR DISPATCH ASYNC FUNCTION
  //   const { User, dispatch } = this.props;

  //   fetch('/api/uptoken', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       user: User.username,
  //       collection: this.state.newColName,
  //     }),
  //   })
  //   .then((res) => res.json())
  //   .then((data) => this.setState({ data }))
  //   .then(() => {
  //     console.log(this.state.data);
  //     document.getElementById('uploader').click();
  //     dispatch(uploaderStart(this.state.data));
  //   })
  //   .catch((ex) => {
  //     console.log('Access uptoken failed', ex); // eslint-disable-line no-console
  //   });
  // }

  handleAddCollection() {
    const { User, dispatch } = this.props;
    if (this.state.errorText) {
      dispatch(snackBarOpen(this.state.errorText));
      this.handleClose();
      return;
    }
    this.handleClose();
    insertCollection.call({
      name: this.state.newColName,
      uid: User._id,
    }, (err) => {
      if (err) {
        dispatch(snackBarOpen('新建相册失败'));
        throw new Meteor.Error(err);
      }
      dispatch(snackBarOpen('新建相册成功'));
    });
  }

  renderColHolder() {
    const { curUser, cols } = this.props;
    return cols.map((col) => (
      <ColHolder key={col._id} User={curUser} col={col} />
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
    const { User, isMine, dataIsReady } = this.props;
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
        <NavHeader User={User} location={this.state.location} primary />
        <div className="content">
          <Recap
            title="Collection"
            detailFir="所有经过分类的图片都在这里"
            detailSec="没有分类的图片都在默认分类集里"
          />
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
        { isMine ? (
          <FloatingActionButton
            style={styles.floatBtn}
            onTouchTap={() => { this.setState({ open: true }); }}
            secondary
          >
            <AddIcon />
          </FloatingActionButton>
        ) : null }
      </div>
    );
  }

}

Collection.propTypes = {
  User: PropTypes.object,
  curUser: PropTypes.object.isRequired,
  dataIsReady: PropTypes.bool.isRequired,
  isMine: PropTypes.bool.isRequired,
  cols: PropTypes.array.isRequired,
  dispatch: PropTypes.func,
};

const MeteorContainer = createContainer(({ params }) => {
  const { username } = params;
  // 若访问的是自己的所有相册页面，返回所有相册（包括加锁相册）, 否则只返回公开相册
  const isMine = Meteor.user().username === username;
  const userHandler = Meteor.subscribe('Users.all');
  const colHandler = isMine
                          ? Meteor.subscribe('Collections.own')
                          : Meteor.subscribe('Collections.targetUser', username);
  const dataIsReady = userHandler.ready() && colHandler.ready();
  const curUser = Meteor.users.findOne({ username }) || {};
  const cols = Collections.find({ user: username }, { sort: { createdAt: -1 } }).fetch();
  return {
    cols,
    isMine,
    curUser,
    dataIsReady,
  };
}, Collection);

export default connect()(MeteorContainer);
