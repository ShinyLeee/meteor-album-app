import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import { checkCode, useCode } from '/imports/api/codes/methods';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import Modal from '/imports/ui/components/Modal';
import {
  Logo,
  Section,
  Separator,
} from '../../styles';

export default class RegisterContent extends Component {
  static propTypes = {
    userLogin: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    email: '',
    username: '',
    password: '',
    password2: '',
    code: '',
  }

  _handleChange = key => evt => {
    this.setState({
      [key]: evt.target.value,
    });
  }

  _handleRegister = async () => {
    const { email, username, password, password2, code } = this.state;

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

    try {
      await Modal.showLoader('创建账号中');
      const isExist = await checkCode.callPromise({ codeNo: code });
      if (!isExist) {
        throw new Meteor.Error(403, '此邀请码不存在或已被使用');
      }
      await Meteor.callPromise('Accounts.createUser', { username, email, password });
      await useCode.callPromise({ codeNo: code });
      await this.props.userLogin({ account: username, password });
      Modal.close();
      this.props.history.replace('/');
      this.props.snackBarOpen('注册成功');
    } catch (err) {
      console.warn(err);
      Modal.close();
      this.props.snackBarOpen(`注册失败 ${err.reason}`);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <ContentLayout
        alignCenter
        fullScreen
      >
        <Logo>
          <h2>Gallery Plus</h2>
        </Logo>
        <Section>
          <Input
            className={classes.input}
            value={this.state.email}
            placeholder="邮箱"
            onChange={this._handleChange('email')}
            disableUnderline
            fullWidth
          /><br />
          <Input
            className={classes.input}
            value={this.state.username}
            placeholder="用户名"
            onChange={this._handleChange('username')}
            disableUnderline
            fullWidth
          /><br />
          <Input
            className={classes.input}
            value={this.state.password}
            placeholder="密码"
            onChange={this._handleChange('password')}
            disableUnderline
            type="password"
            fullWidth
          /><br />
          <Input
            className={classes.input}
            value={this.state.password2}
            placeholder="确认密码"
            onChange={this._handleChange('password2')}
            disableUnderline
            type="password"
            fullWidth
          /><br />
          <Input
            className={classes.input}
            value={this.state.code}
            placeholder="邀请码"
            onChange={this._handleChange('code')}
            disableUnderline
            type="text"
            fullWidth
          /><br />
        </Section>
        <Section>
          <Button
            className={classes.btn__register}
            onClick={this._handleRegister}
            raised
          >注册
          </Button>
          <Separator>或</Separator>
          <Button
            className={classes.btn__login}
            onClick={() => this.props.history.push('/login')}
            raised
          >已有账号
          </Button>
        </Section>
      </ContentLayout>
    );
  }
}
