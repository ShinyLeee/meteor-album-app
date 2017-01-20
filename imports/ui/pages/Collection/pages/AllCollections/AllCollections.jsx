import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import { insertCollection } from '/imports/api/collections/methods.js';
import { getRandomInt } from '/imports/utils/utils.js';

import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import Recap from '/imports/ui/components/Recap/Recap.jsx';
import EmptyHolder from '/imports/ui/components/EmptyHolder/EmptyHolder.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';
import CollHolder from './components/CollHolder/CollHolder.jsx';

export default class AllCollectionPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      newCollName: '',
      errorText: '',
      location: 'collection',
    };
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleChangeCollName = this.handleChangeCollName.bind(this);
    this.handleAddCollection = this.handleAddCollection.bind(this);
  }

  componentWillMount() {
    if (this.props.colls) {
      const existCollNames = this.props.colls.map((col) => col.name);
      this.setState({ existCollNames });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.colls !== nextProps.colls) {
      const existCollNames = nextProps.colls.map((coll) => coll.name);
      this.setState({ existCollNames });
    }
  }

  handleCloseDialog() {
    this.setState({ open: false, newCollName: '', errorText: '' });
  }

  handleChangeCollName(e) {
    const newCollName = e.target.value;
    if (newCollName.length > 10) {
      this.setState({ errorText: '相册名不能超过十个字符' });
    } else if (this.state.existCollNames.indexOf(newCollName) >= 0) {
      this.setState({ errorText: '该相册已存在' });
    } else {
      this.setState({ newCollName, errorText: '' });
    }
  }

  handleAddCollection() {
    if (this.state.errorText) {
      this.props.snackBarOpen(this.state.errorText);
      this.handleCloseDialog();
      return;
    }
    this.handleCloseDialog();
    insertCollection.call({
      name: this.state.newCollName,
      user: this.props.User.username,
      cover: `/img/pattern/VF_ac${getRandomInt(1, 28)}.jpg`,
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

  renderContent() {
    if (this.props.colls.length === 0) {
      return (
        <EmptyHolder
          mainInfo="你还尚未创建相册"
          secInfo="点击右下角按钮创建属于自己的相册吧"
        />
      );
    }
    return (
      <div className="content__allCollection">
        {
          this.props.colls.map((coll) => (
            <CollHolder
              key={coll._id}
              User={this.props.curUser}
              coll={coll}
            />
          ))
        }
      </div>
    );
  }

  render() {
    const actions = [
      <FlatButton
        label="取消"
        onTouchTap={this.handleCloseDialog}
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
        { this.props.isGuest
          ? (
            <NavHeader
              User={this.props.User}
              title="相册"
              iconElementLeft={
                <IconButton onTouchTap={() => browserHistory.goBack()}>
                  <ArrowBackIcon />
                </IconButton>
              }
            />)
          : (
            <NavHeader
              User={this.props.User}
              location={this.state.location}
              primary
            />)
        }
        <div className="content">
          { !this.props.dataIsReady && (<Loading />) }
          { this.props.isGuest
            ? (
              <Recap
                title={this.props.curUser.username}
                detailFir={this.props.curUser.profile.intro || '暂无简介'}
              />
            )
            : this.props.colls.length > 0 && (
              <Recap
                title="Collections"
                detailFir="所有创建相册都在这里"
                detailSec="可以点击右下角的按钮添加相册"
              />
            )
          }
          { this.props.dataIsReady && this.renderContent() }
          <div className="dialog">
            <Dialog
              title="新建相册"
              actions={actions}
              open={this.state.open}
              onRequestClose={this.handleCloseDialog}
              modal
            >
              <TextField
                hintText="相册名"
                onChange={this.handleChangeCollName}
                errorText={this.state.errorText}
                fullWidth
              />
            </Dialog>
          </div>
        </div>
        { !this.props.isGuest && (
          <div className="component__FloatBtn">
            <FloatingActionButton
              onTouchTap={() => this.setState({ open: true })}
              secondary
            ><AddIcon />
            </FloatingActionButton>
          </div>)
        }
      </div>
    );
  }

}

AllCollectionPage.displayName = 'AllCollectionPage';

AllCollectionPage.propTypes = {
  User: PropTypes.object,
  // Below Pass from database
  dataIsReady: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  curUser: PropTypes.object.isRequired,
  colls: PropTypes.array.isRequired,
  // Below Pass from Redux
  snackBarOpen: PropTypes.func.isRequired,
};
