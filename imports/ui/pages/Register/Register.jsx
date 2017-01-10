import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { purple500, grey500 } from 'material-ui/styles/colors';
import { createUser } from '/imports/api/users/methods.js';
import { checkCode, useCode } from '/imports/api/codes/methods.js';

import ConnectedNavHeader from '../../containers/NavHeaderContainer.jsx';

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

export default class RegisterPage extends Component {

  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
  }

  handleRegister(e) {
    e.preventDefault();

    const username = this.usrField.input.value;
    const password = this.pwdField.input.value;
    const password2 = this.pwd2Field.input.value;
    const code = parseInt(this.codeField.input.value, 10);

    if (!password || !password2) {
      this.props.snackBarOpen('请输入密码');
      return;
    }
    if (password !== password2) {
      this.props.snackBarOpen('请确认两次密码输入是否正确');
      return;
    }
    if (password.length < 6) {
      this.props.snackBarOpen('密码长度必须大于6位');
      return;
    }
    checkCode.callPromise({ codeNo: code })
    .then((isExist) => {
      if (!isExist) {
        throw new Meteor.Error(403, '此邀请码不存在或已被使用');
      }
      return createUser.callPromise({ username, password });
    })
    .then(() => useCode.callPromise({ codeNo: code }))
    .then(() => {
      Meteor.loginWithPassword(username, password);
      browserHistory.replace('/');
      this.props.snackBarOpen('注册成功');
    })
    .catch((err) => {
      this.props.snackBarOpen(err.reason);
      throw new Meteor.Error(err);
    });
  }

  render() {
    return (
      <div className="container">
        <ConnectedNavHeader primary />
        <div className="register">
          <div className="register__logo">Gallery +</div>
          <div className="register__form">
            <TextField
              hintText="用户名"
              ref={(ref) => { this.usrField = ref; }}
              fullWidth
            /><br />
            <TextField
              hintText="密码"
              ref={(ref) => { this.pwdField = ref; }}
              type="password"
              fullWidth
            /><br />
            <TextField
              hintText="确认密码"
              ref={(ref) => { this.pwd2Field = ref; }}
              type="password"
              fullWidth
            /><br />
            <TextField
              hintText="邀请码"
              ref={(ref) => { this.codeField = ref; }}
              type="number"
              fullWidth
            /><br />
          </div>
          <div className="register__button">
            <RaisedButton
              label="注册"
              labelStyle={styles.label}
              buttonStyle={styles.logBtn}
              onTouchTap={this.handleRegister}
              fullWidth
            />
            <div className="separator">或</div>
            <RaisedButton
              label="已有账号?"
              labelStyle={styles.label}
              buttonStyle={styles.regBtn}
              onTouchTap={() => browserHistory.push('/login')}
              fullWidth
            />
          </div>
        </div>
      </div>
    );
  }

}

RegisterPage.propTypes = {
  snackBarOpen: PropTypes.func.isRequired,
};
