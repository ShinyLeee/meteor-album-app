import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import AddPhotoIcon from 'material-ui/svg-icons/image/add-to-photos';
import ShareIcon from 'material-ui/svg-icons/social/share';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { Images } from '/imports/api/images/image.js';

import NavHeader from '../components/NavHeader.jsx';
import Recap from '../components/Recap.jsx';
import Justified from '../components/Justified.jsx';

import { uploaderStart } from '../actions/actionTypes.js';

const styles = {
  AppBarIconSvg: {
    width: '26px',
    height: '26px',
    color: '#fff',
  },
  floatBtn: {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
  },
};

class ColPics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
    this.handleOpenUploader = this.handleOpenUploader.bind(this);
    this.handleShareCollection = this.handleShareCollection.bind(this);
  }

  componentWillMount() {
    this.fetchJsonData();
  }

  fetchJsonData() {
    const { User, colName } = this.props;
    fetch('/api/uptoken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: User.username,
        collection: colName,
      }),
    })
    .then((res) => res.json())
    .then((data) => this.setState({ data }))
    .catch((ex) => {
      console.log('parsing failed', ex); // eslint-disable-line no-console
    });
  }

  handleOpenUploader() {
    const { dispatch } = this.props;
    const { data } = this.state;
    document.getElementById('uploader').click();
    dispatch(uploaderStart(data));
  }

  handleShareCollection() {}

  renderIconEleRight() {
    return (
      <div>
        <IconButton
          iconStyle={styles.AppBarIconSvg}
          onTouchTap={this.handleOpenUploader}
        >
          <AddPhotoIcon />
        </IconButton>
        <IconButton
          iconStyle={styles.AppBarIconSvg}
          onTouchTap={this.handleShareCollection}
        >
          <ShareIcon />
        </IconButton>
        <IconMenu
          iconButtonElement={
            <IconButton iconStyle={styles.AppBarIconSvg}><MoreVertIcon /></IconButton>
          }
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        >
          <MenuItem primaryText="下载所有图片" />
          <MenuItem primaryText="设置相册封面" />
          <MenuItem primaryText="编辑相册" />
          <MenuItem primaryText="删除相册" />
        </IconMenu>
      </div>
    );
  }

  renderLoader() {
    return (
      <div className="content text-center">
        <CircularProgress style={{ top: '150px' }} size={1} />
      </div>
    );
  }

  render() {
    const { User, colName, images, dataIsReady } = this.props;
    return (
      <div className="container">
        <NavHeader
          User={User}
          title="收藏集"
          iconElementLeft={
            <IconButton containerElement={<Link to="/collection" />}>
              <ArrowBackIcon />
            </IconButton>
          }
          iconElementRight={this.renderIconEleRight()}
        />
        <div className="content">
          <Recap title="Collection" detailFir={colName} />
          { dataIsReady ? <Justified images={images} /> : this.renderLoader() }
        </div>
      </div>
    );
  }

}

ColPics.propTypes = {
  User: PropTypes.object,
  dataIsReady: PropTypes.bool.isRequired,
  colName: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
  dispatch: PropTypes.func,
};

const MeteorContainer = createContainer(({ params }) => {
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

export default connect()(MeteorContainer);
