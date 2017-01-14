import React, { Component, PropTypes } from 'react';

import { SelectableImageBackground } from './SelectableStatus.jsx';

export default class SelectableImageHolder extends Component {

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
    if (this.props.isEditing) {
      if (this.state.isSelect) {
        this.props.selectCounter({
          selectImages: [this.props.image],
          group: 'nested',
          counter: -1,
        });
        this.setState({ isSelect: false });
      } else {
        this.props.selectCounter({
          selectImages: [this.props.image],
          group: 'nested',
          counter: 1,
        });
        this.setState({ isSelect: true });
      }
    }
  }

  render() {
    const { domain, isEditing, clientWidth, image } = this.props;
    const square = Math.ceil(clientWidth / 3);
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
  clientWidth: document.body.clientWidth,
};

SelectableImageHolder.propTypes = {
  domain: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  clientWidth: PropTypes.number.isRequired,
  image: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  // Below Pass from Redux
  counter: PropTypes.number.isRequired,
  selectCounter: PropTypes.func.isRequired,
};
