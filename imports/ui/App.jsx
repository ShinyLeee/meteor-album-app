import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';

import { storeUptoken, clearUptoken } from './redux/actions/index.js';
import SnackBar from './components/SnackBar/SnackBar.jsx';
import NavHeader from './components/NavHeader/NavHeader.jsx';
import ConnectedUploader from './components/Uploader/Uploader.jsx';

const styles = {
  indeterminateProgress: {
    position: 'fixed',
    backgroundColor: 'none',
    zIndex: 99,
  },
};

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
    const { userIsReady, User } = this.props;
    if (!userIsReady) {
      return (
        <div className="container">
          <NavHeader loading />
          <div className="content">
            <LinearProgress style={styles.indeterminateProgress} mode="indeterminate" />
          </div>
        </div>
      );
    }
    return (
      <div>
        <SnackBar />
        {
          // React validates propTypes on elements when those elements are created,
          // rather than when they're about to render.
          // This means that any prop types with isRequired will fail validation
          // when those props are supplied via this approach. In these cases,
          // you should not specify isRequired for those props.
          React.cloneElement(this.props.children, { User })
        }
        <ConnectedUploader User={User} multiple />
      </div>
    );
  }

}

App.propTypes = {
  User: PropTypes.object,
  userIsReady: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  // Below is Pass From redux
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
