import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Database Model
import { Images } from '../../api/images/image.js';

import Recap from '../components/Recap.jsx';
import PicHolder from '../components/PicHolder.jsx';

class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: 'Index',
    };
  }

  renderPicHolder() {
    const filteredImages = this.props.images;
    return filteredImages.map((image) => <PicHolder key={image._id} image={image} />);
  }

  render() {
    return (
      <div className="content">
        <Recap
          title="Gallery"
          detailFir="Vivian的私人相册"
          detailSec="Created By Simon Lee"
        />
        {this.renderPicHolder()}
      </div>
    );
  }

}

Index.propTypes = {
  images: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('Images.all');
  return {
    images: Images.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, Index);
