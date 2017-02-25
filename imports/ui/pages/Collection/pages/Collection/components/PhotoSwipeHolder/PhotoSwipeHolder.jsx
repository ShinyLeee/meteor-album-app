import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { incView } from '/imports/api/images/methods.js';
import { photoSwipeClose } from '/imports/ui/redux/actions/index.js';
import PhotoSwipe from '/imports/ui/components/PhotoSwipe/PhotoSwipe.jsx';

class PhotoSwipeHolder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewedIndexes: [],
    };
    this.handleGallerySlide = this.handleGallerySlide.bind(this);
    this.handleGalleryClose = this.handleGalleryClose.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.open !== nextProps.open) {
      return true;
    }
    return false;
  }

  /**
   * @param {array} indexDiff - [null] or [-1] or [1], show the swipe direction
   * @param {number} curIndex - current Image index
   */
  handleGallerySlide(indexDiff, curIndex) {
    let viewedIndexes;
    if (!this.state.viewedIndexes.length === 0) viewedIndexes = [curIndex];
    else {
      const indexes = [...this.state.viewedIndexes, curIndex];
      viewedIndexes = [...new Set(indexes)];
    }
    this.setState({ viewedIndexes });
  }

  handleGalleryClose() {
    const { items } = this.props;
    const { viewedIndexes } = this.state;
    if (viewedIndexes.length === 0) return;
    const imageIds = viewedIndexes.map((index) => items[index]._id);
    this.setState({ viewedIndexes: [] });
    this.props.photoSwipeClose();
    incView.call({ imageIds });
  }

  render() {
    const { open, items, options } = this.props;
    return (
      <PhotoSwipe
        open={open}
        items={items}
        options={options}
        beforeChange={this.handleGallerySlide}
        onClose={this.handleGalleryClose}
      />
    );
  }
}

PhotoSwipeHolder.displayName = 'PhotoSwipeHolder';

PhotoSwipeHolder.propTypes = {
  // Below Pass from redux
  open: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  options: PropTypes.object,
  photoSwipeClose: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  open: state.photoSwipe.open,
  items: state.photoSwipe.items,
  options: state.photoSwipe.options,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  photoSwipeClose,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PhotoSwipeHolder);
