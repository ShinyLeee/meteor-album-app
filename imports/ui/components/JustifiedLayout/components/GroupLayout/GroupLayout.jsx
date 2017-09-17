import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import justifiedLayout from 'justified-layout';
import { photoSwipeOpen, selectGroupCounter } from '/imports/ui/redux/actions/index.js';
import ConnectedGroupImageHolder from './components/GroupImageHolder.jsx';
import JustifiedSelectIcon from '../snippet/JustifiedSelectIcon.jsx';
import {
  Wrapper,
  Title,
} from './GroupLayout.style.js';

export class JustifiedGroupLayout extends PureComponent {

  constructor(props) {
    super(props);
    const geometry = this.generateGeo(props);
    this.state = {
      isGroupSelect: false,
      geometry,
      pswpItems: props.showGallery ? this.generateItems(props, geometry) : undefined,
    };
    this.handleToggleSelectGroup = this.handleToggleSelectGroup.bind(this);
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
      _.forEach(nextProps.group, (value, key) => {
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

  generateGeo(props) {
    const {
      groupImages,
      containerWidth,
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
        containerWidth,
        containerPadding,
        targetRowHeight,
        targetRowHeightTolerance,
        boxSpacing,
        fullWidthBreakoutRowCadence,
      }
    );
    return geometry;
  }

  generateItems(props, geometry) {
    const { domain, containerWidth, devicePixelRatio, groupImages } = props;
    const pswpItems = groupImages.map((image, i) => {
      const src = `${domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
      const realMWidth = Math.round(geometry.boxes[i].width * devicePixelRatio);
      const realMHeight = Math.round(geometry.boxes[i].height * devicePixelRatio);
      // generate based on Qiniu imageView2 mode 3 API
      // more details see https://developer.qiniu.com/dora/api/basic-processing-images-imageview2
      const minWidth = Math.round(containerWidth * devicePixelRatio);
      const minHeight = Math.round((image.dimension[1] / image.dimension[0]) * minWidth);
      return ({
        _id: image._id,
        msrc: `${src}?imageView2/1/w/${realMWidth}/h/${realMHeight}`,
        src: `${src}?imageView2/3/w/${minWidth}`,
        w: minWidth,
        h: minHeight,
      });
    });
    return pswpItems;
  }

  handleToggleSelectGroup() {
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

  handleOpenGallery(i) {
    const { showGallery } = this.props;
    if (showGallery) {
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
        }
      );
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
        <Title onTouchTap={this.handleToggleSelectGroup}>
          { isEditing && <JustifiedSelectIcon activate={this.state.isGroupSelect} /> }
          <h4>{groupTime}</h4>
          <span>{groupImages.length}</span>
        </Title>
        {
          _.map(groupImages, (image, i) => (
            <ConnectedGroupImageHolder
              key={i}
              isEditing={isEditing}
              groupName={groupName}
              dimension={this.state.geometry.boxes[i]}
              image={image}
              total={total}
              groupTotal={groupImages.length}
              ref={(node) => { this[`thumbnail${i}`] = node; }}
              onImageClick={() => this.handleOpenGallery(i)}
            />
          ))
        }
      </Wrapper>
    );
  }
}

JustifiedGroupLayout.displayName = 'JustifiedGroupLayout';

JustifiedGroupLayout.defaultProps = {
  domain: Meteor.settings.public.imageDomain,
  devicePixelRatio: window.devicePixelRatio,
  filterType: 'day',
  showGallery: false,
  containerWidth: document.body.clientWidth,
  containerPadding: 0,
  targetRowHeight: 180,
  targetRowHeightTolerance: 0.25,
  boxSpacing: 4,
  fullWidthBreakoutRowCadence: false,
};

JustifiedGroupLayout.propTypes = {
  domain: PropTypes.string.isRequired,
  devicePixelRatio: PropTypes.number.isRequired,
  isEditing: PropTypes.bool.isRequired,
  filterType: PropTypes.oneOf(['day', 'month', 'year']).isRequired,
  showGallery: PropTypes.bool.isRequired,
  groupName: PropTypes.string.isRequired,
  groupImages: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  // Below Pass from Redux
  group: PropTypes.object.isRequired,
  counter: PropTypes.number.isRequired,
  photoSwipeOpen: PropTypes.func.isRequired,
  selectGroupCounter: PropTypes.func.isRequired,
  /**
   * See docs: http://flickr.github.io/justified-layout/
   */
  containerWidth: PropTypes.number.isRequired,
  containerPadding: PropTypes.number.isRequired,
  boxSpacing: PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.number,
  ]),
  fullWidthBreakoutRowCadence: PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.number,
  ]),
  targetRowHeight: PropTypes.number.isRequired,
  targetRowHeightTolerance: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  group: state.selectCounter.group,
  counter: state.selectCounter.counter,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  photoSwipeOpen,
  selectGroupCounter,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(JustifiedGroupLayout);
