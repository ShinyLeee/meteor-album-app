/* eslint max-len: 0 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { _ } from 'meteor/underscore';
import justifiedLayout from 'justified-layout';
import moment from 'moment';

import JustifiedGroupHolder from './JustifiedGroupHolder.jsx';
import JustifiedImageHolder from './JustifiedImageHolder.jsx';
import { enableSelectAll, disableSelectAll } from '../../actions/actionTypes.js';

class Justified extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isAllSelect: false,
      renderImages: this.props.images,
    };
    this.handleResize = this.handleResize.bind(this);
    this.handleToggleSelectAll = this.handleToggleSelectAll.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const images = nextProps.images;
    if (this.props.galleryShowingType !== nextProps.galleryShowingType) {
      if (nextProps.galleryShowingType === 'day-group') {
        const dayGroupImages = _.groupBy(images, (image) => moment(image.createdAt).format('YYYYMMDD'));
        this.setState({ renderImages: dayGroupImages });
      } else if (nextProps.galleryShowingType === 'nested') {
        this.setState({ renderImages: images });
      }
    }
    if (this.props.images.length === nextProps.counter) this.setState({ isAllSelect: true });
    else this.setState({ isAllSelect: false });
  }

  handleResize() {}

  handleToggleSelectAll() {
    const { images, dispatch } = this.props;
    if (this.state.isAllSelect) dispatch(disableSelectAll());
    else {
      const group = {};
      const dayGroupImages = this.state.renderImages;
      _.map(dayGroupImages, (value, key) => (group[key] = value.length));
      dispatch(enableSelectAll({ group, counter: images.length }));
    }
  }

  renderToolbox() {
    const selectSvg = {
      fill: this.state.isAllSelect ? '#4285f4' : 'rgba(0,0,0,0.54)',
      fillOpacity: 1,
    };
    return (
      <div className="justified-toolbox">
        <div className="select-all" onTouchTap={this.handleToggleSelectAll}>
          <svg width="24px" height="24px" style={selectSvg} viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <h4>选择全部</h4>
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
    const dayGroupImages = this.state.renderImages;

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
      isEditing,
      containerWidth,
      containerPadding,
      targetRowHeight,
      targetRowHeightTolerance,
      boxSpacing,
      fullWidthBreakoutRowCadence,
    } = this.props;
    const nestedImage = this.state.renderImages;

    const ratio = _.map(nestedImage, (image) => image.ratio);
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

    const images = [];

    for (let i = 0; i < nestedImage.length; i++) {
      images.push(_.extend(nestedImage[i], geometry.boxes[i]));
    }

    const imageBgdStyle = isEditing ? { opacity: 1 } : {};
    return images.map((image) => {
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
    const { justifiedContainer, galleryShowingType, isEditing } = this.props;
    const containerStyle = galleryShowingType === 'day-group' ? { top: 0 } : {};
    return (
      <div className={justifiedContainer} style={containerStyle}>
        { isEditing && this.renderToolbox() }
        {
          galleryShowingType === 'nested'
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
   * galleryShowingType:
   *
   * Define galleryShowingType,
   * eg: 'day-group', 'nested'
   * Default: 'day-group'
   */
  galleryShowingType: PropTypes.oneOf(['day-group', 'nested']),
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
