/* eslint max-len: 0 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { _ } from 'meteor/underscore';
import justifiedLayout from 'justified-layout';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';
import ComfyIcon from 'material-ui/svg-icons/image/view-comfy';
import CompactIcon from 'material-ui/svg-icons/image/view-compact';

import JustifiedGroupHolder from './JustifiedGroupHolder.jsx';
import JustifiedImageHolder from './JustifiedImageHolder.jsx';
import { enableSelectAll, disableSelectAll } from '../../actions/actionTypes.js';

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
    if (this.props.images.length === nextProps.counter) this.setState({ isAllSelect: true });
    else this.setState({ isAllSelect: false });
  }

  handleResize() {}

  handleToggleSelectAll() {
    const { images, dispatch } = this.props;
    if (this.state.isAllSelect) dispatch(disableSelectAll());
    else {
      const group = {};
      const dayGroupImages = _.groupBy(images, (image) => moment(image.shootAt).format('YYYYMMDD'));
      _.map(dayGroupImages, (value, key) => (group[key] = value.length));
      const selectImages = _.map(images, (value) => value._id);
      dispatch(enableSelectAll({ selectImages, group, counter: images.length }));
    }
  }

  handleChangeLayout(type) {
    const { dispatch } = this.props;
    this.setState({ layoutType: type });
    dispatch(disableSelectAll());
  }

  renderToolbox() {
    const { isEditing } = this.props;
    const selectSvg = {
      fill: this.state.isAllSelect ? '#4285f4' : 'rgba(0,0,0,0.54)',
      fillOpacity: 1,
    };
    return (
      <div className="justified-toolbox">
        { isEditing && (
          <div className="toolbox-left" onTouchTap={this.handleToggleSelectAll}>
            <svg width="24px" height="24px" style={selectSvg} viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <h4>选择全部</h4>
          </div>
        ) }
        <div className="toolbox-right">
          <IconButton onTouchTap={() => { this.handleChangeLayout('nested'); }}>
            <ComfyIcon color={this.state.layoutType === 'nested' ? '#111' : '#757575'} />
          </IconButton>
          <IconButton onTouchTap={() => { this.handleChangeLayout('day-group'); }}>
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

    const imageBgdStyle = isEditing ? { opacity: 1 } : {};
    return (
      _.map(dayGroupImages, (dayGroupImage, day) => (
        <JustifiedGroupHolder
          key={day}
          day={day}
          geometry={geometrys[day]}
          dayGroupImage={dayGroupImage}
          backgroundStyle={imageBgdStyle}
          isEditing={isEditing}
          total={images.length}
          groupTotal={dayGroupImages[day].length}
        />
      ))
    );
  }

  renderNestedLayout() {
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

    const ratio = _.map(images, (image) => image.ratio);
    const geometry = justifiedLayout(
      ratio,
      {
        containerWidth,
        containerPadding,
        targetRowHeight,
        targetRowHeightTolerance,
        boxSpacing,
        fullWidthBreakoutRowCadence,
      }
    );

    const renderImages = [];

    for (let i = 0; i < images.length; i++) {
      renderImages.push(_.extend(images[i], geometry.boxes[i]));
    }

    const imageBgdStyle = isEditing ? { opacity: 1 } : {};
    return renderImages.map((image) => {
      const imageSource = `${image.url}?imageView2/1/w/${image.width}/h/${image.height}`;
      const imageHolderStyle = {
        width: `${image.width}px`,
        height: `${image.height}px`,
        top: `${image.top}px`,
        left: `${image.left}px`,
      };
      return (
        <JustifiedImageHolder
          key={image._id}
          image={image}
          style={imageHolderStyle}
          backgroundStyle={imageBgdStyle}
          imageSource={imageSource}
          isEditing={isEditing}
          total={images.length}
        />
      );
    });
  }

  render() {
    const { justifiedContainer } = this.props;
    const containerStyle = this.state.layoutType === 'day-group' ? { top: 0 } : {};
    return (
      <div className={justifiedContainer} style={containerStyle}>
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
  targetRowHeightTolerance: 0.15,
  boxSpacing: 4,
  fullWidthBreakoutRowCadence: false,
  justifiedContainer: 'justified-container',
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
