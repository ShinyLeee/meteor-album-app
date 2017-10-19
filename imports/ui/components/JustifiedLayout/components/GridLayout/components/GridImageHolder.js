import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import { TransitionGroup } from 'react-transition-group';
import { vWidth, pixelRatio } from '/imports/utils/responsive';
import settings from '/imports/utils/settings';
import { selectCounter } from '/imports/ui/redux/actions';
import FadeTransition from '/imports/ui/components/Transition/Fade';
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
    const { isEditing, image } = this.props;
    const realDimension = vWidth / 3;
    const retinaDimension = Math.round(realDimension * pixelRatio);
    const url = `${imageDomain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
    const imageSrc = `${url}?imageView2/1/w/${retinaDimension}`;
    return (
      <Wrapper
        style={{ backgroundColor: image.color }}
        onClick={this._handleSelect}
      >
        <JustifiedImageBackground
          isEditing={isEditing}
          isSelect={this.state.isSelect}
        />
        <LazyLoad
          height={Math.round(realDimension)}
          once
        >
          <TransitionGroup>
            <FadeTransition>
              <SelectableImage
                src={imageSrc}
                alt={image.name}
                isSelect={this.state.isSelect}
                innerRef={(node) => { this.image = node; }}
              />
            </FadeTransition>
          </TransitionGroup>
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

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(GridImageHolder);
