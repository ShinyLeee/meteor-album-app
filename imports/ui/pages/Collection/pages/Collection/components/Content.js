import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import ConnectedJustified from '/imports/ui/components/JustifiedLayout';
import PhotoSwipeHolder from './PhotoSwipeHolder';

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
    curColl: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
  }

  get images() {
    return this.props.curColl.images().fetch();
  }


  render() {
    const { dataIsReady, curColl, isEditing } = this.props;
    const images = this.images;
    return (
      <ContentLayout
        loading={!dataIsReady}
      >
        {
          dataIsReady && (
            <div className="content__collPics">
              <header className="collPics__header">
                <h2 className="collPics__name">{curColl.name}</h2>
                <div className="collPics__duration">{getDuration(images)}</div>
              </header>
              {
              images.length > 0 && (
                <ConnectedJustified
                  isEditing={isEditing}
                  images={images}
                />
              )
            }
            </div>
          )
        }
        <PhotoSwipeHolder />
      </ContentLayout>
    );
  }
}
