import React, { Component, PropTypes } from 'react';
import { _ } from 'meteor/underscore';

import { SelectableIcon } from './SelectableStatus.jsx';
import JustifiedImageHolder from './JustifiedImageHolder.jsx';

export default class JustifiedGroupHolder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isGroupSelect: false,
    };
    this.handleToggleSelectGroup = this.handleToggleSelectGroup.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { total, day, groupTotal } = this.props;
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
    _.each(nextProps.group, (value, key) => {
      if (key === day && value === groupTotal) this.setState({ isGroupSelect: true });
      else this.setState({ isGroupSelect: false });
    });
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
      geometry,
      dayGroupImage,
      isEditing,
      total,
      groupTotal,
      group,
      counter,
      selectCounter,
    } = this.props;
    const showDay = day.split('');
    showDay[3] += '年';
    showDay[5] += '月';
    showDay[7] += '日';
    showDay.join('');
    const dayGroupStyle = { height: geometry.containerHeight };
    return (
      <div className="Justified__dayGroup" style={dayGroupStyle}>
        <div
          className="Justified__title"
          onTouchTap={this.handleToggleSelectGroup}
        >
          { isEditing && <SelectableIcon activate={this.state.isGroupSelect} /> }
          <h4>{showDay}</h4>
        </div>
        {
          _.map(dayGroupImage, (image, i) => {
            const url = `${this.props.domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
            const imageSrc = `${url}?imageView2/1/w/${geometry.boxes[i].width * 2}/h/${geometry.boxes[i].height * 2}`;
            const imageHolderStyle = {
              left: `${geometry.boxes[i].left}px`,
              top: `${geometry.boxes[i].top}px`,
              width: `${geometry.boxes[i].width}px`,
              height: `${geometry.boxes[i].height}px`,
            };
            return (
              <JustifiedImageHolder
                key={i}
                isEditing={isEditing}
                day={day}
                image={image}
                imageSrc={imageSrc}
                imageHolderStyle={imageHolderStyle}
                total={total}
                groupTotal={groupTotal}
                group={group}
                counter={counter}
                selectCounter={selectCounter}
              />
            );
          })
        }
      </div>
    );
  }
}

JustifiedGroupHolder.propTypes = {
  domain: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  day: PropTypes.string.isRequired,
  geometry: PropTypes.object.isRequired,
  dayGroupImage: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  groupTotal: PropTypes.number.isRequired,
  // Below Pass from Redux
  group: PropTypes.object.isRequired,
  counter: PropTypes.number.isRequired,
  selectCounter: PropTypes.func.isRequired,
  selectGroupCounter: PropTypes.func.isRequired,
};
