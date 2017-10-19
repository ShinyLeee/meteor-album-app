import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SwipeableViews from 'react-swipeable-views';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import withLoadable from '/imports/ui/hocs/withLoadable';
import DataLoader from '/imports/ui/components/Loader/DataLoader';

const AsyncOwnView = withLoadable({
  loader: () => import('../containers/OwnContainer'),
  loading: DataLoader,
});

const AsyncFollowingView = withLoadable({
  loader: () => import('../containers/FollowingContainer'),
  loading: DataLoader,
});

export default class AllCollectionContent extends Component {
  static propTypes = {
    slideIndex: PropTypes.number.isRequired,
    onViewChange: PropTypes.func.isRequired,
  }

  render() {
    const { slideIndex } = this.props;
    return (
      <ContentLayout
        loading={false}
        deep
      >
        <SwipeableViews
          className="content__allCollections"
          index={slideIndex}
          onChangeIndex={this.props.onViewChange}
        >
          <AsyncOwnView />
          <AsyncFollowingView />
        </SwipeableViews>
      </ContentLayout>
    );
  }
}
