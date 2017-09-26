import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary/Secondary.jsx';
import Loader from '/imports/ui/components/Loader/Loader.jsx';

export default class PasswordPage extends Component {
  static propTypes = {
    // Below Pass from Redux
    snackBarOpen: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      processMsg: '',
      oldPwd: '',
      newPwd: '',
      newPwd2: '',
    };
  }

  _handleValueChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  _handlePasswordChange = (e) => {
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
      console.log(err);
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(err.reason || '修改密码失败');
    });
  }

  _handleTimeout = () => {
    this.setState({ isProcessing: false, processMsg: '' });
    this.props.snackBarOpen('更换密码超时，请重试');
  }

  renderContent() {
    return (
      <div className="content__settingPassword">
        <section className="settingPassword__form">
          <TextField
            name="oldPwd"
            hintText="当前密码"
            hintStyle={{ left: '12px' }}
            inputStyle={{ textIndent: '12px' }}
            type="password"
            value={this.state.oldPwd}
            onChange={this._handleValueChange}
            fullWidth
          /><br />
          <TextField
            name="newPwd"
            hintText="新密码"
            hintStyle={{ left: '12px' }}
            inputStyle={{ textIndent: '12px' }}
            type="password"
            value={this.state.newPwd}
            onChange={this._handleValueChange}
            fullWidth
          /><br />
          <TextField
            name="newPwd2"
            hintText="确认密码"
            hintStyle={{ left: '12px' }}
            inputStyle={{ textIndent: '12px' }}
            type="password"
            value={this.state.newPwd2}
            onChange={this._handleValueChange}
            fullWidth
          /><br />
        </section>
        <section className="settingPassword__button" style={{ padding: '22px 0', textAlign: 'center' }}>
          <RaisedButton
            label="确认修改"
            labelColor="#fff"
            backgroundColor="#0077d9"
            onTouchTap={this._handlePasswordChange}
          />
        </section>
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <SecondaryNavHeader title="修改密码" />
        <main className="content">
          <Loader
            open={this.state.isProcessing}
            message={this.state.processMsg}
            onTimeout={this._handleTimeout}
          />
          { this.renderContent() }
        </main>
      </div>
    );
  }

}
