import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import Recap from '../partial/Recap.jsx';

export default class Login extends Component {

  constructor(props) {
    super(props);
    this._handleLogin = this._handleLogin.bind(this);
  }

  _handleLogin(e) {
    e.preventDefault();
    // Find the usr & pwd field via the React ref
    const usr = this.usrInput.value;
    const pwd = this.pwdInput.value;

    Meteor.loginWithPassword(usr, pwd, (err) => {
      if (err) {
        throw new Meteor.Error('user.login', err.message);
      }
      return this.context.router.replace('/');
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
};

// If contextTypes is not defined, then context will be an empty object.
Login.contextTypes = {
  router: PropTypes.object.isRequired,
};
