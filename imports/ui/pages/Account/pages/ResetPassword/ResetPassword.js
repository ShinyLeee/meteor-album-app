import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Dialog from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import blue from 'material-ui/colors/blue';
import RootLayout from '/imports/ui/layouts/RootLayout';
import { CustomNavHeader } from '/imports/ui/components/NavHeader';

const blue500 = blue[500];

class ResetPasswordPage extends Component {
  static propTypes = {
    snackBarOpen: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
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

  renderContent() {
    const { classes } = this.props;
    return (
      <div className="content__resetPassword">
        <section className="resetPassword__form">
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
          /><br />
        </section>
        <section className="resetPassword__button" style={{ padding: '22px 0', textAlign: 'center' }}>
          <Button
            color="primary"
            onClick={this._handleResetPassword}
            raised
          >修改密码
          </Button>
        </section>
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <RootLayout
        loading={false}
        Topbar={
          <CustomNavHeader
            classnames={{ root: classes.navheader__root, content: classes.navheader__content }}
            title="修改密码"
            Left={
              <IconButton color="contrast" onClick={() => this.setState({ isAlertOpen: true })}>
                <ArrowBackIcon />
              </IconButton>
            }
          />
        }
      >
        { this.renderContent() }
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

  navheader__root: {
    backgroundColor: blue500,
  },

  navheader__content: {
    color: '#fff',
  },
};

export default withStyles(styles)(ResetPasswordPage);
