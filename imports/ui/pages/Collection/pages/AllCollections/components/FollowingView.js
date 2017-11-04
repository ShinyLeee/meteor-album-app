import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CollList from '/imports/ui/components/CollList';
import DataLoader from '/imports/ui/components/Loader/DataLoader';

export default class FollowingView extends Component {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    colls: PropTypes.array.isRequired,
  }

  render() {
    const { dataIsReady, colls } = this.props;
    if (!dataIsReady) {
      return <DataLoader />;
    }
    return (
      <CollList
        colls={colls}
        showUser
      />
    );
  }
}
