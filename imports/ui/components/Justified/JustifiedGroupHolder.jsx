/* eslint max-len: 0 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { _ } from 'meteor/underscore';

import JustifiedImageHolder from './JustifiedImageHolder.jsx';
import { selectGroupCounter } from '../../actions/actionTypes.js';

class JustifiedGroupHolder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isGroupSelect: false,
    };
    this.handleSelectGroup = this.handleSelectGroup.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { day, groupTotal } = this.props;
    if (!nextProps.group) {
      this.setState({ isGroupSelect: false });
      return;
    }
    _.map(nextProps.group, (value, key) => {
      if (key === day && value === groupTotal) this.setState({ isGroupSelect: true });
      if (key === day && value < groupTotal) this.setState({ isGroupSelect: false });
    });
  }

  handleSelectGroup() {
    const { day, isEditing, groupTotal, dispatch } = this.props;
    if (isEditing) {
      if (this.state.isGroupSelect) {
        dispatch(selectGroupCounter({ group: day, counter: -groupTotal }));
        this.setState({ isGroupSelect: false });
      } else {
        dispatch(selectGroupCounter({ group: day, counter: groupTotal }));
        this.setState({ isGroupSelect: true });
      }
    }
  }

  render() {
    const {
      day,
      geometry,
      dayGroupImage,
      backgroundStyle,
      isEditing,
      total,
      groupTotal,
    } = this.props;
    const showDay = day.split('');
    showDay[3] += '年';
    showDay[5] += '月';
    showDay[7] += '日';
    showDay.join('');
    const dayGroupStyle = { height: geometry.containerHeight };
    const selectSvg = {
      fill: this.state.isGroupSelect ? '#4285f4' : 'rgba(0,0,0,0.54)',
      fillOpacity: 1,
    };
    return (
      <div className="justified-day-group" style={dayGroupStyle}>
        <div
          className="justified-day-group-title"
          onTouchTap={this.handleSelectGroup}
        >
          { isEditing
            ? (
            <svg width="24px" height="24px" style={selectSvg} viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>)
            : null }
          <h4>{showDay}</h4>
        </div>
        {
          _.map(dayGroupImage, (image, i) => {
            const imageSource = `${image.url}?imageView2/1/w/${image.width}/h/${image.height}`;
            const imageHolderStyle = {
              left: `${geometry.boxes[i].left}px`,
              top: `${geometry.boxes[i].top}px`,
              width: `${geometry.boxes[i].width}px`,
              height: `${geometry.boxes[i].height}px`,
            };
            return (
              <JustifiedImageHolder
                key={image._id}
                image={image}
                style={imageHolderStyle}
                backgroundStyle={backgroundStyle}
                imageSource={imageSource}
                isEditing={isEditing}
                total={total}
                day={day}
                groupTotal={groupTotal}
              />
            );
          })
        }
      </div>
    );
  }
}

JustifiedGroupHolder.propTypes = {
  day: PropTypes.string.isRequired,
  geometry: PropTypes.object.isRequired,
  dayGroupImage: PropTypes.array.isRequired,
  backgroundStyle: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  total: PropTypes.number.isRequired,
  groupTotal: PropTypes.number.isRequired,
  // Below Pass from Redux
  group: PropTypes.object,
  counter: PropTypes.number,
  dispatch: PropTypes.func,
};

const mapStateTopProps = (state) => ({
  group: state.selectCounter.group,
  counter: state.selectCounter.counter,
});

export default connect(mapStateTopProps)(JustifiedGroupHolder);
