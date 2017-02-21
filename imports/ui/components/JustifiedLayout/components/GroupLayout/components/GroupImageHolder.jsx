import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { selectCounter } from '/imports/ui/redux/actions/index.js';
import JustifiedImageBackground from '../../snippet/JustifiedImageBackground.jsx';

export class GroupImageHolder extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isSelect: false,
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { total, day, groupTotal } = this.props;
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
    if (allGroups.length === 0 || allGroups.indexOf(day) < 0) {
      this.setState({ isSelect: false });
      return;
    }
    _.each(nextProps.group, (value, key) => {
      if (key === day) {
        if (value === groupTotal) this.setState({ isSelect: true });
        if (value === 0) this.setState({ isSelect: false });
      }
    });
  }

  handleSelect() {
    const {
      isEditing,
      day,
      image,
      onImageClick,
    } = this.props;
    if (isEditing) {
      if (this.state.isSelect) {
        this.props.selectCounter({
          selectImages: [image],
          group: day,
          counter: -1,
        });
        this.setState({ isSelect: false });
      } else {
        this.props.selectCounter({
          selectImages: [image],
          group: day,
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
    const realWidth = Math.round(dimension.width * devicePixelRatio);
    const realHeight = Math.round(dimension.height * devicePixelRatio);
    const imageSrc = `${url}?imageView2/1/w/${realWidth}/h/${realHeight}`;
    const imageHolderStyle = {
      left: `${dimension.left}px`,
      top: `${dimension.top}px`,
      width: `${dimension.width}px`,
      height: `${dimension.height}px`,
    };
    return (
      <div
        className="Justified__imageHolder"
        style={imageHolderStyle}
        onTouchTap={this.handleSelect}
      >
        <JustifiedImageBackground isEditing={isEditing} isSelect={this.state.isSelect} />
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeave={false}
        >
          <img
            src={imageSrc}
            alt={image.name}
            style={{ transform: this.state.isSelect && 'scale(.8)' }}
            ref={(node) => { this.image = node; }}
          />
        </ReactCSSTransitionGroup>
      </div>
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
  day: PropTypes.string.isRequired,
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
