import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CircularProgress from 'material-ui/CircularProgress';
import AddIcon from 'material-ui/svg-icons/content/add';
import { Collections } from '/imports/api/collections/collection.js';
import { Notes } from '/imports/api/notes/note.js';
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

class CollectionPage extends Component {
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
      user: User.username,
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
    if (cols.length === 0) {
      return (
        <div className="Empty">
          <div className="Empty__container">
            <img className="Empty__logo" src="/img/empty.png" role="presentation" />
            <h2 className="Empty__header">Oops</h2>
            <p className="Empty__info">你还尚未创建相册</p>
            <p className="Empty__info">点击右下角按钮创建属于自己的相册吧</p>
          </div>
        </div>
      );
    }
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
            <NavHeader
              User={User}
              title="相册"
              iconElementLeft={
                <IconButton onTouchTap={() => browserHistory.goBack()}>
                  <ArrowBackIcon />
                </IconButton>
              }
            />)
          : (<NavHeader User={User} location={this.state.location} noteNum={noteNum} primary />)
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

CollectionPage.propTypes = {
  User: PropTypes.object,
  dispatch: PropTypes.func,
  // Below is pass from database
  dataIsReady: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  curUser: PropTypes.object.isRequired,
  cols: PropTypes.array.isRequired,
  noteNum: PropTypes.number.isRequired,
};

const preCurUser = Meteor.settings.public.preCurUser;

const MeteorContainer = createContainer(({ params }) => {
  const { username } = params;
  const User = Meteor.user();
  let isGuest = !User;  // if User is null, isGuest is true
  // if User exist and its name equal with params.username, isGuest is false
  if (User && User.username === username) isGuest = false;
  else isGuest = true;

  const userHandler = Meteor.subscribe('Users.all');
  const colHandler = Meteor.subscribe('Collections.targetUser', username);
  const noteHandler = Meteor.subscribe('Notes.own');
  const dataIsReady = userHandler.ready() && colHandler.ready() && noteHandler.ready();
  const curUser = Meteor.users.findOne({ username }) || preCurUser;
  const cols = Collections.find({}, { sort: { createdAt: -1 } }).fetch();
  const noteNum = Notes.find({ isRead: { $ne: true } }).count();
  return {
    dataIsReady,
    isGuest,
    curUser,
    cols,
    noteNum,
  };
}, CollectionPage);

export default connect()(MeteorContainer);
