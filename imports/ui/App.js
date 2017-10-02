import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { MuiThemeProvider } from 'material-ui/styles';
import '/node_modules/quill/dist/quill.snow.css';
import './components/Quill/Quill.css';
import theme from './theme';
import RootLayout from './layouts/RootLayout';
import ConnectedSnackBar from './components/SnackBar';
import ConnectedUploader from './components/Uploader';
import { userLogin } from './redux/actions';
import reducers from './redux/reducers';
import Routes from './Routes';

const Store = createStore(reducers);

export class App extends Component {
  static propTypes = {
    User: PropTypes.object,
    userIsReady: PropTypes.bool.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.User !== nextProps.User ||
    this.props.userIsReady !== nextProps.userIsReady;
  }

  render() {
    const {
      User,
      userIsReady,
    } = this.props;

    return (
      <Provider store={Store}>
        <MuiThemeProvider theme={theme}>
          <Router>
            {
              userIsReady
              ? (
                <div>
                  <ConnectedSnackBar />

                  <Routes />

                  { User && <ConnectedUploader multiple /> }
                </div>
              )
              : <RootLayout dataIsReady={false} />
            }
          </Router>
        </MuiThemeProvider>
      </Provider>
    );
  }

}

export default createContainer(() => {
  let userIsReady = true;
  const User = Meteor.user();
  if (typeof User === 'undefined' || User) {
    userIsReady = !!User;
  }
  const state = Store.getState();
  if (!state.User && User) {
    Store.dispatch(userLogin(User));
  }
  return {
    User,
    userIsReady,
  };
}, App);
