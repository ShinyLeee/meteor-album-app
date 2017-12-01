import forEach from 'lodash/forEach';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import settings from '/imports/utils/settings';
import { selectCounter } from '/imports/ui/redux/actions';
import ProgressiveImage from '/imports/ui/components/ProgressiveImage';
import JustifiedImageBackground from '../../snippet/JustifiedImageBackground';
import { Wrapper, SelectableImage } from './GroupImageHolder.style';

const { imageDomain } = settings;

export class GroupImageHolder extends PureComponent {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    groupName: PropTypes.string.isRequired,
    dimension: PropTypes.object.isRequired,
    image: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired,
    total: PropTypes.number.isRequired,
    groupTotal: PropTypes.number,
    onImageClick: PropTypes.func,
    onImageLoad: PropTypes.func.isRequired,
    group: PropTypes.object.isRequired,
    counter: PropTypes.number.isRequired,
    selectCounter: PropTypes.func.isRequired,
  }

  state = {
    isSelect: false,
  }

  componentWillReceiveProps(nextProps) {
    const { total, groupName, groupTotal } = this.props;
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
    if (allGroups.length === 0 || allGroups.indexOf(groupName) < 0) {
      this.setState({ isSelect: false });
      return;
    }
    forEach(nextProps.group, (value, key) => {
      if (key === groupName) {
        if (value === groupTotal) this.setState({ isSelect: true });
        if (value === 0) this.setState({ isSelect: false });
      }
    });
  }

  _handleSelect = () => {
    const {
      isEditing,
      groupName,
      image,
      onImageClick,
    } = this.props;
    if (isEditing) {
      if (this.state.isSelect) {
        this.props.selectCounter({
          selectImages: [image],
          group: groupName,
          counter: -1,
        });
        this.setState({ isSelect: false });
      } else {
        this.props.selectCounter({
          selectImages: [image],
          group: groupName,
          counter: 1,
        });
        this.setState({ isSelect: true });
      }
    } else if (onImageClick) {
      onImageClick();
    }
  }

  render() {
    const {
      isEditing,
      dimension,
      image,
      device,
    } = this.props;
    const url = `${imageDomain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
    const retinaWidth = Math.round(dimension.width * device.pixelRatio);
    const retinaHeight = Math.round(dimension.height * device.pixelRatio);
    const imageSrc = `${url}?imageView2/1/w/${retinaWidth}/h/${retinaHeight}`;
    const imageHolderStyle = {
      left: `${dimension.left}px`,
      top: `${dimension.top}px`,
      width: `${dimension.width}px`,
      height: `${dimension.height}px`,
    };
    return (
      <Wrapper
        style={imageHolderStyle}
        onClick={this._handleSelect}
      >
        <JustifiedImageBackground
          isEditing={isEditing}
          isSelect={this.state.isSelect}
        />
        <LazyLoad
          height={dimension.height}
          once
        >
          <ProgressiveImage
            src={imageSrc}
            aspectRatio={image.dimension[1] / image.dimension[0]}
            color={image.color}
          >
            <SelectableImage
              src={imageSrc}
              alt={image.name}
              isSelect={this.state.isSelect}
              innerRef={(node) => { this.image = node; }}
              onLoad={this.props.onImageLoad}
            />
          </ProgressiveImage>
        </LazyLoad>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  device: state.device,
  group: state.selectCounter.group,
  counter: state.selectCounter.counter,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  selectCounter,
}, dispatch);

export default connect(
  mapStateToProps, mapDispatchToProps, null, { withRef: true },
)(GroupImageHolder);
