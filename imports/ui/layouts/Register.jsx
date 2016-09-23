// import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

// Components
import Recap from '../components/Recap.jsx';

// Utils or Libs
import utils from '../../utils/utils.js';
import { displayAlert } from '../lib/displayAlert.js';

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
    const pwd2 = this.pwd2Input.value;

    const usrStatus = utils.checkStr(usr);
    if (usrStatus === 1) {
      if (!pwd || !pwd2) {
        displayAlert('error', 'user.createUser.pwdError.emptyError');
        return false;
      }
      if (pwd !== pwd2) {
        displayAlert('error', 'user.createUser.pwdError.notEqualError');
        return false;
      }
      if (pwd.length < 6) {
        displayAlert('error', 'user.createUser.pwdError.lengthError');
        return false;
      }
      Accounts.createUser({
        username: usr,
        password: pwd,
      }, (err) => {
        if (err) {
          console.log(err); // TODO LOG
          displayAlert('error', 'user.createUser.unexpectedError');
          return false;
        }
        this.context.router.replace('/');
        displayAlert('success', 'user.login.success');
        return true; // TODO LOG
      });
    } else {
      displayAlert('error', `user.createUser.usrError.${usrStatus}`);
      return false;
    }
    return true;
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
            <div className="form-group">
              <label htmlFor="password">密码确认</label>
              <input
                className="form-control"
                type="password"
                size="20"
                ref={(ref) => { this.pwd2Input = ref; }}
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
