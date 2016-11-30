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
      location: 'collection',
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleConfirmAdd = this.handleConfirmAdd.bind(this);
    this.handleAddCollection = this.handleAddCollection.bind(this);
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleChange(e) {
    this.setState({ newColName: e.target.value });
  }

  handleConfirmAdd() {
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
  }

  handleAddCollection() {
    const { User, dispatch } = this.props;
    this.handleClose();
    insertCollection.call({
      name: this.state.newColName,
      uid: User._id,
    }, (err) => {
      if (err) {
        dispatch(snackBarOpen('新建相册失败，请联系管理员'));
        throw new Meteor.Error(err);
      }
      dispatch(snackBarOpen('新建相册成功'));
    });
  }

  renderColHolder() {
    const { User, cols } = this.props;
    return cols.map((col) => (
      <ColHolder key={col._id} User={User} col={col} />
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
    const { User, dataIsReady } = this.props;
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
                errorText={this.state.newColName.length > 10 ? '不能超过10个字符' : null}
                fullWidth
              />
            </Dialog>
          </div>
        </div>
        <FloatingActionButton
          style={styles.floatBtn}
          onTouchTap={() => { this.setState({ open: true }); }}
          secondary
        >
          <AddIcon />
        </FloatingActionButton>
      </div>
    );
  }

}

Collection.propTypes = {
  User: PropTypes.object,
  dataIsReady: PropTypes.bool.isRequired,
  cols: PropTypes.array.isRequired,
  dispatch: PropTypes.func,
};

const MeteorContainer = createContainer(() => {
  const colHandle = Meteor.subscribe('Collections.own');
  const dataIsReady = colHandle.ready();
  const cols = Collections.find({}, { sort: { createdAt: -1 } }).fetch();
  return {
    cols,
    dataIsReady,
  };
}, Collection);

export default connect()(MeteorContainer);
