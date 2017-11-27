import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SwipeableViews from 'react-swipeable-views';
import OwnView from '../containers/OwnContainer';
import FollowingView from '../containers/FollowingContainer';

export default class AllCollectionContent extends Component {
  static propTypes = {
    slideIndex: PropTypes.number.isRequired,
    onViewChange: PropTypes.func.isRequired,
  }

  render() {
    const { slideIndex } = this.props;
    return (
      <SwipeableViews
        index={slideIndex}
        onChangeIndex={this.props.onViewChange}
      >
        <OwnView />
        <FollowingView />
      </SwipeableViews>
    );
  }
}
