import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import SwipeableViews from 'react-swipeable-views';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Tabs, Tab } from 'material-ui/Tabs';
import { blue500 } from 'material-ui/styles/colors';
import { insertCollection } from '/imports/api/collections/methods.js';
import { getRandomInt } from '/imports/utils/utils.js';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary/Secondary.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';
import OwnCollections from './components/Own/Own.jsx';
import FollowingCollections from './components/Following/Following.jsx';

export default class AllCollectionPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      newCollName: '',
      errorText: '',
      slideIndex: 0,
    };
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleChangeCollName = this.handleChangeCollName.bind(this);
    this.handleAddCollection = this.handleAddCollection.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleCloseDialog() {
    this.setState({ open: false, newCollName: '', errorText: '' });
  }

  handleChangeCollName(e) {
    const { existCollNames } = this.props;
    const newCollName = e.target.value;
    if (newCollName.length > 10) {
      this.setState({ errorText: '相册名不能超过十个字符' });
    } else if (existCollNames.indexOf(newCollName) >= 0) {
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
    insertCollection.callPromise({
      name: this.state.newCollName,
      user: this.props.User.username,
      cover: `/img/pattern/VF_ac${getRandomInt(1, 28)}.jpg`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .then(() => {
      this.props.snackBarOpen('新建相册成功');
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen('新建相册失败');
      throw new Meteor.Error(err);
    });
  }

  handleTabChange(value) {
    this.setState({
      slideIndex: value,
    });
  }

  render() {
    const { isGuest, curUser, dataIsReady, colls } = this.props;
    return (
      <div className="container deep">
        <SecondaryNavHeader
          title={isGuest ? `${curUser.username}的相册` : '我的相册'}
          style={{ boxShadow: '' }}
        >
          <Tabs
            onChange={this.handleTabChange}
            value={this.state.slideIndex}
            tabItemContainerStyle={{ backgroundColor: blue500 }}
            inkBarStyle={{ backgroundColor: '#fff' }}
          >
            <Tab label={isGuest ? `${curUser.username}的` : '我的'} value={0} />
            <Tab label={isGuest ? `${curUser.username}关注的` : '已关注'} value={1} />
          </Tabs>
        </SecondaryNavHeader>
        <main className="content deep">
          {
            dataIsReady
            ? (
              <SwipeableViews
                className="content__allCollections"
                index={this.state.slideIndex}
                onChangeIndex={this.handleTabChange}
              >
                <OwnCollections
                  isGuest={isGuest}
                  curUser={curUser}
                  colls={colls.filter(coll => coll.user === curUser.username)}
                  onAddClick={() => this.setState({ open: true })}
                />
                <FollowingCollections
                  isGuest={isGuest}
                  curUser={curUser}
                  colls={colls.filter(coll => coll.user !== curUser.username)}
                />
              </SwipeableViews>
            )
            : (<Loading style={{ top: '112px' }} />)
          }
          <Dialog
            title="新建相册"
            actions={[
              <FlatButton
                label="取消"
                onTouchTap={this.handleCloseDialog}
                primary
              />,
              <FlatButton
                label="新建"
                onTouchTap={this.handleAddCollection}
                disabled={!this.state.newCollName}
                primary
              />,
            ]}
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
        </main>
      </div>
    );
  }

}

AllCollectionPage.displayName = 'AllCollectionPage';

AllCollectionPage.propTypes = {
  User: PropTypes.object,
  // Below Pass from Database and Redux
  dataIsReady: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired, // based on isGuest render different content
  curUser: PropTypes.object.isRequired,
  colls: PropTypes.array.isRequired,
  existCollNames: PropTypes.array, // not required bc only Owner use it
  snackBarOpen: PropTypes.func.isRequired,
};
