import { Meteor } from 'meteor/meteor';
import React, { PureComponent, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Images } from '/imports/api/images/image.js';
import { makeCancelable } from '/imports/utils';
import PrimaryNavHeader from '../../components/NavHeader/Primary/Primary.jsx';
import Infinity from '../../components/Infinity/Infinity.jsx';
import Recap from '../../components/Recap/Recap.jsx';
import Loading from '../../components/Loader/Loading.jsx';
import ZoomerHolder from '../../components/ZoomerHolder/ZoomerHolder.jsx';
import ImageList from '../..//components/ImageList/ImageList.jsx';

export default class IndexPage extends PureComponent {
  static propTypes = {
    // Below Pass from Database
    limit: PropTypes.number.isRequired,
    dataIsReady: PropTypes.bool.isRequired,
    initialImages: PropTypes.array.isRequired,
    // Below Pass from Redux
    zoomerOpen: PropTypes.bool.isRequired,
    zoomerImage: PropTypes.object, // zoomerImage only required when zoomerOpen is true
    snackBarOpen: PropTypes.func.isRequired,
    // Below Pass from React-Router
    location: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      images: props.initialImages,
    };
  }

  componentDidMount() {
    const { location } = this.props;
    if (
      location.state !== undefined &&
      location.state.message !== undefined
    ) {
      this.props.snackBarOpen(location.state.message);
    }
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

  _handleLoadImages = () => {
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
    this.loadPromise.promise
    .then(() => {
      this.setState({ isLoading: false });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  _handleRefreshImages = () => {
    // after like or unlike a image, we need to refresh the data
    const trueImages = Images.find(
      { private: false },
      { sort: { createdAt: -1 }, limit: this.state.images.length }
    ).fetch();
    this.setState({ images: trueImages });
  }

  render() {
    const { dataIsReady, zoomerOpen, zoomerImage } = this.props;
    return (
      <div className="container">
        <PrimaryNavHeader location="explore" />
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
                  onInfinityLoad={this._handleLoadImages}
                  offsetToBottom={100}
                >
                  <ImageList
                    images={this.state.images}
                    onLikeOrUnlikeAction={this._handleRefreshImages}
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
