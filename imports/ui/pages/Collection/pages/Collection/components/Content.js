import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import ConnectedJustified from '/imports/ui/components/JustifiedLayout';
import PhotoSwipeHolder from './PhotoSwipeHolder';
import { Header, Title, SubTitle } from '../styles';

const getDuration = (images) => {
  let duration;
  const imgLen = images.length;
  if (imgLen === 0) {
    duration = '暂无相片';
  } else if (imgLen === 1) {
    duration = moment(images[0].shootAt).format('YYYY年MM月DD日');
  } else if (imgLen > 1) {
    const start = moment(images[imgLen - 1].shootAt).format('YYYY年MM月DD日');
    const end = moment(images[0].shootAt).format('YYYY年MM月DD日');
    duration = `${start} - ${end}`;
  }
  return duration;
};

export default class CollectionContent extends Component {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    images: PropTypes.array.isRequired,
    match: PropTypes.object.isRequired,
  }

  render() {
    const { dataIsReady, images, isEditing, match } = this.props;
    const { cname } = match.params;
    return (
      <ContentLayout
        loading={!dataIsReady}
        delay
      >
        <Header>
          <Title>{cname}</Title>
          <SubTitle>{getDuration(images)}</SubTitle>
        </Header>
        {
          images.length > 0 && (
            <ConnectedJustified
              isEditing={isEditing}
              images={images}
            />
          )
        }
        <PhotoSwipeHolder />
      </ContentLayout>
    );
  }
}
