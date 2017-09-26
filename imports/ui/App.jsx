import React, { Component, PropTypes } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import '/node_modules/quill/dist/quill.snow.css';
import './components/Quill/Quill.css';
import ConnectedSnackBar from './components/SnackBar/SnackBar.jsx';
import Loading from './components/Loader/Loading.jsx';
import LoadingNavHeader from './components/NavHeader/Loading/Loading.jsx';
import ConnectedUploader from './components/Uploader/index.js';
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
        <MuiThemeProvider>
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
              : (
                <div className="container">
                  <LoadingNavHeader />
                  <div className="content">
                    <Loading />
                  </div>
                </div>
              )
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
  if (User) {
    Store.dispatch(userLogin(User));
  }
  return {
    User,
    userIsReady,
  };
}, App);
