import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { incView } from '/imports/api/images/methods';
import { photoSwipeClose } from '/imports/ui/redux/actions';
import Portal from '/imports/ui/components/Portal';
import PhotoSwipe from '/imports/ui/components/PhotoSwipe';

class PhotoSwipeHolder extends PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    options: PropTypes.object,
    photoSwipeClose: PropTypes.func.isRequired,
  }

  state = {
    viewedIndexes: [],
  }

  /**
   * @param {array} indexDiff - [null] or [-1] or [1], show the swipe direction
   * @param {number} curIndex - current Image index
   */
  _handleGallerySlide = (indexDiff, curIndex) => {
    let viewedIndexes;
    if (!this.state.viewedIndexes.length === 0) {
      viewedIndexes = [curIndex];
    } else {
      const indexes = [...this.state.viewedIndexes, curIndex];
      viewedIndexes = [...new Set(indexes)];
    }
    this.setState({ viewedIndexes });
  }

  _handleGalleryClose = () => {
    const { items } = this.props;
    const { viewedIndexes } = this.state;
    if (viewedIndexes.length === 0) {
      return;
    }
    const imageIds = viewedIndexes.map((index) => items[index]._id);
    this.setState({ viewedIndexes: [] });
    this.props.photoSwipeClose();
    incView.call({ imageIds });
  }

  render() {
    const { open, items, options } = this.props;
    return (
      <Portal name="PhotoSwipe">
        <PhotoSwipe
          open={open}
          items={items}
          options={options}
          beforeChange={this._handleGallerySlide}
          onClose={this._handleGalleryClose}
        />
      </Portal>
    );
  }
}

const mapStateToProps = ({ portals }) => ({
  open: portals.photoSwipe.open,
  items: portals.photoSwipe.items,
  options: portals.photoSwipe.ops,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  photoSwipeClose,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PhotoSwipeHolder);
