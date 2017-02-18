import { _ } from 'meteor/underscore';
import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { photoSwipeOpen, selectCounter } from '/imports/ui/redux/actions/index.js';
import SelectableImageBackground from '../SelectableImage/SelectableImageBackground.jsx';

export class JustifiedImageHolder extends PureComponent {

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
    const { isEditing, index, day, image } = this.props;
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
    } else {
      this.props.photoSwipeOpen({ index, history: false });
    }
  }

  render() {
    const { isEditing, image, imageSrc, imageHolderStyle } = this.props;
    const imageStyle = {
      transform: this.state.isSelect && 'scale(.8)',
    };
    return (
      <div
        className="Justified__imageHolder"
        style={imageHolderStyle}
        onTouchTap={this.handleSelect}
      >
        <SelectableImageBackground isEditing={isEditing} isSelect={this.state.isSelect} />
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeave={false}
        >
          <img src={imageSrc} alt={image.name} style={imageStyle} />
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

JustifiedImageHolder.displayName = 'JustifiedImageHolder';

JustifiedImageHolder.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  day: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
  imageSrc: PropTypes.string.isRequired,
  imageHolderStyle: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  groupTotal: PropTypes.number,
  // Below Pass from Redux
  group: PropTypes.object.isRequired,
  counter: PropTypes.number.isRequired,
  photoSwipeOpen: PropTypes.func.isRequired,
  selectCounter: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  group: state.selectCounter.group,
  counter: state.selectCounter.counter,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  photoSwipeOpen,
  selectCounter,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(JustifiedImageHolder);
