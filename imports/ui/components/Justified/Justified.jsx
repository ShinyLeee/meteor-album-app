import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { _ } from 'meteor/underscore';
import justifiedLayout from 'justified-layout';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';
import ComfyIcon from 'material-ui/svg-icons/image/view-comfy';
import CompactIcon from 'material-ui/svg-icons/image/view-compact';
import { enableSelectAll, disableSelectAll } from '/imports/ui/redux/actions/actionTypes.js';
import { SelectIcon } from './SelectStatus.jsx';
import SelectableImage from './SelectableImage.jsx';
import GridLayout from '../GridLayout/GridLayout.jsx';
import JustifiedGroupHolder from './JustifiedGroupHolder.jsx';

class Justified extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isAllSelect: false,
      layoutType: 'nested',
    };
    this.handleResize = this.handleResize.bind(this);
    this.handleToggleSelectAll = this.handleToggleSelectAll.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { images } = this.props;
    const { counter } = nextProps;
    // Fix potential issue that images is empty when first render
    if (counter > 0 && images.length === counter) this.setState({ isAllSelect: true });
    else this.setState({ isAllSelect: false });
  }

  handleResize() {}

  handleToggleSelectAll() {
    const { images, dispatch } = this.props;
    if (this.state.isAllSelect) dispatch(disableSelectAll());
    else {
      const counter = images.length;
      if (this.state.layoutType === 'nested') {
        dispatch(enableSelectAll({ selectImages: images, group: { nested: counter }, counter }));
      }
      if (this.state.layoutType === 'day-group') {
        const group = {};
        const dayGroupImages = _.groupBy(images, (image) => moment(image.shootAt).format('YYYYMMDD'));
        _.map(dayGroupImages, (value, key) => (group[key] = value.length));
        dispatch(enableSelectAll({ selectImages: images, group, counter }));
      }
    }
  }

  handleChangeLayout(type) {
    const { dispatch } = this.props;
    this.setState({ layoutType: type });
    dispatch(disableSelectAll());
  }

  renderToolbox() {
    const { isEditing } = this.props;
    return (
      <div className="Justified__toolbox">
        { isEditing && (
          <div className="Justified__toolbox_left" onTouchTap={this.handleToggleSelectAll}>
            <SelectIcon activate={this.state.isAllSelect} />
            <h4>选择全部</h4>
          </div>
        ) }
        <div className="Justified__toolbox_right">
          <IconButton onTouchTap={() => this.handleChangeLayout('nested')}>
            <ComfyIcon color={this.state.layoutType === 'nested' ? '#111' : '#757575'} />
          </IconButton>
          <IconButton onTouchTap={() => this.handleChangeLayout('day-group')}>
            <CompactIcon color={this.state.layoutType === 'day-group' ? '#111' : '#757575'} />
          </IconButton>
        </div>
      </div>
    );
  }

  renderDayGroupLayout() {
    const {
      images,
      isEditing,
      containerWidth,
      containerPadding,
      targetRowHeight,
      targetRowHeightTolerance,
      boxSpacing,
      fullWidthBreakoutRowCadence,
    } = this.props;

    const ratios = [];
    const geometrys = [];
    const dayGroupImages = _.groupBy(images, (image) => moment(image.shootAt).format('YYYYMMDD'));

    _.map(dayGroupImages, (dayGroupImage, day) => {
      ratios[day] = _.map(dayGroupImage, (image) => image.ratio);
      geometrys[day] = justifiedLayout(
        ratios[day],
        {
          containerWidth,
          containerPadding,
          targetRowHeight,
          targetRowHeightTolerance,
          boxSpacing,
          fullWidthBreakoutRowCadence,
        }
      );
    });

    return (
      _.map(dayGroupImages, (dayGroupImage, day) => (
        <JustifiedGroupHolder
          key={day}
          day={day}
          geometry={geometrys[day]}
          dayGroupImage={dayGroupImage}
          isEditing={isEditing}
          total={images.length}
          groupTotal={dayGroupImages[day].length}
        />
      ))
    );
  }

  renderNestedLayout() {
    const { isEditing, images } = this.props;
    return (
      <GridLayout>
        {
          images.map((image, i) => (
            <SelectableImage
              key={i}
              isEditing={isEditing}
              image={image}
              total={images.length}
            />
          ))
        }
      </GridLayout>
    );
  }

  render() {
    const containerStyle = this.state.layoutType === 'day-group' ? { top: 0 } : {};
    return (
      <div className="Justified" style={containerStyle}>
        { this.renderToolbox() }
        {
          this.state.layoutType === 'nested'
          ? this.renderNestedLayout()
          : this.renderDayGroupLayout()
        }
      </div>
    );
  }
}

Justified.defaultProps = {
  containerWidth: document.body.clientWidth,
  containerPadding: 0,
  targetRowHeight: 200,
  targetRowHeightTolerance: 0.25,
  boxSpacing: 4,
  fullWidthBreakoutRowCadence: false,
  onResize: this.handleResize,
};

Justified.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  images: PropTypes.array.isRequired,
  /**
   * See docs: http://flickr.github.io/justified-layout/
   */
  containerWidth: PropTypes.number.isRequired,
  containerPadding: PropTypes.number.isRequired,
  boxSpacing: PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.number,
  ]),
  fullWidthBreakoutRowCadence: PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.number,
  ]),
  targetRowHeight: PropTypes.number.isRequired,
  targetRowHeightTolerance: PropTypes.number.isRequired,
  justifiedContainer: PropTypes.string,
  onResize: PropTypes.func,
  counter: PropTypes.number,
  dispatch: PropTypes.func,
};

const mapStateToProps = (state) => ({ counter: state.selectCounter.counter });

export default connect(mapStateToProps)(Justified);
