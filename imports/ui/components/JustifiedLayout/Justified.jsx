import { _ } from 'meteor/underscore';
import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { enableSelectAll, disableSelectAll } from '/imports/ui/redux/actions/index.js';
import ConnectedGroupLayout from './components/GroupLayout/GroupLayout.jsx';
import ConnectedGridLayout from './components/GridLayout/GridLayout.jsx';
import ToolBar from './components/ToolBar/ToolBar.jsx';
import { Wrapper } from './Justified.style.js';

export class Justified extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isAllSelect: false,
      layoutType: 'group',
      filterType: 'day',
      allImages: props.images, // only used to grid layout
      allGroupImages: this.generateAllGroupImages(props.images),
    };
    this.handleToggleSelectAll = this.handleToggleSelectAll.bind(this);
    this.handleLayoutChange = this.handleLayoutChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { images } = this.props;
    const { isEditing, counter } = nextProps;
    // only when images' length change we need to regenerate the group images
    if (images.length !== nextProps.images.length) {
      const allGroupImages = this.generateAllGroupImages(nextProps.images, this.state.filterType);
      this.setState({ allGroupImages });
    }
    // Fix potential issue that images is empty when first render
    if (isEditing && counter > 0 && images.length === counter) this.setState({ isAllSelect: true });
    else this.setState({ isAllSelect: false });
  }

  handleToggleSelectAll() {
    const { images } = this.props;
    const { isAllSelect, layoutType } = this.state;

    if (isAllSelect) this.props.disableSelectAll();
    else {
      const counter = images.length;
      if (layoutType === 'grid') {
        this.props.enableSelectAll({
          selectImages: images,
          group: { grid: counter },
          counter,
        });
      }
      if (layoutType === 'group') {
        const group = {};
        const allGroupImages = _.groupBy(
          images,
          (image) => moment(image.shootAt).format('YYYYMMDD')
        );
        _.each(allGroupImages, (value, key) => (group[key] = value.length));
        this.props.enableSelectAll({
          selectImages: images,
          group,
          counter,
        });
      }
    }
  }

  handleLayoutChange(newLayoutType) {
    let newFilterType;
    if (newLayoutType === 'group') newFilterType = 'day';
    else if (newLayoutType === 'grid') newFilterType = 'latest';
    this.setState({ layoutType: newLayoutType, filterType: newFilterType });
    this.props.disableSelectAll();
  }

  handleFilterChange(newFilterType) {
    if (this.state.layoutType === 'group') {
      const allGroupImages = this.generateAllGroupImages(this.props.images, newFilterType);
      this.setState({ filterType: newFilterType, allGroupImages });
    }
    if (this.state.layoutType === 'grid') {
      const { images } = this.props;
      let allImages;
      if (newFilterType === 'latest') allImages = [...images];
      if (newFilterType === 'oldest') allImages = [...images].reverse();
      if (newFilterType === 'popular') allImages = [...images].sort((p, n) => n.liker.length - p.liker.length);
      this.setState({ filterType: newFilterType, allImages });
    }
  }

  generateAllGroupImages(images, filterType) {
    let formatStr;
    switch (filterType) {
      case 'day': formatStr = 'YYYYMMDD';
        break;
      case 'month': formatStr = 'YYYYMM';
        break;
      case 'year': formatStr = 'YYYY';
        break;
      default: formatStr = 'YYYYMMDD';
        break;
    }
    return _.groupBy(images, (image) => moment(image.shootAt).format(formatStr));
  }

  render() {
    const { isEditing, images } = this.props;
    const { isAllSelect, layoutType, filterType, allImages, allGroupImages } = this.state;
    const isDefaultLayout = layoutType === 'group';
    return (
      <Wrapper isDefaultLayout={isDefaultLayout}>
        <ToolBar
          isEditing={isEditing}
          isAllSelect={isAllSelect}
          layoutType={layoutType}
          filterType={filterType}
          onSelectAll={this.handleToggleSelectAll}
          onLayoutChange={this.handleLayoutChange}
          onFilterChange={this.handleFilterChange}
        />
        {
          isDefaultLayout
          ? (
            _.map(allGroupImages, (groupImages, groupName) => (
              <ConnectedGroupLayout
                key={groupName}
                isEditing={isEditing}
                groupName={groupName}
                groupImages={groupImages}
                total={images.length}
                filterType={filterType}
                showGallery
              />
              ))
            )
          : (
            <ConnectedGridLayout
              isEditing={isEditing}
              images={allImages}
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
};

const mapStateToProps = (state) => ({
  counter: state.selectCounter.counter,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  enableSelectAll,
  disableSelectAll,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Justified);
