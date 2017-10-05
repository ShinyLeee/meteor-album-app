import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Dialog from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import purple from 'material-ui/colors/purple';
import grey from 'material-ui/colors/grey';
import { validateEmail } from '/imports/utils';
import { userLogin, snackBarOpen } from '/imports/ui/redux/actions';
import withRedirect from '/imports/ui/hocs/withRedirect';
import RootLayout from '/imports/ui/layouts/RootLayout';
import { PrimaryNavHeader } from '/imports/ui/components/NavHeader';
import { CircleLoader } from '/imports/ui/components/Loader';

// TODO add Recaptch in this Login page component
class LoginPage extends Component {
  static propTypes = {
    userLogin: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  state = {
    isProcessing: false,
    processMsg: '',
    resetDialog: false,
    email: '',
    account: '',
    password: '',
  }

  _handleChange(key, value) {
    this.setState({
      [key]: value,
    });
  }

  _handleLogin = () => {
    const { account, password } = this.state;

    this.setState({
      account: '',
      password: '',
      isProcessing: true,
      processMsg: '登陆中...',
    });

    const loginWithPassword = Meteor.wrapPromise(Meteor.loginWithPassword);

    loginWithPassword(account, password)
    .then(() => {
      const userObj = Meteor.user();
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.userLogin(userObj);
      this.props.history.replace('/');
      this.props.snackBarOpen('登陆成功');
    })
    .catch((err) => {
      console.log(err);
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(`登录失败 ${err.reason}`);
    });
  }

  _handleSentResetEmail = () => {
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
      console.log(err);
      this.setState({ isProcessing: false, processMsg: '', resetDialog: false, email: '' });
      this.props.snackBarOpen(`发送重置密码邮件失败 ${err.reason}`);
    });
  }

  _handleLoaderTimeout = () => {
    this.setState({ isProcessing: false, processMsg: '' });
    this.props.snackBarOpen('发送邮件失败');
  }

  renderContent() {
    const { classes } = this.props;
    return (
      <div className="content__login">
        <header className="login__logo">Gallery +</header>
        <section className="login__form">
          <Input
            id="account"
            className={classes.input}
            placeholder="体验账号: guest"
            value={this.state.account}
            onChange={(evt) => this._handleChange('account', evt.target.value)}
            disableUnderline
            fullWidth
          />
          <Input
            id="account"
            className={classes.input}
            type="password"
            placeholder="密码: guest001"
            value={this.state.password}
            onChange={(evt) => this._handleChange('password', evt.target.value)}
            disableUnderline
            fullWidth
          />
        </section>
        <section className="login__button">
          <Button
            className={classes.btn__login}
            onClick={this._handleLogin}
            raised
          >立即登录
          </Button>
          <div className="separator">或</div>
          <Button
            className={classes.btn__register}
            onClick={() => this.props.history.push('/register')}
            raised
          >创建账号
          </Button>
        </section>
        <footer
          className="login__footer"
          onClick={() => this.setState({ resetDialog: true })}
        >忘记密码?
        </footer>
      </div>
    );
  }

  render() {
    return (
      <RootLayout
        loading={false}
        Topbar={<PrimaryNavHeader />}
      >
        <CircleLoader
          open={this.state.isProcessing}
          message={this.state.processMsg}
          onTimeout={this._handleLoaderTimeout}
        />
        { this.renderContent() }
        <Dialog
          title="重置密码"
          titleStyle={{ border: 'none' }}
          actions={[
            <Button
              label="取消"
              onClick={() => this.setState({ resetDialog: false })}
              disabled={this.state.isProcessing}
              primary
            />,
            <Button
              label="确认发送"
              onClick={this._handleSentResetEmail}
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
                  style={{ verticalAlign: 'bottom' }}
                  size={30}
                />
                <span style={{ marginLeft: 24 }}>发送邮件中...</span>
              </div>
            )
            : (
              <Input
                name="email"
                hintText="邮箱地址"
                value={this.state.email}
                onChange={(e) => this.setState({ email: e.target.value })}
                fullWidth
              />
            )
          }
        </Dialog>
      </RootLayout>
    );
  }

}

const styles = {
  input: {
    display: 'flex',
    alignItems: 'center',
    height: 48,
    borderBottom: 'solid 1px #e0e0e0',
    padding: '0 6px',
  },

  btn__login: {
    width: '100%',
    color: '#fff',
    backgroundColor: purple[500],
    '&:hover': {
      backgroundColor: purple[400],
    },
  },

  btn__register: {
    width: '100%',
    color: '#fff',
    backgroundColor: grey[500],
    '&:hover': {
      backgroundColor: grey[400],
    },
  },
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  userLogin,
  snackBarOpen,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withStyles(styles),
  withRedirect,
)(LoginPage);
