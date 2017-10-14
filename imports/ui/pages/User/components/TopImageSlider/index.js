import PropTypes from 'prop-types';
import React from 'react';
import settings from '/imports/utils/settings';
import Slider from '/imports/ui/components/Slider';

const { imageDomain } = settings;

const TopImageSlider = ({ curUser, topImages }) => (
  <Slider
    visibleNum={4}
    gap={10}
  >
    {
      topImages.map((image) => {
        const src = `${imageDomain}/${curUser.username}/${image.collection}/${image.name}.${image.type}`;
        return (
          <div key={image._id} style={{ padding: '10px' }}>
            <img
              style={{ width: '100%' }}
              src={`${src}?imageView2/1/w/240/h/300`}
              alt={image.name}
            />
          </div>
        );
      })
    }
  </Slider>
);

TopImageSlider.propTypes = {
  curUser: PropTypes.object.isRequired,
  topImages: PropTypes.array.isRequired,
};

export default TopImageSlider;
