import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { storeUptoken, clearUptoken } from './redux/actions/index.js';
import SnackBar from './components/SnackBar/SnackBar.jsx';
import Loading from './components/Loader/Loading.jsx';
import NavHeader from './components/NavHeader/NavHeader.jsx';
import ConnectedUploader from './components/Uploader/index.js';

class App extends Component {

  componentDidMount() {
    if (this.props.User) {
      Meteor.call('Qiniu.getUptoken', (err, res) => {
        if (err) {
          throw new Meteor.Error(err);
        }
        console.log('%c Meteor finish getUptoken', 'color: blue'); // eslint-disable-line no-console
        this.props.storeUptoken(res.uptoken);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.User && nextProps.User) {
      Meteor.call('Qiniu.getUptoken', (err, res) => {
        if (err) {
          throw new Meteor.Error(err);
        }
        console.log('%c Meteor finish getUptoken', 'color: blue'); // eslint-disable-line no-console
        this.props.storeUptoken(res.uptoken);
      });
    }
    if (this.props.User && !nextProps.User) {
      this.props.clearUptoken();
    }
  }

  render() {
    if (!this.props.userIsReady) {
      return (
        <div className="container">
          <NavHeader loading />
          <div className="content">
            <Loading />
          </div>
        </div>
      );
    }
    return (
      <div>
        <SnackBar />
        <ReactCSSTransitionGroup
          transitionName="pageSlider"
          transitionEnterTimeout={600}
          transitionLeaveTimeout={600}
        >
          {
            // this.cloneChildren()
            // React validates propTypes on elements when those elements are created,
            // rather than when they're about to render.
            // This means that any prop types with isRequired will fail validation
            // when those props are supplied via this approach. In these cases,
            // you should not specify isRequired for those props.
            React.cloneElement(
              this.props.children,
              { key: this.props.location.pathname, User: this.props.User }
            )
          }
        </ReactCSSTransitionGroup>
        <ConnectedUploader User={this.props.User} multiple />
      </div>
    );
  }

}

App.displayName = 'RootApp';

App.defaultProps = {
  User: {},
  userIsReady: false,
};

App.propTypes = {
  User: PropTypes.object,
  userIsReady: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  // Below is Pass From Redux
  storeUptoken: PropTypes.func.isRequired,
  clearUptoken: PropTypes.func.isRequired,
};

const MeteorContainer = createContainer(() => {
  let userIsReady;
  const User = Meteor.user();
  if (typeof User === 'undefined' || User) userIsReady = !!User;
  else userIsReady = true;
  return {
    User,
    userIsReady,
  };
}, App);

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({
  storeUptoken,
  clearUptoken,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);
