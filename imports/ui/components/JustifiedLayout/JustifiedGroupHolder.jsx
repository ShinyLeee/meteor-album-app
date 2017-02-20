import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import justifiedLayout from 'justified-layout';
import { photoSwipeOpen, selectGroupCounter } from '/imports/ui/redux/actions/index.js';
import SelectableIcon from '../SelectableImage/SelectableIcon.jsx';
import ConnectedJustifiedImageHolder from './JustifiedImageHolder.jsx';

export class JustifiedGroupHolder extends PureComponent {

  constructor(props) {
    super(props);

    const { domain, containerWidth, devicePixelRatio, dayGroupImage } = props;

    const geometry = this.generateGeo();

    this.state = {
      isGroupSelect: false,
      geometry,
      pswpItems: dayGroupImage.map((image, i) => {
        const src = `${domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
        const realMWidth = Math.round(geometry.boxes[i].width * devicePixelRatio);
        const realMHeight = Math.round(geometry.boxes[i].height * devicePixelRatio);
        // generate based on Qiniu imageView2 mode 3 API
        // more details see https://developer.qiniu.com/dora/api/basic-processing-images-imageview2
        const minWidth = Math.round(containerWidth * devicePixelRatio);
        const minHeight = Math.round((image.dimension[1] / image.dimension[0]) * minWidth);
        return ({
          msrc: `${src}?imageView2/1/w/${realMWidth}/h/${realMHeight}`,
          src: `${src}?imageView2/3/w/${minWidth}`,
          w: minWidth,
          h: minHeight,
        });
      }),
    };
    this.handleToggleSelectGroup = this.handleToggleSelectGroup.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { isEditing, dayGroupImage, total, day, groupTotal } = this.props;
    if (dayGroupImage.length !== nextProps.dayGroupImage.length) {
      this.setState({ geometry: this.generateGeo() });
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
      _.each(nextProps.group, (value, key) => {
        if (key === day) {
          hasGroup = true;
          if (value === groupTotal) this.setState({ isGroupSelect: true });
          else this.setState({ isGroupSelect: false });
        }
      });
      // if specific group not exist, make isGroupSelect false
      if (!hasGroup) this.setState({ isGroupSelect: false });
    }
  }

  generateGeo() {
    const {
      dayGroupImage,
      containerWidth,
      containerPadding,
      targetRowHeight,
      targetRowHeightTolerance,
      boxSpacing,
      fullWidthBreakoutRowCadence,
    } = this.props;

    const ratios = dayGroupImage.map((image) => {
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

  handleToggleSelectGroup() {
    const { day, isEditing, dayGroupImage, groupTotal } = this.props;
    if (isEditing) {
      if (this.state.isGroupSelect) {
        this.props.selectGroupCounter({
          selectImages: dayGroupImage,
          group: day,
          counter: -groupTotal,
        });
      } else {
        this.props.selectGroupCounter({
          selectImages: dayGroupImage,
          group: day,
          counter: groupTotal,
        });
      }
    }
  }

  render() {
    const {
      day,
      dayGroupImage,
      isEditing,
      total,
      groupTotal,
    } = this.props;

    const showDay = day.split('');
    showDay[3] += '年';
    showDay[5] += '月';
    showDay[7] += '日';
    showDay.join('');

    return (
      <div className="Justified__dayGroup" style={{ height: this.state.geometry.containerHeight }}>
        <div
          className="Justified__title"
          onTouchTap={this.handleToggleSelectGroup}
        >
          { isEditing && <SelectableIcon activate={this.state.isGroupSelect} /> }
          <h4>{showDay}</h4>
        </div>
        {
          _.map(dayGroupImage, (image, i) => (
            <ConnectedJustifiedImageHolder
              key={i}
              isEditing={isEditing}
              day={day}
              dimension={this.state.geometry.boxes[i]}
              image={image}
              total={total}
              groupTotal={groupTotal}
              ref={(node) => { this[`thumbnail${i}`] = node; }}
              onImageClick={() => this.props.photoSwipeOpen(
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
              )}
            />
          ))
        }
      </div>
    );
  }
}

JustifiedGroupHolder.displayName = 'JustifiedGroupHolder';

JustifiedGroupHolder.defaultProps = {
  domain: Meteor.settings.public.imageDomain,
  devicePixelRatio: window.devicePixelRatio,
  containerWidth: document.body.clientWidth,
  containerPadding: 0,
  targetRowHeight: 180,
  targetRowHeightTolerance: 0.25,
  boxSpacing: 4,
  fullWidthBreakoutRowCadence: false,
};

JustifiedGroupHolder.propTypes = {
  domain: PropTypes.string.isRequired,
  devicePixelRatio: PropTypes.number.isRequired,
  isEditing: PropTypes.bool.isRequired,
  day: PropTypes.string.isRequired,
  dayGroupImage: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  groupTotal: PropTypes.number.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(JustifiedGroupHolder);
