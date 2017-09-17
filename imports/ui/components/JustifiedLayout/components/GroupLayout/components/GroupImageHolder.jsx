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

export class GroupImageHolder extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isSelect: false,
    };
    this.handleSelect = this.handleSelect.bind(this);
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

  handleSelect() {
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
      domain,
      devicePixelRatio,
      isEditing,
      dimension,
      image,
    } = this.props;
    const url = `${domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
    const retinaWidth = Math.round(dimension.width * devicePixelRatio);
    const retinaHeight = Math.round(dimension.height * devicePixelRatio);
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
        onTouchTap={this.handleSelect}
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

GroupImageHolder.displayName = 'GroupImageHolder';

GroupImageHolder.defaultProps = {
  domain: Meteor.settings.public.imageDomain,
  devicePixelRatio: window.devicePixelRatio,
};

GroupImageHolder.propTypes = {
  domain: PropTypes.string.isRequired,
  devicePixelRatio: PropTypes.number.isRequired,
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
};

const mapStateToProps = (state) => ({
  group: state.selectCounter.group,
  counter: state.selectCounter.counter,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  selectCounter,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(GroupImageHolder);
