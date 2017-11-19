import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ProgressiveImage from '/imports/ui/components/ProgressiveImage';
import { Cover } from './ProgressiveImage.style';

class ResponsiveCover extends Component {
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

  generateRatio() {
    const { device, basis, maxHeight } = this.props;
    const { width: deviceWidth, height: deviceHeight } = device;
    const height = Math.min(deviceHeight * basis, maxHeight);

    if (this.props.onLayout) {
      this.props.onLayout(height);
    }

    return height / deviceWidth;
  }

  render() {
    const { src } = this.props;
    const ratio = this.generateRatio();
    return (
      <ProgressiveImage
        aspectRatio={ratio}
        src={src}
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
