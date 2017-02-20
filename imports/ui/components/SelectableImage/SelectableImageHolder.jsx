import { Meteor } from 'meteor/meteor';
import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { selectCounter } from '/imports/ui/redux/actions/index.js';
import SelectableImageBackground from './SelectableImageBackground.jsx';

export class SelectableImageHolder extends PureComponent {

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
    const realDimension = Math.round((clientWidth / 3) * devicePixelRatio);
    const url = `${domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
    const imageSrc = `${url}?imageView2/1/w/${realDimension}`;
    return (
      <div
        className="GridLayout__Image"
        style={{ backgroundColor: isEditing ? '#eee' : '#fff' }}
        onTouchTap={this.handleSelect}
      >
        <SelectableImageBackground
          isEditing={isEditing}
          isSelect={this.state.isSelect}
        />
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

SelectableImageHolder.displayName = 'SelectableImageHolder';

SelectableImageHolder.defaultProps = {
  isEditing: false,
  domain: Meteor.settings.public.imageDomain,
  clientWidth: document.body.clientWidth,
  devicePixelRatio: window.devicePixelRatio,
};

SelectableImageHolder.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(SelectableImageHolder);
