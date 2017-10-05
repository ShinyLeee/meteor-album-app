import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import blue from 'material-ui/colors/blue';
import RootLayout from '/imports/ui/layouts/RootLayout';
import { SecondaryNavHeader } from '/imports/ui/components/NavHeader';
import OwnCollections from './components/Own';
import FollowingCollections from './components/Following';

const blue500 = blue[500];

class AllCollectionPage extends Component {
  static propTypes = {
    User: PropTypes.object,
    dataIsReady: PropTypes.bool.isRequired,
    isGuest: PropTypes.bool.isRequired, // based on isGuest render different content
    curUser: PropTypes.object.isRequired,
    colls: PropTypes.array.isRequired,
    existCollNames: PropTypes.array, // not required bc only Owner use it
    classes: PropTypes.object.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    slideIndex: 0,
  }

  _handleChangeIndex = (index) => {
    this.setState({
      slideIndex: index,
    });
  }

  renderContent() {
    const { isGuest, curUser, colls, existCollNames } = this.props;
    return (
      <SwipeableViews
        className="content__allCollections"
        index={this.state.slideIndex}
        onChangeIndex={this._handleChangeIndex}
      >
        <OwnCollections
          isGuest={isGuest}
          curUser={curUser}
          colls={colls.filter(coll => coll.user === curUser.username)}
          existCollNames={existCollNames}
        />
        <FollowingCollections
          isGuest={isGuest}
          curUser={curUser}
          colls={colls.filter(coll => coll.user !== curUser.username)}
        />
      </SwipeableViews>
    );
  }

  render() {
    const { isGuest, curUser, dataIsReady, classes } = this.props;
    return (
      <RootLayout
        deep
        loading={!dataIsReady}
        Topbar={<SecondaryNavHeader title={isGuest ? `${curUser.username}的相册` : '我的相册'} />}
      >
        <AppBar className={classes.appbar} position="fixed" color="primary">
          <Tabs
            value={this.state.slideIndex}
            onChange={(e, index) => this._handleChangeIndex(index)}
            indicatorClassName={classes.indicator}
            textColor="inherit"
            fullWidth
          >
            <Tab label={isGuest ? `${curUser.username}的` : '我的'} value={0} />
            <Tab label={isGuest ? `${curUser.username}关注的` : '已关注'} value={1} />
          </Tabs>
        </AppBar>
        { dataIsReady && this.renderContent() }
      </RootLayout>
    );
  }
}

const styles = {
  appbar: {
    top: 64,
    backgroundColor: blue500,
    boxShadow: 'none',
  },

  indicator: {
    backgroundColor: '#fff',
  },
};

export default withStyles(styles)(AllCollectionPage);
