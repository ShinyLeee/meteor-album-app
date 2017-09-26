import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import CustomNavHeader from '/imports/ui/components/NavHeader/Custom/Custom.jsx';

export default class ResetPasswordPage extends Component {
  static propTypes = {
    snackBarOpen: PropTypes.func.isRequired,
    // Below From React-Router
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isAlertOpen: false,
      isProcessing: false,
      processMsg: '',
      newPwd: '',
      newPwd2: '',
    };
  }

  handleValueChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleResetPassword = (e) => {
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
      this.props.history.replace('/login');
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
        <CustomNavHeader
          title="修改密码"
          titleStyle={{ fontSize: '20px' }}
          iconElementLeft={
            <IconButton onTouchTap={() => this.setState({ isAlertOpen: true })}>
              <ArrowBackIcon />
            </IconButton>}
        />
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
            </section>
            <section className="resetPassword__button" style={{ padding: '22px 0', textAlign: 'center' }}>
              <RaisedButton
                label="修改密码"
                labelColor="#fff"
                backgroundColor="#0077d9"
                onTouchTap={this.handleResetPassword}
              />
            </section>
            <Dialog
              actions={[
                <FlatButton
                  label="取消"
                  onTouchTap={() => this.setState({ isAlertOpen: false })}
                  primary
                />,
                <FlatButton
                  label="确认"
                  onTouchTap={() => this.props.history.replace('/')}
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
