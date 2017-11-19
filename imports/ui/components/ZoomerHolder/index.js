import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Modal from '/imports/ui/components/Modal';
import SlideTransition from '/imports/ui/components/Transition/Slide';
import { incView } from '/imports/api/images/methods';
import settings from '/imports/utils/settings';
import {
  zoomerClose,
  snackBarOpen,
} from '/imports/ui/redux/actions';
import Portal from '../Portal';
import Inner from './components/Inner';
import { InfoContent, ExifContent } from './components/ModalContent';
import { Wrapper } from './ZoomerHolder.style';

const { imageDomain } = settings;

class ZoomerHolder extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    image: PropTypes.object, // image only required when zoomerOpen is true
    device: PropTypes.object.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    zoomerClose: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    exif: Object.create(null),
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      if (nextProps.visible) {
        document.body.addEventListener('touchmove', this.disableMobileScroll);
        incView.call({ imageIds: [nextProps.image._id] });
      } else {
        document.body.removeEventListener('touchmove', this.disableMobileScroll);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  componentWillUnmount() {
    document.body.removeEventListener('touchmove', this.disableMobileScroll);
  }

  get imgSrc() {
    const { image, device } = this.props;
    const rWidth = device.width * device.pixelRatio;
    const src = `${imageDomain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
    const preSrc = `${src}?imageView2/2/w/${rWidth}`;
    const realSrc = `${src}?imageView2/3/w/${rWidth}`;
    // double quote for special character see: https://www.w3.org/TR/CSS2/syndata.html#value-def-uri
    return `url("${realSrc}"),url("${preSrc}")`;
  }

  // eslint-disable-next-line class-methods-use-this
  disableMobileScroll(e) {
    e.preventDefault(e);
  }

  renderInfoModal = () => {
    const { image } = this.props;
    Modal.show({
      content: <InfoContent image={image} />,
    });
  }

  renderExifModal = async () => {
    const { image } = this.props;
    if (image.type !== 'jpg') {
      this.props.snackBarOpen('只有JPG图片存有EXIF信息');
      return;
    }
    const showExifModal = (exif) => {
      Modal.show({
        content: (
          <ExifContent
            exif={exif}
            uploadDate={moment(image.createdAt).format('YYYY:MM:DD HH:mm:ss')}
          />
        ),
      });
    };
    if (Object.keys(this.state.exif).length !== 0) {
      showExifModal(this.state.exif);
      return;
    }
    try {
      await Modal.showLoader('加载中');
      const data = await axios({
        method: 'GET',
        url: `${this.imgSrc}?exif`,
      });
      showExifModal(data);
      this.setState({ exif: data });
    } catch (err) {
      console.warn(err);
      Modal.close();
      this.props.snackBarOpen(`获取EXIF信息失败 ${err}`);
    }
  }

  render() {
    const { visible, image } = this.props;
    return (
      <Portal name="ZoomHolder">
        <TransitionGroup>
          {
            visible && (
              <SlideTransition>
                <Wrapper>
                  <Inner
                    image={image}
                    imageHolderStyle={{ backgroundImage: this.imgSrc }}
                    onLogoClick={this.props.zoomerClose}
                    onAvatarClick={() => this.props.history.push(`/user/${image.user}`)}
                    onInfoActionClick={this.renderInfoModal}
                    onExifActionClick={this.renderExifModal}
                  />
                </Wrapper>
              </SlideTransition>
            )
          }
        </TransitionGroup>
      </Portal>
    );
  }
}

const mapStateToProps = ({ device, portals }) => ({
  device,
  visible: portals.zoomer.open,
  image: portals.zoomer.image,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
  zoomerClose,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(ZoomerHolder);
