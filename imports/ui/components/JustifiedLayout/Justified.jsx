import { _ } from 'meteor/underscore';
import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import justifiedLayout from 'justified-layout';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';
import ComfyIcon from 'material-ui/svg-icons/image/view-comfy';
import CompactIcon from 'material-ui/svg-icons/image/view-compact';
import { enableSelectAll, disableSelectAll } from '/imports/ui/redux/actions/index.js';
import JustifiedGroupHolder from './JustifiedGroupHolder.jsx';
import GridLayout from '../GridLayout/GridLayout.jsx';
import SelectableIcon from '../SelectableImage/SelectableIcon.jsx';
import SelectableImageHolder from '../SelectableImage/SelectableImageHolder.jsx';

export class Justified extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isAllSelect: false,
      layoutType: 'nested',
    };
    this.handleToggleSelectAll = this.handleToggleSelectAll.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { images } = this.props;
    const { isEditing, counter } = nextProps;
    // Fix potential issue that images is empty when first render
    if (isEditing && counter > 0 && images.length === counter) this.setState({ isAllSelect: true });
    else this.setState({ isAllSelect: false });
  }

  handleToggleSelectAll() {
    if (this.state.isAllSelect) this.props.disableSelectAll();
    else {
      const counter = this.props.images.length;
      if (this.state.layoutType === 'nested') {
        this.props.enableSelectAll({
          selectImages: this.props.images,
          group: { nested: counter },
          counter,
        });
      }
      if (this.state.layoutType === 'day-group') {
        const group = {};
        const dayGroupImages = _.groupBy(
          this.props.images,
          (image) => moment(image.shootAt).format('YYYYMMDD')
        );
        _.map(dayGroupImages, (value, key) => (group[key] = value.length));
        this.props.enableSelectAll({
          selectImages: this.props.images,
          group,
          counter,
        });
      }
    }
  }

  handleChangeLayout(type) {
    this.setState({ layoutType: type });
    this.props.disableSelectAll();
  }

  renderDayGroupLayout() {
    const {
      domain,
      isEditing,
      images,
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
      ratios[day] = _.map(dayGroupImage, (image) => {
        const ratio = image.dimension[0] / image.dimension[1];
        return Math.round(ratio * 100) / 100; // toFixed will save unnecessary zero, it cause bug in justifiedLayout
      });
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
          domain={domain}
          isEditing={isEditing}
          day={day}
          geometry={geometrys[day]}
          dayGroupImage={dayGroupImage}
          total={images.length}
          groupTotal={dayGroupImages[day].length}
        />
      ))
    );
  }

  renderNestedLayout() {
    const { domain, isEditing, images } = this.props;
    return (
      <GridLayout>
        {
          images.map((image, i) => (
            <SelectableImageHolder
              key={i}
              domain={domain}
              isEditing={isEditing}
              index={i}
              image={image}
              total={images.length}
              onImageClick={this.handleImageClick}
            />
          ))
        }
      </GridLayout>
    );
  }

  render() {
    return (
      <div
        className="Justified"
        style={this.state.layoutType === 'day-group' ? { top: 0 } : {}}
      >
        <div className="Justified__toolbox">
          { this.props.isEditing && (
            <div className="Justified__toolbox_left" onTouchTap={this.handleToggleSelectAll}>
              <SelectableIcon activate={this.state.isAllSelect} />
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
        {
          this.state.layoutType === 'nested'
          ? this.renderNestedLayout()
          : this.renderDayGroupLayout()
        }
      </div>
    );
  }
}

Justified.displayName = 'Justified';

Justified.defaultProps = {
  isEditing: false,
  containerWidth: document.body.clientWidth,
  containerPadding: 0,
  targetRowHeight: 200,
  targetRowHeightTolerance: 0.25,
  boxSpacing: 4,
  fullWidthBreakoutRowCadence: false,
};

Justified.propTypes = {
  domain: PropTypes.string.isRequired,
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
  // Below Pass from Redux
  counter: PropTypes.number.isRequired,
  enableSelectAll: PropTypes.func.isRequired,
  disableSelectAll: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  counter: state.selectCounter.counter,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  enableSelectAll,
  disableSelectAll,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Justified);
