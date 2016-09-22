import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Accounts } from 'meteor/accounts-base';
import i18n from 'meteor/universe:i18n';
// Utils
import utils from '../../utils/utils.js';

// Component
import Recap from '../components/Recap.jsx';

export default class Register extends Component {

  constructor(props) {
    super(props);
    this._handleRegister = this._handleRegister.bind(this);
  }

  _handleRegister(e) {
    e.preventDefault();
    // Find the usr & pwd field via the React ref
    const usr = this.usrInput.value;
    const pwd = this.pwdInput.value;

    const usrStatus = utils.checkStr(usr);
    if (usrStatus === 1 && pwd.length > 6) {
      Accounts.createUser({
        username: usr,
        password: pwd,
      }, (err) => {
        if (err) {
          console.log(err);
          alert(i18n.__('user.createUser')); // eslint-disable-line no-alert
          alert(i18n.__('image.create')); // eslint-disable-line no-alert
          throw new Meteor.Error('user.createUser', err.message);
        }
        return this.context.router.replace('/');
      });
    } else {
      throw new Meteor.Error('user.createUser', 'Password is illegal, should be reset.');
    }
  }

  render() {
    return (
      <div className="content">
        <Recap
          title="注册"
          detailFir="欢迎注册"
        />
        <div id="register">
          <form className="regsiter-holder">
            <div className="form-group">
              <label htmlFor="usr">账号</label>
              <input
                className="form-control"
                type="text"
                size="10"
                ref={(ref) => { this.usrInput = ref; }}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">密码(必须大于6位)</label>
              <input
                className="form-control"
                type="password"
                size="20"
                ref={(ref) => { this.pwdInput = ref; }}
                required
              />
            </div>
            <div className="form-group text-center">
              <button
                className="btn btn-primary"
                type="submit"
                onClick={this._handleRegister}
              >注册
              </button>
            </div>
          </form>
          <p className="login-footer text-center">已拥有账号?点击
            <Link to="/login">登录</Link>
          </p>
        </div>
      </div>
    );
  }

}

Register.propTypes = {
  history: PropTypes.object.isRequired,
};

// If contextTypes is not defined, then context will be an empty object.
Register.contextTypes = {
  router: PropTypes.object.isRequired,
};
