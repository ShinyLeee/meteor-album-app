import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import Modal from '/imports/ui/components/Modal';

export default class PasswordContent extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    userLogout: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    oldPwd: '',
    newPwd: '',
    newPwd2: '',
  }

  _handleValueChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  _handlePasswordChange = async () => {
    const { oldPwd, newPwd, newPwd2 } = this.state;

    if (!oldPwd || !newPwd || !newPwd2) {
      this.props.snackBarOpen('请输入必填项');
      return;
    }

    if (newPwd !== newPwd2) {
      this.props.snackBarOpen('两次密码输入不相同');
      return;
    }
    try {
      await Modal.showLoader('修改密码中');
      const changePassword = Meteor.wrapPromise(Accounts.changePassword);
      await changePassword(oldPwd, newPwd);
      await this.props.userLogout();
      Modal.close();
      this.props.history.replace('/login');
      this.props.snackBarOpen('修改密码成功，请重新登录');
    } catch (err) {
      console.warn(err);
      Modal.close();
      this.props.snackBarOpen(`修改密码失败 ${err.error}`);
    }
  }

  render() {
    const { classes } = this.props;
    return [
      <section key="InputSection">
        <Input
          className={classes.input}
          name="oldPwd"
          placeholder="当前密码"
          type="password"
          value={this.state.oldPwd}
          onChange={this._handleValueChange}
          disableUnderline
          fullWidth
        />
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
      </section>,
      <Button
        key="ConfirmBtn"
        className={classes.button}
        color="primary"
        onClick={this._handlePasswordChange}
        raised
      >确认修改
      </Button>,
    ];
  }
}
