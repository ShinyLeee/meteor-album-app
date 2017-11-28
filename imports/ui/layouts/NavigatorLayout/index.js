import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Modal from '/imports/ui/components/Modal';
import SnackBar from '/imports/ui/components/SnackBar';
import AppLoader from '/imports/ui/components/Loader/AppLoader';
import { userLogin } from '/imports/ui/redux/actions';
import withLoadable from '/imports/ui/hocs/withLoadable';
import history from '/imports/utils/history';
import ScrollToTop from './ScrollToTop';
import DeviceWatcher from './DeviceWatcher';
import Routes from './Routes';

const AsyncUploader = withLoadable({
  loader: () => import('/imports/ui/components/Uploader'),
  loading: () => null, // do not show loader when loading Uploader
});

class NavigatorLayout extends PureComponent {
  static propTypes = {
    appIsReady: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
  }

  render() {
    const { appIsReady, isLoggedIn } = this.props;
    return (
      <div className="router">
        {
          appIsReady
          ? (
            <ConnectedRouter history={history}>
              <ScrollToTop>
                <Routes />
              </ScrollToTop>
            </ConnectedRouter>
          )
          : <AppLoader />
        }

        <DeviceWatcher />

        {/* Portals */}
        <Modal />
        <SnackBar />
        { appIsReady && isLoggedIn && <AsyncUploader /> }
      </div>
    );
  }
}

const mapStateToProps = ({ sessions }) => ({
  isLoggedIn: sessions.isLoggedIn,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  userLogin,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTracker((props) => {
    const { isLoggedIn } = props;
    const User = Meteor.user();
    if (!isLoggedIn && User) {
      props.userLogin({ inExpiration: true });
    }
    // if User is logging, User is undefined, else User is a Object or null.
    const appIsReady = typeof User === 'object';

    return {
      appIsReady,
      User,
    };
  }),
)(NavigatorLayout);
