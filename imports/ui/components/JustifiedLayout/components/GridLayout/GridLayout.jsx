import { Meteor } from 'meteor/meteor';
import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { photoSwipeOpen } from '/imports/ui/redux/actions/index.js';
import GridLayout from '/imports/ui/components/GridLayout/GridLayout.jsx';
import ConnectedGridImageHolder from './components/GridImageHolder.jsx';

const domain = Meteor.settings.public.imageDomain;

export class JustifiedGridLayout extends PureComponent {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    images: PropTypes.array.isRequired,
    showGallery: PropTypes.bool.isRequired,
    filterType: PropTypes.oneOf(['latest', 'oldest', 'popular']).isRequired,
    // Below Pass From Redux
    photoSwipeOpen: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isEditing: false,
    showGallery: false,
    filterType: 'latest',
  }

  constructor(props) {
    super(props);
    this._clientWidth = document.body.clientWidth;
    this._pixelRatio = window.devicePixelRatio;
    this.state = {
      isGroupSelect: false,
      pswpItems: props.showGallery ? this.generateItems(props) : undefined,
    };
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

  generateItems(props) {
    const { images } = props;
    const pswpItems = images.map((image) => {
      const realDimension = Math.round((this._clientWidth / 3) * this._pixelRatio);
      const url = `${domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
      // generate based on Qiniu imageView2 mode 3 API
      // more details see https://developer.qiniu.com/dora/api/basic-processing-images-imageview2
      const minWidth = Math.round(this._clientWidth * this._pixelRatio);
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
        }
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
              key={i}
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
