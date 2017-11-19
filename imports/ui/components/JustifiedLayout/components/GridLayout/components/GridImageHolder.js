import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import settings from '/imports/utils/settings';
import { selectCounter } from '/imports/ui/redux/actions';
import ProgressiveImage from '/imports/ui/components/ProgressiveImage';
import JustifiedImageBackground from '../../snippet/JustifiedImageBackground';
import {
  Wrapper,
  SelectableImage,
} from './GridImageHolder.style';

const { imageDomain } = settings;

export class GridImageHolder extends PureComponent {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    image: PropTypes.object.isRequired,
    total: PropTypes.number.isRequired,
    dimension: PropTypes.number.isRequired,
    onImageClick: PropTypes.func,
    counter: PropTypes.number.isRequired,
    selectCounter: PropTypes.func.isRequired,
  }

  state = {
    isSelect: false,
  }

  componentWillReceiveProps(nextProps) {
    const { total } = this.props;
    if (nextProps.counter === total) {
      this.setState({ isSelect: true });
      return;
    }
    if (nextProps.counter === 0) {
      this.setState({ isSelect: false });
    }
  }

  _handleSelect = () => {
    const {
      isEditing,
      image,
      onImageClick,
    } = this.props;

    if (isEditing) {
      if (this.state.isSelect) {
        this.props.selectCounter({
          selectImages: [image],
          group: 'grid',
          counter: -1,
        });
        this.setState({ isSelect: false });
      } else {
        this.props.selectCounter({
          selectImages: [image],
          group: 'grid',
          counter: 1,
        });
        this.setState({ isSelect: true });
      }
    } else if (onImageClick) {
      onImageClick();
    }
  }

  render() {
    const { isEditing, image, dimension } = this.props;
    const url = `${imageDomain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
    const imageSrc = `${url}?imageView2/1/w/${dimension}`;
    return (
      <Wrapper onClick={this._handleSelect}>
        <JustifiedImageBackground
          isEditing={isEditing}
          isSelect={this.state.isSelect}
        />
        <LazyLoad
          height={dimension}
          once
        >
          <ProgressiveImage
            src={imageSrc}
            aspectRatio={1}
            color={image.color}
          >
            <SelectableImage
              src={imageSrc}
              alt={image.name}
              isSelect={this.state.isSelect}
              innerRef={(node) => { this.image = node; }}
            />
          </ProgressiveImage>
        </LazyLoad>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  counter: state.selectCounter.counter,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  selectCounter,
}, dispatch);

export default connect(
  mapStateToProps, mapDispatchToProps, null, { withRef: true },
)(GridImageHolder);
