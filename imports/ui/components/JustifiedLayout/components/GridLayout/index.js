import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import settings from '/imports/utils/settings';
import { photoSwipeOpen } from '/imports/ui/redux/actions';
import GridLayout from '/imports/ui/components/GridLayout';
import ConnectedGridImageHolder from './components/GridImageHolder';

const { imageDomain } = settings;

export class JustifiedGridLayout extends PureComponent {
  static propTypes = {
    isEditing: PropTypes.bool,
    images: PropTypes.array.isRequired,
    showGallery: PropTypes.bool,
    filterType: PropTypes.oneOf(['latest', 'oldest', 'popular']),
    device: PropTypes.object.isRequired,
    photoSwipeOpen: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isEditing: false,
    showGallery: false,
    filterType: 'latest',
  }

  constructor(props) {
    super(props);
    this._pswpItems = props.showGallery ? this.generateItems(props) : null;
  }

  componentWillReceiveProps(nextProps) {
    const { images, showGallery } = this.props;
    // When image added in GroupHolder we need to refresh both two state
    if (
      showGallery &&
      images.length !== nextProps.images.length
    ) {
      this._pswpItems = this.generateItems(nextProps);
    }
  }

  // 获取网格布局图片宽
  generateImageDimension() {
    const { device } = this.props;
    const { width, pixelRatio } = device;
    return Math.round((width / 3) * pixelRatio);
  }

  // 获取屏幕宽
  generateDimension() {
    const { device } = this.props;
    const { width, pixelRatio } = device;
    return Math.round(width * pixelRatio);
  }

  // eslint-disable-next-line class-methods-use-this
  generateItems(props) {
    const { images } = props;
    const pswpItems = images.map((image) => {
      const thumbnailDimension = this.generateDimension();
      const url = `${imageDomain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
      // generate based on Qiniu imageView2 mode 3 API
      // more details see https://developer.qiniu.com/dora/api/basic-processing-images-imageview2
      const largeImageWidth = this.generateDimension();
      const largeImageHeight = Math.round((image.dimension[1] / image.dimension[0]) * largeImageWidth);
      return ({
        _id: image._id,
        msrc: `${url}?imageView2/1/w/${thumbnailDimension}`,
        src: `${url}?imageView2/3/w/${largeImageWidth}`,
        w: largeImageWidth,
        h: largeImageHeight,
      });
    });
    return pswpItems;
  }

  handleOpenGallery(i) {
    const { showGallery } = this.props;
    if (showGallery) {
      this.props.photoSwipeOpen(
        this._pswpItems,
        {
          index: i,
          history: false,
          showHideOpacity: true,
          getThumbBoundsFn: (index) => {
            const thumbnail = this[`thumbnail${index}`];
            const img = thumbnail.getWrappedInstance().image;
            const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            const rect = img.getBoundingClientRect();
            return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
          },
        },
      );
    }
  }

  render() {
    const { isEditing, filterType, images } = this.props;
    let filteredImages;
    if (filterType === 'latest') filteredImages = [...images];
    if (filterType === 'oldest') filteredImages = [...images].reverse();
    if (filterType === 'popular') filteredImages = [...images].sort((p, n) => n.liker.length - p.liker.length);
    return (
      <GridLayout>
        {
          filteredImages.map((image, i) => (
            <ConnectedGridImageHolder
              key={image._id}
              isEditing={isEditing}
              image={image}
              total={images.length}
              dimension={this.generateImageDimension()}
              ref={(node) => { this[`thumbnail${i}`] = node; }}
              onImageClick={() => this.handleOpenGallery(i)}
            />
          ))
        }
      </GridLayout>
    );
  }
}

const mapStateToProps = ({ device }) => ({
  device,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  photoSwipeOpen,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(JustifiedGridLayout);
