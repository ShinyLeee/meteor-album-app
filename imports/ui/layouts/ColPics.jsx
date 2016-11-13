import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import CircularProgress from 'material-ui/CircularProgress';
import AddIcon from 'material-ui/svg-icons/content/add';

import { Images } from '/imports/api/images/image.js';

import NavHeader from '../components/NavHeader.jsx';
import Recap from '../components/Recap.jsx';
import Justified from '../components/Justified.jsx';

class ColPics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 'collection',
      isLoading: false,
    };
  }

  render() {
    const { User, colName, dataIsReady } = this.props;
    if (!dataIsReady) {
      return (
        <div className="container">
          <NavHeader
            User={User}
            location={this.state.location}
          />
          <div className="content text-center">
            <CircularProgress style={{ top: '150px' }} size={1} />
          </div>
        </div>
      );
    }
    const styles = {
      floatBtn: {
        position: 'fixed',
        right: '16px',
        bottom: '16px',
      },
    };
    return (
      <div className="container">
        <NavHeader
          User={User}
          location={this.state.location}
        />
        <div className="content">
          <Recap
            title="Collection"
            detailFir={colName}
          />
          <Justified images={this.props.images} />
        </div>
        <FloatingActionButton
          style={styles.floatBtn}
          containerElement={<Link to="/upload" />}
          secondary
        >
          <AddIcon />
        </FloatingActionButton>
      </div>
    );
  }

}

ColPics.propTypes = {
  User: PropTypes.object,
  dataIsReady: PropTypes.bool.isRequired,
  colName: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
};

export default createContainer(({ params }) => {
  const { colName } = params;
  const imageHandle = Meteor.subscribe('Images.inCollection', colName);
  const dataIsReady = imageHandle.ready();
  const images = Images.find({}, {
    sort: { createdAt: -1 },
  }).fetch();
  return {
    colName,
    images,
    dataIsReady,
  };
}, ColPics);
