import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { blue500 } from 'material-ui/styles/colors';

export default class ResetPasswordPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      processMsg: '',
      newPwd: '',
      newPwd2: '',
    };
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
  }

  handleValueChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleResetPassword(e) {
    e.preventDefault();

    const { location: { state: { token } } } = this.props;
    const { newPwd, newPwd2 } = this.state;

    if (!newPwd || !newPwd2) {
      this.props.snackBarOpen('请输入必填项');
      return;
    }

    if (newPwd !== newPwd2) {
      this.props.snackBarOpen('两次密码输入不相同');
      return;
    }

    this.setState({ isProcessing: true, processMsg: '修改密码中' });

    const resetPassword = Meteor.wrapPromise(Accounts.resetPassword);

    resetPassword(token, newPwd)
    .then(() => {
      this.setState({ isProcessing: false, processMsg: '' });
      browserHistory.replace('/login');
      this.props.snackBarOpen('修改密码成功');
    })
    .catch((err) => {
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(err.reason || '修改密码失败');
      console.log(err); // eslint-disable-line no-console
      throw new Meteor.Error(err);
    });
  }

  render() {
    return (
      <div className="container">
        <AppBar
          style={{ position: 'fixed', top: 0, backgroundColor: blue500 }}
          title="修改密码"
          titleStyle={{ fontSize: '20px' }}
        />
        <div className="content">
          <div className="content__resetPassword">
            <div className="resetPassword__form">
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
            <div className="resetPassword__button" style={{ padding: '22px 0', textAlign: 'center' }}>
              <RaisedButton
                label="修改密码"
                labelColor="#fff"
                backgroundColor="#0077d9"
                onTouchTap={this.handleResetPassword}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ResetPasswordPage.displayName = 'ResetPasswordPage';

ResetPasswordPage.propTypes = {
  location: PropTypes.object.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
};
