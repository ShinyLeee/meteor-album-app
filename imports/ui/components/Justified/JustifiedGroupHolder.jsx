import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { _ } from 'meteor/underscore';
import { selectGroupCounter } from '/imports/ui/redux/actions/actionTypes.js';
import { SelectIcon } from './SelectStatus.jsx';
import JustifiedImageHolder from './JustifiedImageHolder.jsx';

const domain = Meteor.settings.public.domain;

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
    const { day, isEditing, dayGroupImage, groupTotal, dispatch } = this.props;
    if (isEditing) {
      if (this.state.isGroupSelect) {
        dispatch(selectGroupCounter({ selectImages: dayGroupImage, group: day, counter: -groupTotal }));
        this.setState({ isGroupSelect: false });
      } else {
        dispatch(selectGroupCounter({ selectImages: dayGroupImage, group: day, counter: groupTotal }));
        this.setState({ isGroupSelect: true });
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
          onTouchTap={this.handleSelectGroup}
        >
          {
            isEditing && <SelectIcon activate={this.state.isGroupSelect} />
          }
          <h4>{showDay}</h4>
        </div>
        {
          _.map(dayGroupImage, (image, i) => {
            const url = `${domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
            const imageSource = `${url}?imageView2/1/w/${geometry.boxes[i].width * 2}/h/${geometry.boxes[i].height * 2}`;
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
