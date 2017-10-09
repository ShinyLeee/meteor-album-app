import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { incView } from '/imports/api/images/methods.js';
import settings from '/imports/utils/settings';
import { rWidth } from '/imports/utils/responsive';
import { modalOpen, zoomerClose, snackBarOpen } from '/imports/ui/redux/actions';
import Portal from '../Portal';
import Inner from './components/Inner';
import { ExifLoader, ExifInfo } from './components/ExifModalContent';
import {
  Wrapper,
  Info,
  InfoHeader,
  InfoNumer,
  StyledHeartIcon,
  StyledEyeIcon,
  StyledCameraIcon,
} from './ZoomerHolder.style.js';

const { imageDomain } = settings;

class ZoomerHolder extends Component {
  static propTypes = {
    image: PropTypes.object.isRequired,
    modalOpen: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    zoomerClose: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    exif: {},
  }

  componentDidMount() {
    // in mobile we need do more to disable scroll
    document.body.addEventListener('touchmove', this.disableMobileScroll);

    const { image } = this.props;
    incView.call({ imageIds: [image._id] });
  }

  componentWillUnmount() {
    document.body.removeEventListener('touchmove', this.disableMobileScroll);
  }

  get imgSrc() {
    const { image } = this.props;
    return `${imageDomain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
  }

  disableMobileScroll(e) {
    e.preventDefault(e);
  }

  _handleCloseZoomer = () => {
    document.body.style.overflow = '';
    this.props.zoomerClose();
  }

  _handleAccessUser = () => {
    const { history, image } = this.props;
    history.push(`/user/${image.user}`);
  }

  _handleOpenInfoModal = () => {
    const { image } = this.props;
    this.props.modalOpen({
      content: [
        <Info key="info_like">
          <InfoHeader><StyledHeartIcon />喜欢</InfoHeader>
          <InfoNumer>{image.liker.length}</InfoNumer>
        </Info>,
        <Info key="info_view">
          <InfoHeader><StyledEyeIcon />浏览</InfoHeader>
          {/* +1 because this component did not subscribe */}
          <InfoNumer>{(image.view && image.view + 1) || 1}</InfoNumer>
        </Info>,
        <Info key="info_coll">
          <InfoHeader><StyledCameraIcon />所属相册</InfoHeader>
          <InfoNumer>{image.collection}</InfoNumer>
        </Info>,
      ],
    });
  }

  _handleOpenExifModal = () => {
    const { image } = this.props;
    if (image.type !== 'jpg') {
      this.props.snackBarOpen('只有JPG图片存有EXIF信息');
      return;
    }
    if (Object.keys(this.state.exif).length !== 0) {
      this.props.modalOpen({
        content: (
          <ExifInfo
            exif={this.state.exif}
            uploadDate={moment(image.createdAt).format('YYYY:MM:DD HH:mm:ss')}
          />
        ),
      });
      return;
    }
    this.props.modalOpen({ content: <ExifLoader /> });
    axios({
      method: 'GET',
      url: `${this.imgSrc}?exif`,
    })
    .then(({ data }) => {
      // console.log(data);
      this.props.modalOpen({
        content: (
          <ExifInfo
            exif={data}
            uploadDate={moment(image.createdAt).format('YYYY:MM:DD HH:mm:ss')}
          />
        ),
      });
      this.setState({ exif: data });
    })
    .catch((err) => {
      console.log(err);
      this.props.snackBarOpen(`获取EXIF信息失败, ${err}`);
    });
  }

  render() {
    const { image } = this.props;

    const imgSrc = this.imgSrc;
    const preSrc = `${imgSrc}?imageView2/2/w/${rWidth}`;
    const trueSrc = `${imgSrc}?imageView2/3/w/${rWidth}`;
    // double quote for special character see: https://www.w3.org/TR/CSS2/syndata.html#value-def-uri
    const imageHolderStyle = { backgroundImage: `url("${trueSrc}"),url("${preSrc}")` };
    return (
      <Portal name="ZoomHolder">
        <Wrapper>
          <Inner
            image={image}
            imageHolderStyle={imageHolderStyle}
            onLogoClick={this._handleCloseZoomer}
            onAvatarClick={this._handleAccessUser}
            onInfoActionClick={this._handleOpenInfoModal}
            onExifActionClick={this._handleOpenExifModal}
          />
        </Wrapper>
      </Portal>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  modalOpen,
  snackBarOpen,
  zoomerClose,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withRouter,
)(ZoomerHolder);
