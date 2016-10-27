import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import CircularProgress from 'material-ui/CircularProgress';
import AddIcon from 'material-ui/svg-icons/content/add';

import { Images } from '/imports/api/images/image.js';

import Infinity from '../components/Infinity.jsx';
import NavHeader from '../components/NavHeader.jsx';
import Recap from '../components/Recap.jsx';
import PicHolder from '../components/PicHolder.jsx';

import { makeCancelable } from '../../utils/utils.js';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 'home',
      isLoading: false,
      limit: 2,
    };
    this.addImageFromDB = this.addImageFromDB.bind(this);
    this.handleLoadImage = this.handleLoadImage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // When dataIsReady return true start setState
    if (nextProps.dataIsReady) {
      this.setState({
        images: nextProps.images,
      });
    }
  }

  componentWillUnmount() {
    this.loadTimeout.cancel(); // Cancel the promise
    // clearTimeout(this.loadTimeout);
  }

  addImageFromDB() {
    const images = this.state.images;
    const limit = this.state.limit;
    const skip = images.length;
    const tempImg = Images.find({}, {
      sort: { createdAt: -1 },
      limit,
      skip,
    }).fetch();
    tempImg.map((image) => images.push(image));
    return;
  }

  handleLoadImage() {
    const loadImage = new Promise((resolve) => {
      this.setState({ isLoading: true });
      setTimeout(this.addImageFromDB, 1500);
      setTimeout(resolve, 1500);
    });

    this.loadTimeout = makeCancelable(loadImage);
    this.loadTimeout
      .promise
      .then(() => this.setState({ isLoading: false }))
      .then(() => console.log('over'))
      .catch((err) => console.log(err));


    // this.loadTimeout
    // .promise
    // .then(() => {
    //   console.log('resolved');
    //   setTimeout(this.addImageFromDB, 1500);
    // })
    // .catch((reason) => console.log('isCanceled', reason.isCanceled));
    // this.setState({ isLoading: true });
    // this.loadTimeout = setTimeout(this.addImageFromDB, 1500);
  }

  renderPicHolder() {
    const images = this.state.images;
    images.map((image) => {
      const img = image;
      const users = Meteor.users.find({}).fetch();
      users.map((user) => {
        if (user._id === img.uid) {
          img.username = user.username;
          img.avatar = user.profile.avatar;
        }
        return img;
      });
      return img;
    });
    return images.map((image) => (
      <PicHolder key={image._id} User={this.props.User} image={image} />
    ));
  }

  renderInfinite() {
    return (<Infinity
      onInfinityLoad={this.handleLoadImage}
      isLoading={this.state.isLoading}
    >
      {this.renderPicHolder()}
    </Infinity>
    );
  }

  render() {
    const { User, dataIsReady, isGuest } = this.props;
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
    if (isGuest) {
      return (
        <div className="container">
          <NavHeader
            location={this.state.location}
          />
          <div className="content">
            <Recap
              title="Gallery"
              detailFir="Vivian的私人相册"
              detailSec="Created By Shiny Lee"
            />
            {this.renderInfinite()}
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
            title="Gallery"
            detailFir="Vivian的私人相册"
            detailSec="Created By Shiny Lee"
          />
          {this.renderInfinite()}
        </div>
        <FloatingActionButton
          containerElement={<Link to="/upload" />}
          style={styles.floatBtn}
          secondary
        >
          <AddIcon />
        </FloatingActionButton>
      </div>
    );
  }

}

Index.propTypes = {
  isGuest: PropTypes.bool.isRequired,
  dataIsReady: PropTypes.bool.isRequired,
  User: PropTypes.object,
  images: PropTypes.array.isRequired,
};

// If contextTypes is not defined, then context will be an empty object.
Index.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default createContainer(() => {
  let isGuest;
  let dataIsReady;
  Meteor.subscribe('Users.allUser');
  const User = Meteor.user();
  const imageHandle = Meteor.subscribe('Images.all');
  const images = Images.find({}, {
    sort: { createdAt: -1 },
    limit: 2,
  }).fetch();
  if (typeof User === 'undefined' || User) {
    isGuest = false;
    dataIsReady = imageHandle.ready() && !!User;
  } else {
    isGuest = true;
    dataIsReady = imageHandle.ready();
  }
  return {
    User,
    images,
    dataIsReady,
    isGuest,
  };
}, Index);
