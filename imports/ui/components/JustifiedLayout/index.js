import map from 'lodash/map';
import forEach from 'lodash/forEach';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { enableSelectAll, disableSelectAll } from '/imports/ui/redux/actions';
import ConnectedGroupLayout from './components/GroupLayout';
import ConnectedGridLayout from './components/GridLayout';
import ToolBar from './components/ToolBar';

export class Justified extends PureComponent {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    images: PropTypes.array.isRequired,
    counter: PropTypes.number.isRequired,
    enableSelectAll: PropTypes.func.isRequired,
    disableSelectAll: PropTypes.func.isRequired,
  }

  state = {
    isAllSelect: false,
    layoutType: 'group',
    filterType: 'day',
    allGroupImages: this.generateAllGroupImages(this.props.images),
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
    if (isEditing && counter > 0 && images.length === counter) {
      this.setState({ isAllSelect: true });
    } else {
      this.setState({ isAllSelect: false });
    }
  }

  _handleToggleSelectAll = () => {
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
        const allGroupImages = groupBy(
          images,
          (image) => moment(image.shootAt).format('YYYYMMDD'),
        );
        forEach(allGroupImages, (value, key) => {
          group[key] = value.length;
        });
        this.props.enableSelectAll({
          selectImages: images,
          group,
          counter,
        });
      }
    }
  }

  _handleLayoutChange = (newLayoutType) => {
    const { images } = this.props;
    if (newLayoutType === 'group') {
      const allGroupImages = this.generateAllGroupImages(images, 'day');
      this.setState({
        allGroupImages,
        layoutType: newLayoutType,
        filterType: 'day',
      });
    } else if (newLayoutType === 'grid') {
      this.setState({ layoutType: newLayoutType, filterType: 'latest' });
    }
    this.props.disableSelectAll();
  }

  _handleFilterChange = (newFilterType) => {
    const { images } = this.props;
    if (this.state.layoutType === 'group') {
      const allGroupImages = this.generateAllGroupImages(images, newFilterType);
      this.setState({ filterType: newFilterType, allGroupImages });
    } else if (this.state.layoutType === 'grid') {
      this.setState({ filterType: newFilterType });
    }
  }

  // eslint-disable-next-line class-methods-use-this
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
    return groupBy(images, (image) => moment(image.shootAt).format(formatStr));
  }

  render() {
    const { isEditing, images } = this.props;
    const { isAllSelect, layoutType, filterType, allGroupImages } = this.state;
    return (
      <div>
        <ToolBar
          isEditing={isEditing}
          isAllSelect={isAllSelect}
          layoutType={layoutType}
          filterType={filterType}
          onSelectAll={this._handleToggleSelectAll}
          onLayoutChange={this._handleLayoutChange}
          onFilterChange={this._handleFilterChange}
        />
        {
          layoutType === 'group'
          ? map(allGroupImages, (groupImages, groupName) => (
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
          : (
            <ConnectedGridLayout
              images={images}
              isEditing={isEditing}
              filterType={filterType}
              showGallery
            />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  counter: state.selectCounter.counter,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  enableSelectAll,
  disableSelectAll,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Justified);
