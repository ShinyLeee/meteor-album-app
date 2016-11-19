import { Accounts } from 'meteor/accounts-base';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { purple500, grey500 } from 'material-ui/styles/colors';
import utils from '/imports/utils/utils.js';

import NavHeader from '../components/NavHeader.jsx';
import { snackBarOpen } from '../actions/actionTypes.js';

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

class Register extends Component {

  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
  }

  handleRegister() {
    const { dispatch } = this.props;

    const email = this.emailField.input.value;
    const password = this.pwdField.input.value;
    const password2 = this.pwd2Field.input.value;

    if (!utils.validateEmail(email)) {
      dispatch(snackBarOpen('邮箱格式不正确'));
      return false;
    }
    if (!password || !password2) {
      dispatch(snackBarOpen('请输入密码'));
      return false;
    }
    if (password !== password2) {
      dispatch(snackBarOpen('请确认两次密码输入是否正确'));
      return false;
    }
    if (password.length < 6) {
      dispatch(snackBarOpen('密码长度必须大于6位'));
      return false;
    }
    Accounts.createUser({
      password,
      email,
    }, (err) => {
      if (err) {
        dispatch(snackBarOpen(err.message));
        console.error(err); // eslint-disable-line no-console
        return false;
      }
      this.context.router.replace('/');
      dispatch(snackBarOpen('您已成功注册, 邮箱验证后可正式享受服务'));
      return true;
    });
    return true;
  }

  render() {
    return (
      <div className="container">
        <NavHeader primary />
        <div className="default-page">
          <div className="logo-zone">Gallery +</div>
          <div className="input-zone">
            <TextField
              hintText="邮箱"
              ref={(ref) => { this.emailField = ref; }}
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
          </div>
          <div className="button-zone">
            <RaisedButton
              label="暂不开放注册"
              labelStyle={styles.label}
              buttonStyle={styles.logBtn}
              onTouchTap={this.handleRegister}
              fullWidth
              disabled
            />
            <div className="separator">或</div>
            <RaisedButton
              label="已有账号?"
              labelStyle={styles.label}
              buttonStyle={styles.regBtn}
              containerElement={<Link to={'/login'} />}
              fullWidth
            />
          </div>
        </div>
      </div>
    );
  }

}

Register.propTypes = {
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
};

Register.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default connect()(Register);
