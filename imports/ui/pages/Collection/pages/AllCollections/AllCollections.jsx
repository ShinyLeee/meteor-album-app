import React, { Component, PropTypes } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { Tabs, Tab } from 'material-ui/Tabs';
import { blue500 } from 'material-ui/styles/colors';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary/Secondary.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';
import OwnCollections from './components/Own/Own.jsx';
import FollowingCollections from './components/Following/Following.jsx';

export default class AllCollectionPage extends Component {
  static propTypes = {
    // Below Pass from Database and Redux
    User: PropTypes.object,
    dataIsReady: PropTypes.bool.isRequired,
    isGuest: PropTypes.bool.isRequired, // based on isGuest render different content
    curUser: PropTypes.object.isRequired,
    colls: PropTypes.array.isRequired,
    existCollNames: PropTypes.array, // not required bc only Owner use it
    snackBarOpen: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
    };
  }

  _handleTabChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  }

  render() {
    const {
      isGuest,
      curUser,
      dataIsReady,
      colls,
      existCollNames,
    } = this.props;
    return (
      <div className="container deep">
        <SecondaryNavHeader
          title={isGuest ? `${curUser.username}的相册` : '我的相册'}
          style={{ boxShadow: '' }}
        >
          <Tabs
            onChange={this._handleTabChange}
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
                onChangeIndex={this._handleTabChange}
              >
                <OwnCollections
                  isGuest={isGuest}
                  curUser={curUser}
                  colls={colls.filter(coll => coll.user === curUser.username)}
                  existCollNames={existCollNames}
                  snackBarOpen={this.props.snackBarOpen}
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
        </main>
      </div>
    );
  }

}
