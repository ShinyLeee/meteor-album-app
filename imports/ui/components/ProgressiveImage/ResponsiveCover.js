import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ProgressiveImage from '/imports/ui/components/ProgressiveImage';
import { Cover } from './ProgressiveImage.style';

const loadedCover = [];

function isLoaded(src) {
  return loadedCover.includes(src);
}

class ResponsiveCover extends PureComponent {
  static propTypes = {
    device: PropTypes.object.isRequired,
    src: PropTypes.string.isRequired,
    basis: PropTypes.number,
    maxHeight: PropTypes.number,
    onLayout: PropTypes.func,
  }

  static defaultProps = {
    basis: 0.3,
    maxHeight: 300,
  }

  constructor(props) {
    super(props);
    this._height = null;
  }

  componentDidMount() {
    if (this.props.onLayout) {
      this.props.onLayout(this._height);
    }
  }

  componentDidUpdate() {
    if (this.props.onLayout) {
      this.props.onLayout(this._height);
    }
  }

  _handleSaveCover = (src) => {
    if (!isLoaded(src)) {
      loadedCover.push(src);
    }
  }

  generateHeight() {
    const { device, basis, maxHeight } = this.props;
    const { height: deviceHeight } = device;
    this._height = Math.min(deviceHeight * basis, maxHeight);
    return this._height;
  }

  render() {
    const { src, device: { width } } = this.props;
    const height = this.generateHeight();
    const ratio = height / width;
    return (
      <ProgressiveImage
        aspectRatio={ratio}
        src={src}
        onLoad={this._handleSaveCover}
        disabled={isLoaded(src)}
      >
        <Cover>
          <div />
          <img src={src} alt="prenstation" />
        </Cover>
      </ProgressiveImage>
    );
  }
}

const mapStateToProps = ({ device }) => ({
  device,
});

export default compose(
  connect(mapStateToProps),
)(ResponsiveCover);
