import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { connect } from 'react-redux';
import { selectCounter } from '/imports/ui/redux/actions/creators.js';
import { SelectableImageBackground } from './SelectableStatus.jsx';

const domain = Meteor.settings.public.domain;
const square = Math.ceil(document.body.clientWidth / 3);

export class SelectableImageHolder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSelect: false,
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { total } = this.props;
    if (nextProps.counter === total) {
      this.setState({ isSelect: true });
      return;
    }
    if (nextProps.counter === 0) {
      this.setState({ isSelect: false });
      return;
    }
  }

  handleSelect() {
    const { isEditing, image, dispatch } = this.props;
    if (isEditing) {
      if (this.state.isSelect) {
        dispatch(selectCounter({ selectImages: [image], group: 'nested', counter: -1 }));
        this.setState({ isSelect: false });
      } else {
        dispatch(selectCounter({ selectImages: [image], group: 'nested', counter: 1 }));
        this.setState({ isSelect: true });
      }
    }
  }

  render() {
    const { isEditing, image } = this.props;
    const url = `${domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
    const imageSource = `${url}?imageView2/1/w/${square * 2}/h/${square * 2}`;
    const imageStyle = {
      transform: this.state.isSelect && 'scale(.8)',
    };
    return (
      <div
        className="GridList__Tile"
        style={{ backgroundColor: isEditing ? '#eee' : '#fff' }}
        onTouchTap={this.handleSelect}
      >
        <SelectableImageBackground isEditing={isEditing} isSelect={this.state.isSelect} />
        <img
          src={imageSource}
          alt={image.name}
          style={imageStyle}
        />
      </div>
    );
  }
}

SelectableImageHolder.defaultProps = {
  isEditing: false,
};

SelectableImageHolder.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  image: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  // Below Pass from Redux
  counter: PropTypes.number,
  dispatch: PropTypes.func,
};

const mapStateToProps = (state) => ({
  counter: state.selectCounter.counter,
});

export default connect(mapStateToProps)(SelectableImageHolder);
