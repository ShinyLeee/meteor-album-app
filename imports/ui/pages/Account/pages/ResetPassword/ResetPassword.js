import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
// import IconButton from 'material-ui/IconButton';
// import ArrowBackIcon from 'material-ui-icons/ArrowBack';

export default class ResetPasswordPage extends Component {
  static propTypes = {
    snackBarOpen: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    isAlertOpen: false,
    isProcessing: false,
    processMsg: '',
    newPwd: '',
    newPwd2: '',
  }

  _handleValueChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  _handleResetPassword = () => {
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
      this.props.history.replace('/login');
      this.props.snackBarOpen('修改密码成功');
    })
    .catch((err) => {
      console.log(err);
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(`修改密码失败 ${err.reason}`);
    });
  }

  render() {
    return (
      <div className="container">
        {/* <CustomNavHeader
          title="修改密码"
          titleStyle={{ fontSize: '20px' }}
          iconElementLeft={
            <IconButton onClick={() => this.setState({ isAlertOpen: true })}>
              <ArrowBackIcon />
            </IconButton>}
        /> */}
        <main className="content">
          <div className="content__resetPassword">
            <section className="resetPassword__form">
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
            <section className="resetPassword__button" style={{ padding: '22px 0', textAlign: 'center' }}>
              <Button
                label="修改密码"
                labelColor="#fff"
                backgroundColor="#0077d9"
                onClick={this._handleResetPassword}
                raised
              />
            </section>
            <Dialog
              actions={[
                <Button
                  label="取消"
                  onClick={() => this.setState({ isAlertOpen: false })}
                  primary
                />,
                <Button
                  label="确认"
                  onClick={() => this.props.history.replace('/')}
                  primary
                />,
              ]}
              open={this.state.isAlertOpen}
              onRequestClose={() => this.setState({ isAlertOpen: false })}
            >是否确认离开此页面？
            </Dialog>
          </div>
        </main>
      </div>
    );
  }
}
