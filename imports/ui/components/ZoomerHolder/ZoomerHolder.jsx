import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';
import CameraIcon from 'material-ui/svg-icons/image/camera-alt';
import HeartIcon from 'material-ui/svg-icons/action/favorite';
import AddIcon from 'material-ui/svg-icons/content/add';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import InfoIcon from 'material-ui/svg-icons/action/info';
import TimelineIcon from 'material-ui/svg-icons/action/timeline';
import { zoomerClose, snackBarOpen } from '/imports/ui/redux/actions/actionTypes.js';

const domain = Meteor.settings.public.domain;

class ZoomerHolder extends Component {

  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handlePrompt = this.handlePrompt.bind(this);
  }

  handleClose() {
    const { dispatch } = this.props;
    document.body.style.overflow = '';
    dispatch(zoomerClose());
  }

  handlePrompt() {
    const { dispatch } = this.props;
    dispatch(snackBarOpen('功能开发中'));
  }

  render() {
    const { open, image, clientWidth } = this.props;
    if (!open) {
      return <div />;
    }
    const url = `${domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
    const src = `${url}?imageView2/0/w/${clientWidth * 2}`;
    const styles = {
      zoomer: {
        width: open ? '100%' : 0,
        height: open ? '100%' : 0,
        zIndex: open ? 1200 : 0,
      },
      imageHolder: {
        backgroundColor: '#68655B',
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: '50%',
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
            <IconButton iconStyle={styles.iconButton} onTouchTap={this.handlePrompt}>
              <HeartIcon />
            </IconButton>
            <IconButton iconStyle={styles.iconButton} onTouchTap={this.handlePrompt}>
              <AddIcon />
            </IconButton>
            <IconButton iconStyle={styles.iconButton} onTouchTap={this.handlePrompt}>
              <DownloadIcon />
            </IconButton>
          </div>
        </div>
        <div className="zoomer-info">
          <div className="info-profile">
            <img
              src={image.avatar}
              role="presentation"
              onTouchTap={() => browserHistory.push(`/user/${image.user}`)}
            />
            <div className="info-profile-detail">
              <span className="detail-title">
                {image.user}
              </span>
              <span className="detail-subtitle">
                {moment(image.createdAt).format('YYYY-MM-DD HH:mm')}
              </span>
            </div>
          </div>
          <div className="info-action">
            <IconButton iconStyle={styles.iconButton} onTouchTap={this.handlePrompt}>
              <TimelineIcon />
            </IconButton>
            <IconButton iconStyle={styles.iconButton} onTouchTap={this.handlePrompt}>
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
  clientWidth: PropTypes.number.isRequired,
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
