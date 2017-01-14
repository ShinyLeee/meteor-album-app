import React, { Component, PropTypes } from 'react';
import { _ } from 'meteor/underscore';

import { SelectableImageBackground } from './SelectableStatus.jsx';

export default class JustifiedImageHolder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSelect: false,
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { total, day, groupTotal } = this.props;
    if (nextProps.counter === total) {
      this.setState({ isSelect: true });
      return;
    }
    if (nextProps.counter === 0) {
      this.setState({ isSelect: false });
      return;
    }
    const allGroups = Object.keys(nextProps.group);
    // When next group prop is {}
    if (allGroups.length === 0 || allGroups.indexOf(day) < 0) {
      this.setState({ isSelect: false });
      return;
    }
    _.each(nextProps.group, (value, key) => {
      if (key === day && value === groupTotal) this.setState({ isSelect: true });
      else if (key === day && value === 0) this.setState({ isSelect: false });
    });
  }

  handleSelect() {
    if (this.props.isEditing) {
      if (this.state.isSelect) {
        this.props.selectCounter({
          selectImages: [this.props.image],
          group: this.props.day,
          counter: -1,
        });
        this.setState({ isSelect: false });
      } else {
        this.props.selectCounter({
          selectImages: [this.props.image],
          group: this.props.day,
          counter: 1,
        });
        this.setState({ isSelect: true });
      }
    }
  }

  render() {
    const { isEditing, image, imageSrc, imageHolderStyle } = this.props;
    const imageStyle = {
      transform: this.state.isSelect && 'scale(.8)',
    };
    return (
      <div
        className="Justified__imageHolder"
        style={imageHolderStyle}
        onTouchTap={this.handleSelect}
      >
        <SelectableImageBackground isEditing={isEditing} isSelect={this.state.isSelect} />
        <img src={imageSrc} alt={image.name} style={imageStyle} />
      </div>
    );
  }
}

JustifiedImageHolder.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  day: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
  imageSrc: PropTypes.string.isRequired,
  imageHolderStyle: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  groupTotal: PropTypes.number,
  // Below Pass from Redux
  group: PropTypes.object.isRequired,
  counter: PropTypes.number.isRequired,
  selectCounter: PropTypes.func.isRequired,
};
