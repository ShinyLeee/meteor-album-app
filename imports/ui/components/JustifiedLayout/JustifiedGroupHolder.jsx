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
    this.state = {
      isGroupSelect: false,
      pswpItems: props.dayGroupImage.map((image) => ({
        src: `${props.domain}/${image.user}/${image.collection}/${image.name}.${image.type}`,
        w: image.dimension[0],
        h: image.dimension[1],
      })),
    };
    this.handleToggleSelectGroup = this.handleToggleSelectGroup.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { isEditing, total, day, groupTotal } = this.props;
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
      containerWidth,
      containerPadding,
      targetRowHeight,
      targetRowHeightTolerance,
      boxSpacing,
      fullWidthBreakoutRowCadence,
    } = this.props;

    const showDay = day.split('');
    showDay[3] += '年';
    showDay[5] += '月';
    showDay[7] += '日';
    showDay.join('');

    const ratios = _.map(dayGroupImage, (image) => {
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
    return (
      <div className="Justified__dayGroup" style={{ height: geometry.containerHeight }}>
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
              dimension={geometry.boxes[i]}
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
  containerWidth: document.body.clientWidth,
  containerPadding: 0,
  targetRowHeight: 200,
  targetRowHeightTolerance: 0.25,
  boxSpacing: 4,
  fullWidthBreakoutRowCadence: false,
};

JustifiedGroupHolder.propTypes = {
  domain: PropTypes.string.isRequired,
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
