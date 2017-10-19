import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CollHolder from '/imports/ui/components/CollHolder';
import DataLoader from '/imports/ui/components/Loader/DataLoader';
import { TabView } from '../styles';

export default class FollowingView extends Component {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    colls: PropTypes.array.isRequired,
  }

  state = {
    colls: this.generateColls(),
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.colls !== nextProps.colls) {
      const newColls = this.generateColls(nextProps);
      this.setState({ colls: newColls });
    }
  }

  generateColls(props = this.props) {
    return props.colls.map((coll) => {
      const newColl = coll;
      newColl.userAvatar = Meteor.users.findOne({ username: coll.user }).profile.avatar;
      return newColl;
    });
  }

  render() {
    const { dataIsReady } = this.props;
    if (!dataIsReady) {
      return <DataLoader />;
    }
    return (
      <TabView>
        {
          this.state.colls.map((coll) => (
            <CollHolder
              key={coll._id}
              avatarSrc={coll.userAvatar}
              coll={coll}
              showUser
            />
          ))
        }
      </TabView>
    );
  }
}
