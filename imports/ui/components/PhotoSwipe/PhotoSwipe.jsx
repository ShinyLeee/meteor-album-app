import React, { Component, PropTypes } from 'react';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default';
import '/node_modules/photoswipe/dist/photoswipe.css';
import '/node_modules/photoswipe/dist/default-skin/default-skin.css';
import events from './events.js';

export default class ReactPhotoSwipe extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
    };
    this.PhotoSwipe = undefined;
  }

  componentDidMount() {
    if (this.state.open) {
      this.initPhotoSwipe();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
      if (!this.state.open) {
        this.initPhotoSwipe(nextProps);
      }
    } else if (this.state.open) {
      this.destroyPhotoSwipe();
    }
  }

  componentWillUnmount() {
    this.destroyPhotoSwipe();
  }

  initPhotoSwipe(props) {
    const { items, options } = props;
    this.PhotoSwipe = new PhotoSwipe(this.container, PhotoSwipeUIDefault, items, options);
    events.forEach((event) => {
      const callback = props[event];
      if (callback || event === 'destroy') {
        this.PhotoSwipe.listen(event, (...args) => {
          if (callback) callback(args);
          if (event === 'destroy') this.destroyPhotoSwipe();
        });
      }
    });
    this.PhotoSwipe.init();
    this.setState({ open: true });
  }

  destroyPhotoSwipe() {
    if (!this.PhotoSwipe) return;
    this.PhotoSwipe.close();
    this.setState({ open: false });
  }

  render() {
    return (
      <div
        className="pswp"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
        ref={(node) => { this.container = node; }}
      >
        <div className="pswp__bg" />
        <div className="pswp__scroll-wrap">
          <div className="pswp__container">
            <div className="pswp__item" />
            <div className="pswp__item" />
            <div className="pswp__item" />
          </div>
          <div className="pswp__ui pswp__ui--hidden">
            <div className="pswp__top-bar">
              <div className="pswp__counter" />
              <button className="pswp__button pswp__button--close" title="Close (Esc)" />
              <button className="pswp__button pswp__button--share" title="Share" />
              <button className="pswp__button pswp__button--fs" title="Toggle fullscreen" />
              <button className="pswp__button pswp__button--zoom" title="Zoom in/out" />
              <div className="pswp__preloader">
                <div className="pswp__preloader__icn">
                  <div className="pswp__preloader__cut">
                    <div className="pswp__preloader__donut" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
              <div className="pswp__share-tooltip" />
            </div>
            <button className="pswp__button pswp__button--arrow--left" title="Previous (arrow left)" />
            <button className="pswp__button pswp__button--arrow--right" title="Next (arrow right)" />
            <div className="pswp__caption">
              <div className="pswp__caption__center" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactPhotoSwipe.displayName = 'ReactPhotoSwipe';

ReactPhotoSwipe.defaultProps = {
  open: false,
  items: [],
  options: {},
};

ReactPhotoSwipe.propTypes = {
  open: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  // more details see http://photoswipe.com/documentation/options.html
  options: PropTypes.shape({
    index: PropTypes.number,
    getThumbBoundsFn: PropTypes.func,
    showHideOpacity: PropTypes.bool,
    showAnimationDuration: PropTypes.number,
    hideAnimationDuration: PropTypes.number,
    bgOpacity: PropTypes.number,
    spacing: PropTypes.number,
    allowPanToNext: PropTypes.bool,
    maxSpreadZoom: PropTypes.number,
    getDoubleTapZoom: PropTypes.func,
    loop: PropTypes.bool,
    pinchToClose: PropTypes.bool,
    closeOnScroll: PropTypes.bool,
    closeOnVerticalDrag: PropTypes.bool,
    mouseUsed: PropTypes.bool,
    escKey: PropTypes.bool,
    arrowKeys: PropTypes.bool,
    history: PropTypes.bool,
    galleryUID: PropTypes.number,
    galleryPIDs: PropTypes.bool,
    errorMsg: PropTypes.string,
    preload: PropTypes.array,
    mainClass: PropTypes.string,
    getNumItemsFn: PropTypes.func,
    focus: PropTypes.bool,
    isClickableElement: PropTypes.func,
    modal: PropTypes.bool,
  }),
};
