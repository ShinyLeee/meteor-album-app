import { _ } from 'meteor/underscore';
import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';
import ComfyIcon from 'material-ui/svg-icons/image/view-comfy';
import CompactIcon from 'material-ui/svg-icons/image/view-compact';
import {
  enableSelectAll,
  disableSelectAll,
  photoSwipeOpen } from '/imports/ui/redux/actions/index.js';
import ConnectedGroupLayout from './components/GroupLayout/GroupLayout.jsx';
import ConnectedGridLayout from './components/GridLayout/GridLayout.jsx';
import JustifiedSelectIcon from './components/snippet/JustifiedSelectIcon.jsx';
import {
  Wrapper,
  Toolbar,
  ToolbarLeft,
  ToolbarRight,
} from './Justified.style.js';

export class Justified extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      layoutType: 'group',
      isAllSelect: false,
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
        _.each(dayGroupImages, (value, key) => (group[key] = value.length));
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

  render() {
    let dayGroupImages = [];
    const { isEditing, images } = this.props;
    const isDefaultLayout = this.state.layoutType === 'group';
    if (isDefaultLayout) {
      dayGroupImages = _.groupBy(images, (image) => moment(image.shootAt).format('YYYYMMDD'));
    }
    return (
      <Wrapper isDefaultLayout={isDefaultLayout}>
        <Toolbar>
          { isEditing && (
            <ToolbarLeft onTouchTap={this.handleToggleSelectAll}>
              <JustifiedSelectIcon activate={this.state.isAllSelect} />
              <h4>选择全部</h4>
            </ToolbarLeft>
          ) }
          <ToolbarRight>
            <IconButton onTouchTap={() => this.handleChangeLayout('group')}>
              <CompactIcon color={isDefaultLayout ? '#111' : '#757575'} />
            </IconButton>
            <IconButton onTouchTap={() => this.handleChangeLayout('grid')}>
              <ComfyIcon color={isDefaultLayout ? '#757575' : '#111'} />
            </IconButton>
          </ToolbarRight>
        </Toolbar>
        {
          isDefaultLayout
          ? (
            _.map(dayGroupImages, (dayGroupImage, day) => (
              <ConnectedGroupLayout
                key={day}
                isEditing={isEditing}
                day={day}
                dayGroupImage={dayGroupImage}
                total={images.length}
                groupTotal={dayGroupImages[day].length}
                showGallery
              />
              ))
            )
          : (
            <ConnectedGridLayout
              isEditing={isEditing}
              images={images}
              showGallery
            />
          )
        }
      </Wrapper>
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
