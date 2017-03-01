import { Meteor } from 'meteor/meteor';
import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { selectCounter } from '/imports/ui/redux/actions/index.js';
import JustifiedImageBackground from '../../snippet/JustifiedImageBackground.jsx';
import {
  Wrapper,
  SelectableImage,
} from './GridImageHolder.style.js';

export class GridImageHolder extends PureComponent {

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
    const {
      domain,
      isEditing,
      clientWidth,
      devicePixelRatio,
      image,
    } = this.props;
    const realDimension = clientWidth / 3;
    const retinaDimension = Math.round(realDimension * devicePixelRatio);
    const url = `${domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
    const imageSrc = `${url}?imageView2/1/w/${retinaDimension}`;
    return (
      <Wrapper
        style={{ backgroundColor: image.color }}
        onTouchTap={this.handleSelect}
      >
        <JustifiedImageBackground
          isEditing={isEditing}
          isSelect={this.state.isSelect}
        />
        <LazyLoad
          height={Math.round(realDimension)}
          once
        >
          <ReactCSSTransitionGroup
            transitionName="fade"
            transitionAppear
            transitionAppearTimeout={375}
            transitionEnterTimeout={375}
            transitionLeave={false}
          >
            <SelectableImage
              src={imageSrc}
              alt={image.name}
              isSelect={this.state.isSelect}
              innerRef={(node) => { this.image = node; }}
            />
          </ReactCSSTransitionGroup>
        </LazyLoad>
      </Wrapper>
    );
  }
}

GridImageHolder.displayName = 'GridImageHolder';

GridImageHolder.defaultProps = {
  isEditing: false,
  domain: Meteor.settings.public.imageDomain,
  clientWidth: document.body.clientWidth,
  devicePixelRatio: window.devicePixelRatio,
};

GridImageHolder.propTypes = {
  domain: PropTypes.string.isRequired,
  clientWidth: PropTypes.number.isRequired,
  devicePixelRatio: PropTypes.number.isRequired,
  isEditing: PropTypes.bool.isRequired,
  image: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  onImageClick: PropTypes.func,
  // Below Pass from Redux
  counter: PropTypes.number.isRequired,
  selectCounter: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  counter: state.selectCounter.counter,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  selectCounter,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(GridImageHolder);
