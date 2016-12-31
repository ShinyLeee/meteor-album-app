import React, { Component, PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import { connect } from 'react-redux';
import { selectCounter } from '/imports/ui/redux/actions/actionTypes.js';
import { SelectBackground } from './SelectStatus.jsx';

class JustifiedImageHolder extends Component {

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
    _.map(nextProps.group, (value, key) => {
      if (key === day && value === groupTotal) this.setState({ isSelect: true });
      if (key === day && value === 0) this.setState({ isSelect: false });
    });
  }

  handleSelect() {
    const { day, isEditing, image, dispatch } = this.props;
    if (isEditing) {
      if (this.state.isSelect) {
        dispatch(selectCounter({ selectImages: [image], group: day, counter: -1 }));
        this.setState({ isSelect: false });
      } else {
        dispatch(selectCounter({ selectImages: [image], group: day, counter: 1 }));
        this.setState({ isSelect: true });
      }
    }
  }

  render() {
    const { isEditing, image, imageSource, style } = this.props;
    const imageStyle = {
      transform: this.state.isSelect && 'scale(.8)',
    };
    return (
      <div
        className="Justified__imageHolder"
        style={style}
        onTouchTap={this.handleSelect}
      >
        <SelectBackground isEditing={isEditing} isSelect={this.state.isSelect} />
        <img src={imageSource} alt={image.name} style={imageStyle} />
      </div>
    );
  }
}

JustifiedImageHolder.propTypes = {
  image: PropTypes.object.isRequired,
  imageSource: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  total: PropTypes.number.isRequired,
  day: PropTypes.string,
  groupTotal: PropTypes.number,
  // Below Pass from Redux
  group: PropTypes.object,
  counter: PropTypes.number,
  dispatch: PropTypes.func,
};

const mapStateToProps = (state) => ({
  group: state.selectCounter.group,
  counter: state.selectCounter.counter,
});

export default connect(mapStateToProps)(JustifiedImageHolder);
