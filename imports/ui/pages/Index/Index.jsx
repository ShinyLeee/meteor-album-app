import { Meteor } from 'meteor/meteor';
import React, { PureComponent, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Images } from '/imports/api/images/image.js';
import { makeCancelable } from '/imports/utils/utils.js';

import NavHeader from '../../components/NavHeader/NavHeader.jsx';
import Infinity from '../../components/Infinity/Infinity.jsx';
import Recap from '../../components/Recap/Recap.jsx';
import Loading from '../../components/Loader/Loading.jsx';
import ZoomerHolder from '../../components/ZoomerHolder/ZoomerHolder.jsx';
import ImageList from '../..//components/ImageList/ImageList.jsx';

export default class IndexPage extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      location: 'explore',
      isLoading: false,
      images: props.initialImages,
    };
    this.handleLoadImages = this.handleLoadImages.bind(this);
    this.handleRefreshImages = this.handleRefreshImages.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // When dataIsReady return true start setState
    if (!this.props.dataIsReady && nextProps.dataIsReady) {
      this.setState({
        images: nextProps.initialImages,
      });
    }
  }

  componentWillUnmount() {
    // If lifecyle is in componentWillUnmount,
    // But if promise still in progress then Cancel the promise
    if (this.loadPromise) {
      this.loadPromise.cancel();
    }
  }

  handleLoadImages() {
    const { limit } = this.props;
    const { images } = this.state;
    const skip = images.length;
    this.setState({ isLoading: true });
    const loadPromise = new Promise((resolve) => {
      Meteor.defer(() => {
        const newImages = Images.find(
          { private: false },
          { sort: { createdAt: -1 }, limit, skip }
        ).fetch();
        const curImages = [...images, ...newImages];
        this.setState({ images: curImages }, () => resolve());
      });
    });

    this.loadPromise = makeCancelable(loadPromise);
    this.loadPromise
      .promise
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch((err) => {
        throw new Meteor.Error(err);
      });
  }

  handleRefreshImages() {
    // after like or unlike a image, we need to refresh the data
    const trueImages = Images.find(
      { private: false },
      { sort: { createdAt: -1 }, limit: this.state.images.length }
    ).fetch();
    this.setState({ images: trueImages });
  }

  render() {
    const { User, dataIsReady, zoomerOpen, zoomerImage } = this.props;
    return (
      <div className="container">
        <NavHeader
          User={User}
          location={this.state.location}
          primary
        />
        <main className="content">
          { !dataIsReady && (<Loading />) }
          <Recap
            title="Gallery"
            detailFir="Vivian的私人相册"
            detailSec="Created By Shiny Lee"
            showIcon
          />
          {
            dataIsReady && (
              <div className="content__index">
                <ReactCSSTransitionGroup
                  transitionName="zoomer"
                  transitionEnterTimeout={300}
                  transitionLeaveTimeout={300}
                >
                  { zoomerOpen && <ZoomerHolder key={zoomerImage._id} image={zoomerImage} /> }
                </ReactCSSTransitionGroup>
                <Infinity
                  isLoading={this.state.isLoading}
                  onInfinityLoad={this.handleLoadImages}
                  offsetToBottom={100}
                >
                  <ImageList
                    User={User}
                    images={this.state.images}
                    onLikeOrUnlikeAction={this.handleRefreshImages}
                  />
                </Infinity>
              </div>
            )
          }
        </main>
      </div>
    );
  }

}

IndexPage.displayName = 'IndexPage';

IndexPage.propTypes = {
  User: PropTypes.object, // only required in only Owner page, etc.. Setting/Recycle/Note
  // Below Pass from Database
  limit: PropTypes.number.isRequired,
  dataIsReady: PropTypes.bool.isRequired,
  initialImages: PropTypes.array.isRequired,
  // Below Pass from Redux
  zoomerOpen: PropTypes.bool.isRequired,
  zoomerImage: PropTypes.object, // zoomerImage only required when zoomerOpen is true
};
