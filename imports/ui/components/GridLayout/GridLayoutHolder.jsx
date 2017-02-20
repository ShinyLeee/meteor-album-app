import { Meteor } from 'meteor/meteor';
import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { photoSwipeOpen } from '/imports/ui/redux/actions/index.js';
import GridLayout from '../GridLayout/GridLayout.jsx';
import ConnectedSelectableImageHolder from '../SelectableImage/SelectableImageHolder.jsx';

export class GridLayoutHolder extends PureComponent {

  constructor(props) {
    super(props);

    const { domain, clientWidth, devicePixelRatio, images } = props;

    this.state = {
      isGroupSelect: false,
      pswpItems: images.map((image) => {
        const realDimension = Math.round((clientWidth / 3) * devicePixelRatio);
        const url = `${domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
        // generate based on Qiniu imageView2 mode 3 API
        // more details see https://developer.qiniu.com/dora/api/basic-processing-images-imageview2
        const minWidth = Math.round(clientWidth * devicePixelRatio);
        const minHeight = Math.round((image.dimension[1] / image.dimension[0]) * minWidth);
        return ({
          msrc: `${url}?imageView2/1/w/${realDimension}`,
          src: `${url}?imageView2/3/w/${minWidth}`,
          w: minWidth,
          h: minHeight,
        });
      }),
    };
  }

  render() {
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
              ref={(node) => { this[`thumbnail${i}`] = node; }}
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
  }
}

GridLayoutHolder.displayName = 'GridLayoutHolder';

GridLayoutHolder.defaultProps = {
  domain: Meteor.settings.public.imageDomain,
  clientWidth: document.body.clientWidth,
  devicePixelRatio: window.devicePixelRatio,
  isEditing: false,
};

GridLayoutHolder.propTypes = {
  domain: PropTypes.string.isRequired,
  clientWidth: PropTypes.number.isRequired,
  devicePixelRatio: PropTypes.number.isRequired,
  isEditing: PropTypes.bool.isRequired,
  images: PropTypes.array.isRequired,
  // Below Pass From Redux
  photoSwipeOpen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({
  photoSwipeOpen,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GridLayoutHolder);
