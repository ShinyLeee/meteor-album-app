import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { blue500 } from 'material-ui/styles/colors';

import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import Loader from '/imports/ui/components/Loader/Loader.jsx';

export default class PasswordPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      processMsg: '',
      oldPwd: '',
      newPwd: '',
      newPwd2: '',
    };
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleTimeout = this.handleTimeout.bind(this);
  }

  handleValueChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handlePasswordChange(e) {
    e.preventDefault();

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
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(err.reason || '修改密码失败');
      console.log(err); // eslint-disable-line no-console
      throw new Meteor.Error(err);
    });
  }

  handleTimeout() {
    this.setState({ isProcessing: false, processMsg: '' });
    this.props.snackBarOpen('更换密码超时，请重试');
  }

  renderContent() {
    return (
      <div className="content__settingPassword">
        <div className="settingPassword__form">
          <TextField
            name="oldPwd"
            hintText="当前密码"
            hintStyle={{ left: '12px' }}
            inputStyle={{ textIndent: '12px' }}
            type="password"
            value={this.state.oldPwd}
            onChange={this.handleValueChange}
            fullWidth
          /><br />
          <TextField
            name="newPwd"
            hintText="新密码"
            hintStyle={{ left: '12px' }}
            inputStyle={{ textIndent: '12px' }}
            type="password"
            value={this.state.newPwd}
            onChange={this.handleValueChange}
            fullWidth
          /><br />
          <TextField
            name="newPwd2"
            hintText="确认密码"
            hintStyle={{ left: '12px' }}
            inputStyle={{ textIndent: '12px' }}
            type="password"
            value={this.state.newPwd2}
            onChange={this.handleValueChange}
            fullWidth
          /><br />
        </div>
        <div className="settingPassword__button" style={{ padding: '22px 0', textAlign: 'center' }}>
          <RaisedButton
            label="确认修改"
            labelColor="#fff"
            backgroundColor="#0077d9"
            onTouchTap={this.handlePasswordChange}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <NavHeader
          title="修改密码"
          style={{ backgroundColor: blue500 }}
          secondary
        />
        <div className="content">
          <Loader
            open={this.state.isProcessing}
            message={this.state.processMsg}
            onTimeout={this.handleTimeout}
          />
          { this.renderContent() }
        </div>
      </div>
    );
  }

}

PasswordPage.displayName = 'PasswordPage';

PasswordPage.propTypes = {
  // Below Pass from Redux
  snackBarOpen: PropTypes.func.isRequired,
};
