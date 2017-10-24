import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { vWidth, pixelRatio } from '/imports/utils/responsive';
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
    photoSwipeOpen: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isEditing: false,
    showGallery: false,
    filterType: 'latest',
  }

  state = {
    pswpItems: this.props.showGallery ? this.generateItems(this.props) : undefined,
  }

  componentWillReceiveProps(nextProps) {
    const { images, showGallery } = this.props;
    // When image added in GroupHolder we need to refresh both two state
    if (showGallery) {
      if (images.length !== nextProps.images.length) {
        this.setState({ pswpItems: this.generateItems(nextProps) });
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  generateItems(props) {
    const { images } = props;
    const pswpItems = images.map((image) => {
      const realDimension = Math.round((vWidth / 3) * pixelRatio);
      const url = `${imageDomain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
      // generate based on Qiniu imageView2 mode 3 API
      // more details see https://developer.qiniu.com/dora/api/basic-processing-images-imageview2
      const minWidth = Math.round(vWidth * pixelRatio);
      const minHeight = Math.round((image.dimension[1] / image.dimension[0]) * minWidth);
      return ({
        _id: image._id,
        msrc: `${url}?imageView2/1/w/${realDimension}`,
        src: `${url}?imageView2/3/w/${minWidth}`,
        w: minWidth,
        h: minHeight,
      });
    });
    return pswpItems;
  }

  handleOpenGallery(i) {
    const { showGallery } = this.props;
    if (showGallery) {
      this.props.photoSwipeOpen(
        this.state.pswpItems,
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
              ref={(node) => { this[`thumbnail${i}`] = node; }}
              onImageClick={() => this.handleOpenGallery(i)}
            />
          ))
        }
      </GridLayout>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  photoSwipeOpen,
}, dispatch);

export default connect(null, mapDispatchToProps)(JustifiedGridLayout);
