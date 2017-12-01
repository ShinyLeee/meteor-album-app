import map from 'lodash/map';
import forEach from 'lodash/forEach';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import justifiedLayout from 'justified-layout';
import settings from '/imports/utils/settings';
import { photoSwipeOpen, selectGroupCounter } from '/imports/ui/redux/actions';
import ConnectedGroupImageHolder from './components/GroupImageHolder';
import JustifiedSelectIcon from '../snippet/JustifiedSelectIcon';
import {
  Wrapper,
  Title,
} from './GroupLayout.style';

const { imageDomain } = settings;

export class JustifiedGroupLayout extends PureComponent {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    filterType: PropTypes.oneOf(['day', 'month', 'year']),
    showGallery: PropTypes.bool,
    groupName: PropTypes.string.isRequired,
    groupImages: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    // Below Pass from Redux
    device: PropTypes.object.isRequired, // eslint-disable-line react/no-unused-prop-types
    group: PropTypes.object.isRequired,
    counter: PropTypes.number.isRequired,
    photoSwipeOpen: PropTypes.func.isRequired,
    selectGroupCounter: PropTypes.func.isRequired,
    /**
     * See docs: http://flickr.github.io/justified-layout/
     */
    containerPadding: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
    boxSpacing: PropTypes.oneOfType([ // eslint-disable-line react/no-unused-prop-types
      PropTypes.object,
      PropTypes.number,
    ]),
    fullWidthBreakoutRowCadence: PropTypes.oneOfType([ // eslint-disable-line react/no-unused-prop-types
      PropTypes.bool,
      PropTypes.number,
    ]),
    targetRowHeight: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
    targetRowHeightTolerance: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  }

  static defaultProps = {
    filterType: 'day',
    showGallery: false,
    containerPadding: 0,
    targetRowHeight: 180,
    targetRowHeightTolerance: 0.25,
    boxSpacing: 4,
    fullWidthBreakoutRowCadence: false,
  }

  constructor(props) {
    super(props);
    const geometry = this.generateGeo(props);
    this._loadedItems = [];
    this.state = {
      isGroupSelect: false,
      geometry,
      pswpItems: props.showGallery ? this.generateItems(props, geometry) : null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      isEditing,
      showGallery,
      groupImages,
      total,
      groupName,
    } = this.props;
    // When image added in GroupHolder we need to refresh both two state
    if (showGallery) {
      if (groupImages.length !== nextProps.groupImages.length) {
        const geometry = this.generateGeo(nextProps);
        const pswpItems = this.generateItems(nextProps, geometry);
        this.setState({ geometry, pswpItems });
      }
    }
    if (isEditing) {
      if (nextProps.counter === total) {
        this.setState({ isGroupSelect: true });
        return;
      }
      if (nextProps.counter === 0) {
        this.setState({ isGroupSelect: false });
        return;
      }
      // When next group prop is {}
      if (Object.keys(nextProps.group).length === 0) {
        this.setState({ isGroupSelect: false });
        return;
      }

      let hasGroup = false;
      forEach(nextProps.group, (value, key) => {
        if (key === groupName) {
          hasGroup = true;
          if (value === groupImages.length) this.setState({ isGroupSelect: true });
          else this.setState({ isGroupSelect: false });
        }
      });
      // if specific group not exist, make isGroupSelect false
      if (!hasGroup) this.setState({ isGroupSelect: false });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  generateGeo(props) {
    const {
      device,
      groupImages,
      containerPadding,
      targetRowHeight,
      targetRowHeightTolerance,
      boxSpacing,
      fullWidthBreakoutRowCadence,
    } = props;

    const ratios = groupImages.map((image) => {
      const ratio = image.dimension[0] / image.dimension[1];
      // toFixed will save unnecessary zero, it cause bug in justifiedLayout
      return Math.round(ratio * 100) / 100;
    });

    const geometry = justifiedLayout(
      ratios,
      {
        containerWidth: device.width,
        containerPadding,
        targetRowHeight,
        targetRowHeightTolerance,
        boxSpacing,
        fullWidthBreakoutRowCadence,
      },
    );
    return geometry;
  }

  // eslint-disable-next-line class-methods-use-this
  generateItems(props, geometry) {
    const { groupImages, device } = props;
    const { width, pixelRatio } = device;
    const pswpItems = groupImages.map((image, i) => {
      const src = `${imageDomain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
      const thumbnailWidth = Math.round(geometry.boxes[i].width * pixelRatio);
      const thumbnailHeight = Math.round(geometry.boxes[i].height * pixelRatio);
      // generate based on Qiniu imageView2 mode 3 API
      // more details see https://developer.qiniu.com/dora/api/basic-processing-images-imageview2
      const largeImageWidth = Math.round(width * pixelRatio);
      const largeImageHeight = Math.round((image.dimension[1] / image.dimension[0]) * largeImageWidth);
      return ({
        _id: image._id,
        msrc: `${src}?imageView2/1/w/${thumbnailWidth}/h/${thumbnailHeight}`,
        src: `${src}?imageView2/3/w/${largeImageWidth}`,
        w: largeImageWidth,
        h: largeImageHeight,
      });
    });
    return pswpItems;
  }

  _handleToggleSelectGroup = () => {
    const { groupName, isEditing, groupImages } = this.props;
    if (isEditing) {
      if (this.state.isGroupSelect) {
        this.props.selectGroupCounter({
          selectImages: groupImages,
          group: groupName,
          counter: -groupImages.length,
        });
      } else {
        this.props.selectGroupCounter({
          selectImages: groupImages,
          group: groupName,
          counter: groupImages.length,
        });
      }
    }
  }

  _handleRenderGallery(i) {
    const { showGallery } = this.props;
    if (showGallery && this._loadedItems.includes(i)) {
      this.props.photoSwipeOpen(
        this.state.pswpItems,
        {
          index: i,
          history: false,
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

  _handleImageLoad(i) {
    if (!this._loadedItems.includes(i)) {
      this._loadedItems.push(i);
    }
  }

  render() {
    const {
      groupName,
      groupImages,
      isEditing,
      total,
      filterType,
    } = this.props;

    const groupTime = groupName.split('');
    if (filterType === 'day') {
      groupTime[3] += '年';
      groupTime[5] += '月';
      groupTime[7] += '日';
      groupTime.join('');
    } else if (filterType === 'month') {
      groupTime[3] += '年';
      groupTime[5] += '月';
      groupTime.join('');
    } else if (filterType === 'year') {
      groupTime[3] += '年';
      groupTime.join('');
    }

    return (
      <Wrapper style={{ height: this.state.geometry.containerHeight }}>
        <Title onClick={this._handleToggleSelectGroup}>
          { isEditing && <JustifiedSelectIcon activate={this.state.isGroupSelect} /> }
          <h4>{groupTime}</h4>
          <span>{groupImages.length}</span>
        </Title>
        {
          map(groupImages, (image, i) => (
            <ConnectedGroupImageHolder
              key={i}
              isEditing={isEditing}
              groupName={groupName}
              dimension={this.state.geometry.boxes[i]}
              image={image}
              total={total}
              groupTotal={groupImages.length}
              ref={(node) => { this[`thumbnail${i}`] = node; }}
              onImageClick={() => this._handleRenderGallery(i)}
              onImageLoad={() => this._handleImageLoad(i)}
            />
          ))
        }
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  device: state.device,
  group: state.selectCounter.group,
  counter: state.selectCounter.counter,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  photoSwipeOpen,
  selectGroupCounter,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(JustifiedGroupLayout);
