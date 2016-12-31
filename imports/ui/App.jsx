import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import CircularProgress from 'material-ui/CircularProgress';
import { storeUptoken, clearUptoken } from '/imports/ui/redux/actions/actionTypes.js';
import SnackBar from './components/SnackBar/SnackBar.jsx';
import NavHeader from './components/NavHeader/NavHeader.jsx';
import Uploader from './components/Uploader/Uploader.jsx';

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
      Meteor.call('Qiniu.getUptoken', (err, res) => {
        if (err) {
          throw new Meteor.Error(err);
        }
        console.log('%c Meteor finish getUptoken', 'color: blue'); // eslint-disable-line no-console
        dispatch(storeUptoken(res.uptoken));
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { User, dispatch } = this.props;
    if (!User && nextProps.User) {
      Meteor.call('Qiniu.getUptoken', (err, res) => {
        if (err) {
          throw new Meteor.Error(err);
        }
        console.log('%c Meteor finish getUptoken', 'color: blue'); // eslint-disable-line no-console
        dispatch(storeUptoken(res.uptoken));
      });
    }
    if (User && !nextProps.User) {
      dispatch(clearUptoken());
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
