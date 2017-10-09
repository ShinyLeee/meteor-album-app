import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { MuiThemeProvider } from 'material-ui/styles';
import Modal from '/imports/ui/components/Modal';
import SnackBar from '/imports/ui/components/SnackBar';
import Uploader from '/imports/ui/components/Uploader';
import theme from './theme';
import Store from './redux/store';
import { appInit, userLogin } from './redux/actions';
import { InternalError } from './pages/Error';
import Routes from './Routes';

export class App extends Component {
  static propTypes = {
    User: PropTypes.object,
  }

  state = {
    error: false,
  }

  componentDidCatch() {
    this.setState({ error: true });
  }

  render() {
    const { User } = this.props;
    return (
      <Provider store={Store}>
        <MuiThemeProvider theme={theme}>
          <Router>
            {
              !this.state.error
              ? (
                <div className="router">
                  <Routes />

                  {/* Portals */}
                  <Modal />
                  <SnackBar />
                  { User && <Uploader multiple />}
                </div>
              )
              : <InternalError location={{}} />
            }
          </Router>
        </MuiThemeProvider>
      </Provider>
    );
  }

}

export default withTracker(() => {
  const User = Meteor.user();

  const state = Store.getState();
  if (!state.sessions.User && User) {
    if (state.sessions.initializing) {
      Store.dispatch(appInit());
    }
    Store.dispatch(userLogin(User));
  }
  return {
    User,
  };
})(App);
