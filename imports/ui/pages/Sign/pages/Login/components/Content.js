import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import { validateEmail } from '/imports/utils';
import Modal from '/imports/ui/components/Modal';
import ModalActions from '/imports/ui/components/Modal/Common/ModalActions';
import {
  Wrapper,
  Logo,
  Section,
  Separator,
  Footer,
} from '../../styles';

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
    snackBarOpen: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  state = {
    account: '',
    password: '',
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.account !== nextState.account ||
    this.state.password !== nextState.password;
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

  _handleLogin = async () => {
    const { account, password } = this.state;
    if (!account) {
      this.props.snackBarOpen('请输入账号');
      return;
    }
    if (!password) {
      this.props.snackBarOpen('请输入密码');
      return;
    }
    await Modal.showLoader('登录中');
    await this.props.userLogin({ account, password });
    Modal.close();
    this.props.snackBarOpen('登陆成功');
    this.props.history.replace('/');
  }

  _handleSentResetEmail = async () => {
    const { email } = modalState;

    if (!validateEmail(email)) {
      this.props.snackBarOpen('请输入正确的邮箱地址');
      return;
    }

    try {
      await Modal.showLoader('发送邮件中');
      const forgotPassword = Meteor.wrapPromise(Accounts.forgotPassword);
      await forgotPassword({ email });
      Modal.close();
      this.props.snackBarOpen('发送成功');
    } catch (err) {
      console.warn(err);
      Modal.close();
      this.props.snackBarOpen(`发送失败 ${err.error}`);
    }
  }

  renderPrompt = () => {
    const { classes } = this.props;
    Modal.show({
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
          onCancel={() => {
            Modal.close();
            modalState.email = '';
          }}
          onConfirm={async () => {
            await this._handleSentResetEmail();
            modalState.email = '';
          }}
        />
      ),
      ops: { ignoreBackdropClick: true },
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <Wrapper>
        <Logo>
          <h2>Gallery Plus</h2>
        </Logo>
        <Section>
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
        </Section>
        <Section>
          <Button
            className={classes.btn__login}
            onClick={this._handleLogin}
            raised
          >立即登录
          </Button>
          <Separator>或</Separator>
          <Button
            className={classes.btn__register}
            onClick={() => this.props.history.push('/register')}
            raised
          >创建账号
          </Button>
        </Section>
        <Footer onClick={this.renderPrompt}>忘记密码?</Footer>
      </Wrapper>
    );
  }
}
