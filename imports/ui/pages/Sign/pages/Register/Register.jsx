import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { checkCode, useCode } from '/imports/api/codes/methods.js';
import PrimaryNavHeader from '/imports/ui/components/NavHeader/Primary/Primary.jsx';
import Loader from '/imports/ui/components/Loader/Loader.jsx';
import signHOC from '../../components/signHOC.js';
import styles from '../../sign.style.js';

class RegisterPage extends Component {
  static propTypes = {
    userLogin: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      processMsg: '',
    };
  }

  _handleRegister = (e) => {
    e.preventDefault();

    const email = this.emailField.input.value;
    const username = this.usrField.input.value;
    const password = this.pwdField.input.value;
    const password2 = this.pwd2Field.input.value;
    const code = this.codeField.input.value;

    if (!email || !username || !password || !password2) {
      this.props.snackBarOpen('请输入必填项');
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

    this.setState({ isProcessing: true, processMsg: '创建账号中' });
    checkCode.callPromise({ codeNo: code })
    .then((isExist) => {
      if (!isExist) {
        throw new Meteor.Error(403, '此邀请码不存在或已被使用');
      }
      return Meteor.callPromise('Accounts.createUser', { username, email, password });
    })
    .then(() => useCode.callPromise({ codeNo: code }))
    .then(() => {
      const loginWithPassword = Meteor.wrapPromise(Meteor.loginWithPassword);
      return loginWithPassword(username, password);
    })
    .then(() => {
      const userObj = Meteor.user();
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.userLogin(userObj);
      this.props.history.replace('/');
      this.props.snackBarOpen('注册成功');
    })
    .catch((err) => {
      console.log(err);
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(`注册失败 ${err.reason}`);
    });
  }

  _handleLoaderTimeout = () => {
    this.setState({ isProcessing: false, processMsg: '' });
    this.props.snackBarOpen('发送邮件失败');
  }

  render() {
    return (
      <div className="container">
        <PrimaryNavHeader location="sign" />
        <main className="content">
          <Loader
            open={this.state.isProcessing}
            message={this.state.processMsg}
            onTimeout={this._handleLoaderTimeout}
          />
          <div className="content__register">
            <header className="register__logo">Gallery +</header>
            <section className="register__form">
              <TextField
                hintText="邮箱"
                ref={(ref) => { this.emailField = ref; }}
                fullWidth
              /><br />
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
                type="text"
                fullWidth
              /><br />
            </section>
            <section className="register__button">
              <RaisedButton
                label="注册"
                labelStyle={styles.label}
                buttonStyle={styles.logBtn}
                onTouchTap={this._handleRegister}
                fullWidth
              />
              <div className="separator">或</div>
              <RaisedButton
                label="已有账号?"
                labelStyle={styles.label}
                buttonStyle={styles.regBtn}
                onTouchTap={() => this.props.history.push('/login')}
                fullWidth
              />
            </section>
          </div>
        </main>
      </div>
    );
  }

}

export default signHOC(RegisterPage);
