import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import RootLayout from '/imports/ui/layouts/RootLayout';
import { SecondaryNavHeader } from '/imports/ui/components/NavHeader';
import { CircleLoader } from '/imports/ui/components/Loader';

class PasswordPage extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    isProcessing: false,
    processMsg: '',
    oldPwd: '',
    newPwd: '',
    newPwd2: '',
  }

  _handleValueChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  _handlePasswordChange = () => {
    const { oldPwd, newPwd, newPwd2 } = this.state;

    if (!oldPwd || !newPwd || !newPwd2) {
      this.props.snackBarOpen('请输入必填项');
      return;
    }

    if (newPwd !== newPwd2) {
      this.props.snackBarOpen('两次密码输入不相同');
      return;
    }

    this.setState({ isProcessing: true, processMsg: '修改密码中' });

    const changePassword = Meteor.wrapPromise(Accounts.changePassword);
    const logout = Meteor.wrapPromise(Meteor.logout);

    changePassword(oldPwd, newPwd)
    .then(() => logout())
    .then(() => {
      this.props.snackBarOpen('修改密码成功，请重新登录');
    })
    .catch((err) => {
      console.log(err);
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(`修改密码失败 ${err.reason}`);
    });
  }

  _handleTimeout = () => {
    this.setState({ isProcessing: false, processMsg: '' });
    this.props.snackBarOpen('更换密码超时，请重试');
  }

  renderContent() {
    const { classes } = this.props;
    return (
      <div className="content__settingPassword">
        <section className="settingPassword__form">
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
        </section>
        <section className="settingPassword__button">
          <Button
            color="primary"
            onClick={this._handlePasswordChange}
            raised
          >确认修改
          </Button>
        </section>
      </div>
    );
  }

  render() {
    return (
      <RootLayout
        loading={false}
        Topbar={<SecondaryNavHeader title="修改密码" />}
      >
        <CircleLoader
          open={this.state.isProcessing}
          message={this.state.processMsg}
          onTimeout={this._handleLoaderTimeout}
        />
        { this.renderContent() }
      </RootLayout>
    );
  }

}

const styles = {
  input: {
    display: 'flex',
    alignItems: 'flex-end',
    height: 48,
    paddingLeft: 14,
    borderBottom: '1px solid #e0e0e0',
  },
};

export default withStyles(styles)(PasswordPage);
