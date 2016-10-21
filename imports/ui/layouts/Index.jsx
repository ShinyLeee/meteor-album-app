import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import NotificationIcon from 'material-ui/svg-icons/social/notifications';
import { purple500 } from 'material-ui/styles/colors';

// Database Model
import { Images } from '../../api/images/image.js';

import Recap from '../components/Recap.jsx';
import PicHolder from '../components/PicHolder.jsx';

class Index extends Component {

  constructor(props) {
    super(props);
    this.handleTitleTouchTap = this.handleTitleTouchTap.bind(this);
    this.handleAppBarAction = this.handleAppBarAction.bind(this);
  }

  handleTitleTouchTap() {
    this.context.router.replace('/');
  }

  handleAppBarAction(e, action) {
    switch (action) {
      case 'search':
        break;
      case 'notification':
        break;
      case 'user':
        this.context.router.push('/user');
        break;
      default:
        break;
    }
  }

  renderPicHolder() {
    const filteredImages = this.props.images;
    return filteredImages.map((image) => <PicHolder key={image._id} image={image} />);
  }

  render() {
    const { User, dataIsReady } = this.props;
    const styles = {
      AppBar: {
        position: 'fixed',
        backgroundColor: purple500,
      },
      AppBarTitle: {
        cursor: 'pointer',
      },
      AppBarIcon: {
        top: '8px',
      },
      AppBarIconSvg: {
        width: '28px',
        height: '28px',
        color: '#fff',
      },
      AppBarIconBtnForAvatar: {
        left: '10px',
        bottom: '6px',
        padding: 0,
      },
      AppBarIconElementRight: {
        marginTop: 0,
        marginRight: 0,
      },
    };
    let avatarSrc;
    if (User) {
      avatarSrc = User.profile.avatar;
    } else {
      avatarSrc = 'http://odsiu8xnd.bkt.clouddn.com/vivian/default-avatar.jpg';
    }
    if (!dataIsReady) {
      return (
        <div className="container">
          <AppBar
            style={styles.AppBar}
            title="Gallery +"
            titleStyle={styles.AppBarTitle}
            iconElementRight={
              <div>
                <IconButton style={styles.AppBarIcon} iconStyle={styles.AppBarIconSvg}>
                  <SearchIcon />
                </IconButton>
                <IconButton style={styles.AppBarIcon} iconStyle={styles.AppBarIconSvg}>
                  <NotificationIcon />
                </IconButton>
                <IconButton style={styles.AppBarIconBtnForAvatar}>
                  <Avatar src={avatarSrc} />
                </IconButton>
              </div>
            }
            iconStyleRight={styles.AppBarIconElementRight}
          />
          <div className="content text-center">
            <CircularProgress style={{ top: '150px' }} size={1} />
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <AppBar
          style={styles.AppBar}
          title="Gallery +"
          titleStyle={styles.AppBarTitle}
          onTitleTouchTap={this.handleTitleTouchTap}
          iconElementRight={
            <div>
              <IconButton
                style={styles.AppBarIcon}
                iconStyle={styles.AppBarIconSvg}
                onTouchTap={(e) => this.handleAppBarAction(e, 'search')}
              >
                <SearchIcon />
              </IconButton>
              <IconButton
                style={styles.AppBarIcon}
                iconStyle={styles.AppBarIconSvg}
                onTouchTap={(e) => this.handleAppBarAction(e, 'notification')}
              >
                <NotificationIcon />
              </IconButton>
              <IconButton
                style={styles.AppBarIconBtnForAvatar}
                onTouchTap={(e) => this.handleAppBarAction(e, 'user')}
              >
                <Avatar src={User.profile.avatar} />
              </IconButton>
            </div>
          }
          iconStyleRight={styles.AppBarIconElementRight}
        />
        <div className="content">
          <Recap
            title="Gallery"
            detailFir="Vivian的私人相册"
            detailSec="Created By Shiny Lee"
          />
          {this.renderPicHolder()}
        </div>
      </div>
    );
  }

}

Index.propTypes = {
  dataIsReady: PropTypes.bool.isRequired,
  User: PropTypes.object,
  images: PropTypes.array.isRequired,
};

// If contextTypes is not defined, then context will be an empty object.
Index.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const User = Meteor.user();
  const imageHandle = Meteor.subscribe('Images.all');
  const images = Images.find({}, { sort: { createdAt: -1 } }).fetch();
  const dataIsReady = !!User && imageHandle.ready();
  return {
    User,
    images,
    dataIsReady,
  };
}, Index);
