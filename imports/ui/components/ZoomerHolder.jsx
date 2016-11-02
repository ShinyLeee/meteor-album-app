import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import IconButton from 'material-ui/IconButton';
import CameraIcon from 'material-ui/svg-icons/image/camera-alt';
import HeartIcon from 'material-ui/svg-icons/action/favorite';
import AddIcon from 'material-ui/svg-icons/content/add';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import InfoIcon from 'material-ui/svg-icons/action/info';
import TimelineIcon from 'material-ui/svg-icons/action/timeline';

import { zoomerClose } from '../actions/actionTypes.js';

class ZoomerHolder extends Component {

  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    const { dispatch } = this.props;
    document.body.style.overflowY = 'scroll';
    dispatch(zoomerClose());
  }

  render() {
    const { open, image } = this.props;
    if (!open) {
      return <div />;
    }
    const styles = {
      zoomer: {
        width: open ? '100%' : 0,
        height: open ? '100%' : 0,
        zIndex: open ? 1200 : 0,
      },
      imageHolder: {
        backgroundColor: '#68655B',
        backgroundImage: `url(${image.url})`,
        backgroundSize: 'cover',
      },
      iconButton: {
        color: '#fff',
      },
    };
    return (
      <div className="zoomer-holder" style={styles.zoomer}>
        <div
          className="zoomer-image"
          style={styles.imageHolder}
          onTouchTap={this.handleClose}
        >
          <div className="zoomer-image-background" />
        </div>
        <div className="zoomer-toolbox">
          <div className="toolbox-logo">
            <IconButton iconStyle={styles.iconButton}>
              <CameraIcon />
            </IconButton>
          </div>
          <div className="toolbox-action">
            <IconButton iconStyle={styles.iconButton}>
              <HeartIcon />
            </IconButton>
            <IconButton iconStyle={styles.iconButton}>
              <AddIcon />
            </IconButton>
            <IconButton iconStyle={styles.iconButton}>
              <DownloadIcon />
            </IconButton>
          </div>
        </div>
        <div className="zoomer-info">
          <div className="info-profile">
            <img src={image.avatar} alt={image.name} />
            <div className="info-profile-detail">
              <span className="detail-title">
                {image.name}
              </span>
              <span className="detail-subtitle">
                {moment(image.createdAt).format('YYYY-MM-DD')}
              </span>
            </div>
          </div>
          <div className="info-action">
            <IconButton iconStyle={styles.iconButton}>
              <TimelineIcon />
            </IconButton>
            <IconButton iconStyle={styles.iconButton}>
              <InfoIcon />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}

ZoomerHolder.propTypes = {
  dispatch: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  image: PropTypes.object,
};

const mapStateToProps = (state) => {
  if (state.zoomer) {
    return {
      open: state.zoomer.open,
      image: state.zoomer.image,
    };
  }
  return { open: false };
};

export default connect(mapStateToProps)(ZoomerHolder);
