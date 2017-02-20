import { _ } from 'meteor/underscore';
import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';
import ComfyIcon from 'material-ui/svg-icons/image/view-comfy';
import CompactIcon from 'material-ui/svg-icons/image/view-compact';
import { enableSelectAll, disableSelectAll, photoSwipeOpen } from '/imports/ui/redux/actions/index.js';
import ConnectedJustifiedGroupHolder from './JustifiedGroupHolder.jsx';
// import GridLayout from '../GridLayout/GridLayout.jsx';
import ConnectedGridLayoutHolder from '../GridLayout/GridLayoutHolder.jsx';
import SelectableIcon from '../SelectableImage/SelectableIcon.jsx';
// import ConnectedSelectableImageHolder from '../SelectableImage/SelectableImageHolder.jsx';

export class Justified extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isAllSelect: false,
      layoutType: 'group',
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
      if (this.state.layoutType === 'grid') {
        this.props.enableSelectAll({
          selectImages: this.props.images,
          group: { grid: counter },
          counter,
        });
      }
      if (this.state.layoutType === 'group') {
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

  renderGroupLayout() {
    const { isEditing, images } = this.props;
    const dayGroupImages = _.groupBy(images, (image) => moment(image.shootAt).format('YYYYMMDD'));
    return (
      _.map(dayGroupImages, (dayGroupImage, day) => (
        <ConnectedJustifiedGroupHolder
          key={day}
          isEditing={isEditing}
          day={day}
          dayGroupImage={dayGroupImage}
          total={images.length}
          groupTotal={dayGroupImages[day].length}
        />
      ))
    );
  }

  renderGridLayout() {
    const { isEditing, images } = this.props;
    return (
      <ConnectedGridLayoutHolder
        isEditing={isEditing}
        images={images}
      />
    );
  }

  /* renderGridLayout() {
    const { isEditing, images } = this.props;
    return (
      <GridLayout>
        {
          images.map((image, i) => (
            <ConnectedSelectableImageHolder
              key={i}
              isEditing={isEditing}
              image={image}
              total={images.length}
              onImageClick={() => this.props.photoSwipeOpen(
                this.state.pswpItems,
                {
                  index: i,
                  history: false,
                  getThumbBoundsFn: (index) => {
                    const thumbnail = this[`thumbnail${index}`];
                    const img = thumbnail.getWrappedInstance().image;
                    const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                    const rect = img.getBoundingClientRect();
                    return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
                  },
                }
              )}
            />
          ))
        }
      </GridLayout>
    );
  }*/

  render() {
    return (
      <div
        className="Justified"
        style={this.state.layoutType === 'group' ? { top: 0 } : {}}
      >
        <div className="Justified__toolbox">
          { this.props.isEditing && (
            <div className="Justified__toolbox_left" onTouchTap={this.handleToggleSelectAll}>
              <SelectableIcon activate={this.state.isAllSelect} />
              <h4>选择全部</h4>
            </div>
          ) }
          <div className="Justified__toolbox_right">
            <IconButton onTouchTap={() => this.handleChangeLayout('group')}>
              <CompactIcon color={this.state.layoutType === 'group' ? '#111' : '#757575'} />
            </IconButton>
            <IconButton onTouchTap={() => this.handleChangeLayout('grid')}>
              <ComfyIcon color={this.state.layoutType === 'grid' ? '#111' : '#757575'} />
            </IconButton>
          </div>
        </div>
        {
          this.state.layoutType === 'grid'
          ? this.renderGridLayout()
          : this.renderGroupLayout()
        }
      </div>
    );
  }
}

Justified.displayName = 'Justified';

Justified.defaultProps = {
  isEditing: false,
};

Justified.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  images: PropTypes.array.isRequired,
  // Below Pass from Redux
  counter: PropTypes.number.isRequired,
  enableSelectAll: PropTypes.func.isRequired,
  disableSelectAll: PropTypes.func.isRequired,
  photoSwipeOpen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  counter: state.selectCounter.counter,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  enableSelectAll,
  disableSelectAll,
  photoSwipeOpen,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Justified);
