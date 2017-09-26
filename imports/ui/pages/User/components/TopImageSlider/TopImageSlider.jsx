import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import Slider from '/imports/ui/components/Slider';

const domain = Meteor.settings.public.imageDomain;

const TopImageSlider = ({ curUser, topImages }) => (
  <Slider
    visibleNum={4}
    gap={10}
  >
    {
      topImages.map((image, i) => {
        const src = `${domain}/${curUser.username}/${image.collection}/${image.name}.${image.type}`;
        return (
          <div key={i} style={{ padding: '10px' }}>
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

TopImageSlider.defaultProps = {
  topImages: [],
};

TopImageSlider.propTypes = {
  curUser: PropTypes.object.isRequired,
  topImages: PropTypes.array.isRequired,
};

export default TopImageSlider;
