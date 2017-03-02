import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import '/node_modules/quill/dist/quill.snow.css';
import './components/Quill/Quill.css';
import ConnectedSnackBar from './components/SnackBar/SnackBar.jsx';
import Loading from './components/Loader/Loading.jsx';
import LoadingNavHeader from './components/NavHeader/Loading/Loading.jsx';
import ConnectedUploader from './components/Uploader/index.js';

export class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      transitionName: 'fastIn',
    };
  }

  componentWillReceiveProps(nextProps) {
    const prevIndex = this.props.children.props.route.index;
    const nextIndex = nextProps.children.props.route.index;

    let transitionName;
    const indexGap = nextIndex - prevIndex;
    if (indexGap > 0) transitionName = 'slideToLeft';
    else transitionName = indexGap < 0 ? 'slideToRight' : 'fastIn';
    this.setState({ transitionName });
  }

  render() {
    const {
      User,
      userIsReady,
      location,
      children,
    } = this.props;

    if (!userIsReady) {
      return (
        <div className="container">
          <LoadingNavHeader />
          <div className="content">
            <Loading />
          </div>
        </div>
      );
    }

    return (
      <div>
        <ConnectedSnackBar />
        <ReactCSSTransitionGroup
          transitionName={this.state.transitionName}
          transitionEnterTimeout={this.state.transitionName === 'fastIn' ? 200 : 375}
          transitionLeaveTimeout={this.state.transitionName === 'fastIn' ? 200 : 375}
        >
          {
            // this.cloneChildren()
            // React validates propTypes on elements when those elements are created,
            // rather than when they're about to render.
            // This means that any prop types with isRequired will fail validation
            // when those props are supplied via this approach. In these cases,
            // you should not specify isRequired for those props.
            React.cloneElement(
              children,
              { key: location.pathname, User }
            )
          }
        </ReactCSSTransitionGroup>
        {/* Uploader in there because we can uploading file even if route change */}
        { User && <ConnectedUploader User={User} multiple /> }
      </div>
    );
  }

}

App.displayName = 'RootApp';

App.propTypes = {
  User: PropTypes.object,
  userIsReady: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

export default createContainer(() => {
  let userIsReady = true;
  const User = Meteor.user();
  if (typeof User === 'undefined' || User) userIsReady = !!User;
  return {
    User,
    userIsReady,
  };
}, App);
