import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import { connect } from 'react-redux';
import { userLogin } from '../actions/actionTypes.js';

// Components
import Recap from '../components/Recap.jsx';

import displayAlert from '../lib/displayAlert.js';

class Login extends Component {

  constructor(props) {
    super(props);
    this._handleLogin = this._handleLogin.bind(this);
  }

  _handleLogin(e) {
    e.preventDefault();
    // Find the usr & pwd field via the React ref
    const usr = this.usrInput.value;
    const pwd = this.pwdInput.value;

    // 通过调用 connect() 注入:
    const { dispatch } = this.props;

    Meteor.loginWithPassword(usr, pwd, (err) => {
      if (err) {
        let ret = '';
        let reason = err.reason.toLowerCase();
        reason = reason.split(' ');
        for (let i = 0; i < reason.length; i++) {
          ret += reason[i];
        }
        displayAlert('error', `user.login.${ret}`);
        return console.error(err); // TODO LOG
      }
      dispatch(userLogin(Meteor.user()));
      this.context.router.replace('/');
      return displayAlert('success', 'user.login.success');
    });
  }

  render() {
    return (
      <div className="content">
        <Recap
          title="登录"
          detailFir="欢迎使用"
        />
        <div id="login">
          <div className="form-group text-center">
            <a className="btn btn-primary">
              <i className="fa fa-wechat" />
              微信登录
            </a>
          </div>
          <div className="text-center">
            <p>或</p>
          </div>
          <form className="login-holder">
            <div className="form-group">
              <label htmlFor="account">账号</label>
              <input
                className="form-control"
                type="text"
                size="10"
                ref={(ref) => { this.usrInput = ref; }}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">密码</label>
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
                type="button"
                onClick={this._handleLogin}
              >
              立即登录</button>
            </div>
          </form>
          <p className="login-footer text-center">还未拥有账号?点击
            <Link to="/register">注册</Link>
          </p>
        </div>
      </div>
    );
  }

}

Login.propTypes = {
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
};

// If contextTypes is not defined, then context will be an empty object.
Login.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default connect()(Login);
