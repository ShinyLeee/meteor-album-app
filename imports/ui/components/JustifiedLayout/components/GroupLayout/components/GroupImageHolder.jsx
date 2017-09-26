import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { selectCounter } from '/imports/ui/redux/actions/index.js';
import JustifiedImageBackground from '../../snippet/JustifiedImageBackground.jsx';
import { Wrapper, SelectableImage } from './GroupImageHolder.style.js';

const domain = Meteor.settings.public.imageDomain;

export class GroupImageHolder extends PureComponent {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    groupName: PropTypes.string.isRequired,
    dimension: PropTypes.object.isRequired,
    image: PropTypes.object.isRequired,
    total: PropTypes.number.isRequired,
    groupTotal: PropTypes.number,
    onImageClick: PropTypes.func,
    // Below Pass from Redux
    group: PropTypes.object.isRequired,
    counter: PropTypes.number.isRequired,
    selectCounter: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this._pixelRatio = window.devicePixelRatio;
    this.state = {
      isSelect: false,
    };
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
    _.forEach(nextProps.group, (value, key) => {
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
    } = this.props;
    const url = `${domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
    const retinaWidth = Math.round(dimension.width * this._pixelRatio);
    const retinaHeight = Math.round(dimension.height * this._pixelRatio);
    const imageSrc = `${url}?imageView2/1/w/${retinaWidth}/h/${retinaHeight}`;
    const imageHolderStyle = {
      left: `${dimension.left}px`,
      top: `${dimension.top}px`,
      width: `${dimension.width}px`,
      height: `${dimension.height}px`,
      backgroundColor: image.color,
    };
    return (
      <Wrapper
        style={imageHolderStyle}
        onTouchTap={this._handleSelect}
      >
        <JustifiedImageBackground isEditing={isEditing} isSelect={this.state.isSelect} />
        <LazyLoad
          height={dimension.height}
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

const mapStateToProps = (state) => ({
  group: state.selectCounter.group,
  counter: state.selectCounter.counter,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  selectCounter,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(GroupImageHolder);
