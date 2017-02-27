import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { validateEmail } from '/imports/utils/utils.js';
import PrimaryNavHeader from '/imports/ui/components/NavHeader/Primary/Primary.jsx';
import Loader from '/imports/ui/components/Loader/Loader.jsx';
import signHOC from '../../components/signHOC.js';
import styles from '../../sign.style.js';

class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      processMsg: '',
      resetDialog: false,
      email: '',
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSentResetEmail = this.handleSentResetEmail.bind(this);
    this.handleLoaderTimeout = this.handleLoaderTimeout.bind(this);
  }

  handleLogin() {
    const usr = this.usrInput.input.value;
    const pwd = this.pwdInput.input.value;

    this.setState({ isProcessing: true, processMsg: '登陆中...' });

    this.usrInput.blur();
    this.pwdInput.blur();

    const loginWithPassword = Meteor.wrapPromise(Meteor.loginWithPassword);

    loginWithPassword(usr, pwd)
    .then(() => {
      this.setState({ isProcessing: false, processMsg: '' });
      browserHistory.replace('/');
      this.props.snackBarOpen('登陆成功');
    })
    .catch((err) => {
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(err.reason || '登录失败');
      console.log(err); // eslint-disable-line no-console
      throw new Meteor.Error(err);
    });
  }

  handleSentResetEmail() {
    const { email } = this.state;

    if (!validateEmail(email)) {
      this.props.snackBarOpen('请输入正确的邮箱地址');
      return;
    }

    this.setState({ isProcessing: true, processMsg: '发送邮件中' });

    const forgotPassword = Meteor.wrapPromise(Accounts.forgotPassword);

    forgotPassword({ email })
    .then(() => {
      this.setState({ isProcessing: false, processMsg: '', resetDialog: false, email: '' });
      this.props.snackBarOpen('发送重置密码邮件成功');
    })
    .catch((err) => {
      this.setState({ isProcessing: false, processMsg: '', resetDialog: false, email: '' });
      this.props.snackBarOpen(err.reason || '发送重置密码邮件失败');
      console.log(err); // eslint-disable-line no-console
      throw new Meteor.Error(err);
    });
  }

  handleLoaderTimeout() {
    this.setState({ isProcessing: false, processMsg: '' });
    this.props.snackBarOpen('发送邮件失败');
  }

  render() {
    return (
      <div className="container">
        <PrimaryNavHeader />
        <main className="content">
          <Loader
            open={this.state.isProcessing}
            message={this.state.processMsg}
            onTimeout={this.handleLoaderTimeout}
          />
          <div className="content__login">
            <header className="login__logo">Gallery +</header>
            <section className="login__form">
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
            </section>
            <section className="login__button">
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
            </section>
            <footer
              className="login__footer"
              onTouchTap={() => this.setState({ resetDialog: true })}
            >忘记密码?
            </footer>
          </div>
          <Dialog
            title="重置密码"
            titleStyle={{ border: 'none' }}
            actions={[
              <FlatButton
                label="取消"
                onTouchTap={() => this.setState({ resetDialog: false })}
                disabled={this.state.isProcessing}
                primary
              />,
              <FlatButton
                label="确认发送"
                onTouchTap={this.handleSentResetEmail}
                disabled={this.state.isProcessing}
                primary
              />,
            ]}
            actionsContainerStyle={{ border: 'none' }}
            open={this.state.resetDialog}
            modal
          >
            {
              this.state.isProcessing
              ? (
                <div style={{ textAlign: 'center' }}>
                  <CircularProgress
                    color="#3F51B5"
                    size={30}
                    thickness={2.5}
                    style={{ verticalAlign: 'bottom' }}
                  />
                  <span style={{ marginLeft: '24px' }}>发送邮件中...</span>
                </div>
              )
              : (
                <TextField
                  name="email"
                  hintText="邮箱地址"
                  value={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                  fullWidth
                />
              )
            }
          </Dialog>
        </main>
      </div>
    );
  }

}

LoginPage.displayName = 'LoginPage';

LoginPage.propTypes = {
  snackBarOpen: PropTypes.func.isRequired,
};

export default signHOC(LoginPage);
