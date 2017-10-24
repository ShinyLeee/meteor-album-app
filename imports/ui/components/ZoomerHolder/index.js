import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import SlideTransition from '/imports/ui/components/Transition/Slide';
import { incView } from '/imports/api/images/methods';
import settings from '/imports/utils/settings';
import { rWidth } from '/imports/utils/responsive';
import {
  modalOpen,
  modalClose,
  zoomerClose,
  snackBarOpen,
} from '/imports/ui/redux/actions';
import ModalLoader from '/imports/ui/components/Modal/Common/ModalLoader';
import Portal from '../Portal';
import Inner from './components/Inner';
import { ExifInfo } from './components/ExifModalContent';
import {
  Wrapper,
  Info,
  InfoHeader,
  InfoNumer,
  StyledHeartIcon,
  StyledEyeIcon,
  StyledCameraIcon,
} from './ZoomerHolder.style';

const { imageDomain } = settings;

class ZoomerHolder extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    image: PropTypes.object, // image only required when zoomerOpen is true
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
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
      // in mobile we need do more to disable scroll
        document.body.style.overflow = 'hidden';
        document.body.addEventListener('touchmove', this.disableMobileScroll);
        incView.call({ imageIds: [nextProps.image._id] });
      } else {
        document.body.style.overflow = '';
        document.body.removeEventListener('touchmove', this.disableMobileScroll);
      }
    }
  }

  componentWillUnmount() {
    document.body.removeEventListener('touchmove', this.disableMobileScroll);
  }

  get imgSrc() {
    const { image } = this.props;
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

  renderExifModal = () => {
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
    this.renderLoadModal('加载中');
    axios({
      method: 'GET',
      url: `${this.imgSrc}?exif`,
    })
      .then(({ data }) => {
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
        this.props.modalClose();
        this.props.snackBarOpen(`获取EXIF信息失败 ${err}`);
      });
  }

  renderLoadModal = (message, errMsg = '请求超时') => {
    this.props.modalOpen({
      content: <ModalLoader message={message} errMsg={errMsg} />,
      ops: { ignoreBackdropClick: true },
    });
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

const mapStateToProps = ({ portals }) => ({
  visible: portals.zoomer.open,
  image: portals.zoomer.image,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  modalOpen,
  modalClose,
  snackBarOpen,
  zoomerClose,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(ZoomerHolder);
