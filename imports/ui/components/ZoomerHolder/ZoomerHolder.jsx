import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';
import CameraIcon from 'material-ui/svg-icons/image/camera-alt';
import HeartIcon from 'material-ui/svg-icons/action/favorite';
import AddIcon from 'material-ui/svg-icons/content/add';
import InfoIcon from 'material-ui/svg-icons/action/info';
import TimelineIcon from 'material-ui/svg-icons/action/timeline';

import { zoomerClose, snackBarOpen } from '../../redux/actions/index.js';

class ZoomerHolder extends Component {

  constructor(props) {
    super(props);
    this.handleCloseZoomer = this.handleCloseZoomer.bind(this);
    this.handleOpenPrompt = this.handleOpenPrompt.bind(this);
  }

  componentDidMount() {
    // in mobile we need do more to disable scroll
    document.body.addEventListener('touchmove', this.disableMobileScroll);
  }

  componentWillUnmount() {
    document.body.removeEventListener('touchmove', this.disableMobileScroll);
  }

  disableMobileScroll(e) {
    e.preventDefault(e);
  }

  handleCloseZoomer() {
    document.body.style.overflow = '';
    this.props.zoomerClose();
  }

  handleOpenPrompt() {
    this.props.snackBarOpen('功能开发中');
  }

  render() {
    const { image } = this.props;

    const url = `${this.props.domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
    const src = `${url}?imageView2/2/w/${this.props.clientWidth * 2}`;
    const imageHolderStyle = {
      backgroundImage: `url("${src}")`, // double quote for special character see: https://www.w3.org/TR/CSS2/syndata.html#value-def-uri
    };
    return (
      <div className="component__ZoomerHolder">
        <div className="ZoomerHolder__image" style={imageHolderStyle}>
          <div className="ZoomerHolder__background" />
        </div>
        <div className="ZoomerHolder__toolbox">
          <div className="ZoomerHolder__logo">
            <IconButton
              iconStyle={{ width: '32px', height: '32px', color: '#fff' }}
              onTouchTap={this.handleCloseZoomer}
            ><CameraIcon />
            </IconButton>
          </div>
          <div className="ZoomerHolder__action">
            <IconButton
              iconStyle={{ color: '#fff' }}
              onTouchTap={this.handleOpenPrompt}
            ><HeartIcon />
            </IconButton>
            <IconButton
              iconStyle={{ color: '#fff' }}
              onTouchTap={this.handleOpenPrompt}
            ><AddIcon />
            </IconButton>
          </div>
        </div>
        <div className="ZoomerHolder__info">
          <div className="ZoomerHolder__profile">
            <img
              src={image.avatar}
              role="presentation"
              onTouchTap={() => browserHistory.push(`/user/${image.user}`)}
            />
            <div className="ZoomerHolder__detail">
              <span className="ZoomerHolder__title">
                {image.user}
              </span>
              <span className="ZoomerHolder__subtitle">
                {moment(image.createdAt).format('YYYY-MM-DD HH:mm')}
              </span>
            </div>
          </div>
          <div className="ZoomerHolder__action">
            <IconButton
              iconStyle={{ color: '#fff' }}
              onTouchTap={this.handleOpenPrompt}
            ><TimelineIcon />
            </IconButton>
            <IconButton
              iconStyle={{ color: '#fff' }}
              onTouchTap={this.handleOpenPrompt}
            ><InfoIcon />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}

ZoomerHolder.displayName = 'ZoomerHolder';

ZoomerHolder.defaultProps = {
  domain: Meteor.settings.public.domain,
  clientWidth: document.body.clientWidth,
};

ZoomerHolder.propTypes = {
  domain: PropTypes.string.isRequired,
  clientWidth: PropTypes.number.isRequired,
  image: PropTypes.object.isRequired,
  // Below Pass from Redux
  snackBarOpen: PropTypes.func.isRequired,
  zoomerClose: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
  zoomerClose,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(ZoomerHolder);
