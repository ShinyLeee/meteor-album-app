import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router, matchPath } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Modal from '/imports/ui/components/Modal';
import SnackBar from '/imports/ui/components/SnackBar';
import Uploader from '/imports/ui/components/Uploader';
import { PageLoader } from '/imports/ui/components/Loader';
import { userLogin } from '/imports/ui/redux/actions';
import Routes from './Routes';

class NavigatorLayout extends PureComponent {
  static propTypes = {
    appIsReady: PropTypes.bool.isRequired,
    User: PropTypes.object,
  }

  render() {
    const { appIsReady, User } = this.props;
    return (
      <div className="router">
        {
          appIsReady
          ? <Router><Routes /></Router>
          : <PageLoader />
        }

        {/* Portals */}
        <Modal />
        <SnackBar />
        { User && <Uploader multiple /> }
      </div>
    );
  }
}

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  userLogin,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTracker((props) => {
    const { User: gUser } = props;
    const User = Meteor.user();
    if (!gUser && User) {
      props.userLogin(User);
    }

    let appIsReady = !!User;
    const { pathname } = window.location;

    const userMatch = matchPath(pathname, '/user/:username');

    const collMatch = matchPath(pathname, '/user/:username/collection/:cname');

    if (userMatch !== null) {
      appIsReady = appIsReady && Meteor.subscribe('Users.all').ready();
    }
    if (collMatch !== null) {
      const username = userMatch.params && userMatch.params.username;
      appIsReady = appIsReady && Meteor.subscribe('Collections.inUser', username).ready();
    }

    return {
      appIsReady,
      User,
    };
  }),
)(NavigatorLayout);
