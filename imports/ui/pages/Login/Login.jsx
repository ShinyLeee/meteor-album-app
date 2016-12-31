import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { purple500, grey500 } from 'material-ui/styles/colors';
import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import { snackBarOpen } from '/imports/ui/redux/actions/actionTypes.js';

const styles = {
  logBtn: {
    fontFamily: 'Microsoft Yahei',
    backgroundColor: purple500,
  },
  regBtn: {
    fontFamily: 'Microsoft Yahei',
    backgroundColor: grey500,
  },
  label: {
    color: '#fff',
  },
};

class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    const usr = this.usrInput.input.value;
    const pwd = this.pwdInput.input.value;

    const { dispatch } = this.props;

    this.usrInput.blur();
    this.pwdInput.blur();

    Meteor.loginWithPassword(usr, pwd, (err) => {
      if (err) {
        dispatch(snackBarOpen(err.message));
        throw new Meteor.Error(err);
      }
      browserHistory.push('/');
      dispatch(snackBarOpen('登录成功'));
    });
  }

  render() {
    return (
      <div className="container">
        <NavHeader primary />
        <div className="login">
          <div className="login__logo">Gallery +</div>
          <div className="login__form">
            <TextField
              hintText="用户名或邮箱"
              ref={(ref) => { this.usrInput = ref; }}
              fullWidth
            /><br />
            <TextField
              hintText="密码"
              ref={(ref) => { this.pwdInput = ref; }}
              type="password"
              fullWidth
            /><br />
          </div>
          <div className="login__button">
            <RaisedButton
              label="立即登录"
              labelStyle={styles.label}
              buttonStyle={styles.logBtn}
              onTouchTap={this.handleLogin}
              fullWidth
            />
            <div className="separator">或</div>
            <RaisedButton
              label="创建账号"
              labelStyle={styles.label}
              buttonStyle={styles.regBtn}
              onTouchTap={() => browserHistory.push('/register')}
              fullWidth
            />
          </div>
        </div>
      </div>
    );
  }

}

LoginPage.propTypes = {
  dispatch: PropTypes.func,
};

export default connect()(LoginPage);
