import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import Modal from '/imports/ui/components/Modal';
import { ButtonSection } from '../styles';

export default class ResetPasswordContent extends PureComponent {
  static propTypes = {
    snackBarOpen: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    newPwd: '',
    newPwd2: '',
  }

  _handleValueChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  _handleResetPassword = async () => {
    const { location } = this.props;
    const { newPwd, newPwd2 } = this.state;

    const token = get(location, 'state.token');

    if (!token) {
      this.props.snackBarOpen('token不存在，请从邮箱所提供链接进入');
      return;
    }

    if (!newPwd || !newPwd2) {
      this.props.snackBarOpen('请输入必填项');
      return;
    }

    if (newPwd !== newPwd2) {
      this.props.snackBarOpen('两次密码输入不相同');
      return;
    }

    try {
      await Modal.showLoader('修改密码中');
      const resetPassword = Meteor.wrapPromise(Accounts.resetPassword);
      await resetPassword(token, newPwd);
      Modal.close();
      this.props.history.replace('/login');
      this.props.snackBarOpen('修改密码成功');
    } catch (err) {
      console.warn(err);
      Modal.close();
      this.props.snackBarOpen(`修改密码失败 ${err.error}`);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Input
          className={classes.input}
          name="newPwd"
          placeholder="新密码"
          type="password"
          value={this.state.newPwd}
          onChange={this._handleValueChange}
          disableUnderline
          fullWidth
        />
        <Input
          className={classes.input}
          name="newPwd2"
          placeholder="确认密码"
          type="password"
          value={this.state.newPwd2}
          onChange={this._handleValueChange}
          disableUnderline
          fullWidth
        />
        <ButtonSection>
          <Button
            color="primary"
            onClick={this._handleResetPassword}
            raised
          >修改密码
          </Button>
        </ButtonSection>
      </div>
    );
  }
}
