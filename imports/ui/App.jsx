import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import CircularProgress from 'material-ui/CircularProgress';
import SnackBar from './components/SnackBar.jsx';
import NavHeader from './components/NavHeader.jsx';
import Uploader from './components/Uploader.jsx';

import { storeUptoken } from './actions/actionTypes.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      location: 'index',
    });
  }

  componentDidMount() {
    const { User, dispatch } = this.props;
    if (User) {
      Meteor.call('qiniu.getUptoken', (err, res) => {
        if (err) {
          throw new Meteor.Error(err);
        }
        dispatch(storeUptoken(res.uptoken));
      });
    }
  }

  render() {
    const { userIsReady, User } = this.props;
    if (!userIsReady) {
      return (
        <div className="container">
          <NavHeader loading />
          <div className="content text-center">
            <CircularProgress style={{ top: '150px' }} />
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
        <Uploader User={User} multiple />
      </div>
    );
  }

}

App.propTypes = {
  User: PropTypes.object,
  userIsReady: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  dispatch: PropTypes.func,
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

export default connect()(MeteorContainer);
