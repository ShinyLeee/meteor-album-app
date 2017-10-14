import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import purple from 'material-ui/colors/purple';
import grey from 'material-ui/colors/grey';
import { validateEmail } from '/imports/utils';
import { userLogin, modalOpen, modalClose, snackBarOpen } from '/imports/ui/redux/actions';
import withRedirect from '/imports/ui/hocs/withRedirect';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import { PrimaryNavHeader } from '/imports/ui/components/NavHeader';
import { ModalActions } from '/imports/ui/components/Modal';
import Loader from '/imports/ui/components/Loader';

const modalState = {
  email: '',
};

// eslint-disable-next-line react/prop-types
const ModalContent = ({ className, onChange }) => (
  <Input
    className={className}
    name="email"
    placeholder="邮箱地址"
    value={modalState.email}
    onChange={onChange}
    disableUnderline
    fullWidth
  />
);

// TODO add Recaptch in this Login page component
class LoginPage extends Component {
  static propTypes = {
    userLogin: PropTypes.func.isRequired,
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  state = {
    isProcessing: false,
    processMsg: '',
    account: '',
    password: '',
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.state) !== JSON.stringify(nextState);
  }

  _handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      modalState.email = value;
      this._handleOpenModal();
      return;
    }
    this.setState({
      [name]: value,
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
    const { email } = modalState;

    if (!validateEmail(email)) {
      this.props.snackBarOpen('请输入正确的邮箱地址');
      return;
    }

    this.props.modalClose();
    this.setState({ isProcessing: true, processMsg: '发送邮件中' });

    const forgotPassword = Meteor.wrapPromise(Accounts.forgotPassword);

    forgotPassword({ email })
      .then(() => {
        this.setState({ isProcessing: false, processMsg: '' });
        this.props.snackBarOpen('发送成功');
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isProcessing: false, processMsg: '' });
        this.props.snackBarOpen(`发送失败 ${err.reason}`);
      });
  }

  _handleOpenModal = () => {
    const { classes } = this.props;
    this.props.modalOpen({
      title: '重置密码',
      content: (
        <ModalContent
          className={classes.input}
          onChange={this._handleChange}
        />
      ),
      actions: (
        <ModalActions
          primary="确认发送"
          pClick={() => {
            this._handleSentResetEmail();
            modalState.email = '';
          }}
          sClick={() => {
            this.props.modalClose();
            modalState.email = '';
          }}
        />
      ),
      ops: { ignoreBackdropClick: true },
    });
  }

  _handleLoaderTimeout = () => {
    this.setState({ isProcessing: false, processMsg: '' });
    this.props.snackBarOpen('发送邮件超时');
  }

  renderContent() {
    const { classes } = this.props;
    return (
      <div className="content__login">
        <header className="login__logo">Gallery +</header>
        <section className="login__form">
          <Input
            className={classes.input}
            name="account"
            placeholder="体验账号: guest"
            value={this.state.account}
            onChange={this._handleChange}
            disableUnderline
            fullWidth
          />
          <Input
            className={classes.input}
            name="password"
            type="password"
            placeholder="密码: guest001"
            value={this.state.password}
            onChange={this._handleChange}
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
          onClick={this._handleOpenModal}
        >忘记密码?
        </footer>
      </div>
    );
  }

  render() {
    return (
      <ViewLayout Topbar={<PrimaryNavHeader />}>
        <Loader
          open={this.state.isProcessing}
          message={this.state.processMsg}
          onTimeout={this._handleLoaderTimeout}
        />
        { this.renderContent() }
      </ViewLayout>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  userLogin,
  modalOpen,
  modalClose,
  snackBarOpen,
}, dispatch);

const styles = {
  input: {
    display: 'flex',
    alignItems: 'flex-end',
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

export default compose(
  connect(null, mapDispatchToProps),
  withStyles(styles),
  withRedirect,
)(LoginPage);
