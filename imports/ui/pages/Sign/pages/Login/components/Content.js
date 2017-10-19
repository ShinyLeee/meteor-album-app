import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import { validateEmail } from '/imports/utils';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import { ModalActions, ModalLoader } from '/imports/ui/components/Modal/Common';

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
export default class LoginContent extends Component {
  static propTypes = {
    userLogin: PropTypes.func.isRequired,
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  state = {
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
      this.renderPrompt();
      return;
    }
    this.setState({ [name]: value });
  }

  _handleLogin = () => {
    const { account, password } = this.state;

    this.renderLoadModal('登录中');

    const loginWithPassword = Meteor.wrapPromise(Meteor.loginWithPassword);

    loginWithPassword(account, password)
      .then(() => {
        const user = Meteor.user();
        this.setState({ account: '', password: '' });
        this.props.modalClose();
        this.props.userLogin(user);
        this.props.snackBarOpen('登陆成功');
        this.props.history.replace('/');
      })
      .catch((err) => {
        console.log(err);
        this.props.modalClose();
        this.props.snackBarOpen(`登录失败 ${err.reason}`);
      });
  }

  _handleSentResetEmail = () => {
    const { email } = modalState;

    if (!validateEmail(email)) {
      this.props.snackBarOpen('请输入正确的邮箱地址');
      return;
    }

    this.renderLoadModal('发送邮件中');

    const forgotPassword = Meteor.wrapPromise(Accounts.forgotPassword);

    forgotPassword({ email })
      .then(() => {
        this.props.modalClose();
        this.props.snackBarOpen('发送成功');
      })
      .catch((err) => {
        console.log(err);
        this.props.modalClose();
        this.props.snackBarOpen(`发送失败 ${err.reason}`);
      });
  }

  renderPrompt = () => {
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

  renderLoadModal = (message, errMsg = '请求超时') => {
    this.props.modalOpen({
      content: <ModalLoader message={message} errMsg={errMsg} />,
      ops: { ignoreBackdropClick: true },
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <ContentLayout loading={false}>
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
            onClick={this.renderPrompt}
          >忘记密码?
          </footer>
        </div>
      </ContentLayout>
    );
  }
}
