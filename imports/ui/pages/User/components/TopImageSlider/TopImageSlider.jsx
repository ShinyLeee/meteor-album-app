import React, { PropTypes } from 'react';
import Slider from 'react-slick';
import '/node_modules/slick-carousel/slick/slick.css';
import '/node_modules/slick-carousel/slick/slick-theme.css';
import './slick.css';

const TopImageSlider = ({ domain, curUser, topImages }) => (
  <Slider
    slidesToScroll={3}
    slidesToShow={3}
    speed={500}
    infinite={false}
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
  domain: PropTypes.string.isRequired,
  curUser: PropTypes.object.isRequired,
  topImages: PropTypes.array.isRequired,
};

export default TopImageSlider;
