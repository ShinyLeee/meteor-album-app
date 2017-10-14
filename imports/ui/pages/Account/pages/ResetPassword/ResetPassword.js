import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import blue from 'material-ui/colors/blue';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import { ModalActions } from '/imports/ui/components/Modal';
import { CustomNavHeader } from '/imports/ui/components/NavHeader';

const blue500 = blue[500];

class ResetPasswordPage extends Component {
  static propTypes = {
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    isProcessing: false,
    processMsg: '',
    newPwd: '',
    newPwd2: '',
  }

  _handleValueChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  _handleResetPassword = () => {
    const { location } = this.props;
    const { newPwd, newPwd2 } = this.state;

    const token = _.get(location, 'state.token');

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

  _handleOpenModal = () => {
    this.props.modalOpen({
      content: '是否确认离开此页面？',
      actions: (
        <ModalActions
          sClick={this.props.modalClose}
          pClick={() => {
            this.props.history.replace('/');
            this.props.modalClose();
          }}
        />
      ),
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
        <section className="resetPassword__button">
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
      <ViewLayout
        Topbar={
          <CustomNavHeader
            classnames={{ root: classes.navheader__root, content: classes.navheader__content }}
            title="修改密码"
            Left={
              <IconButton color="contrast" onClick={this._handleOpenModal}>
                <ArrowBackIcon />
              </IconButton>
            }
          />
        }
      >
        { this.renderContent() }
      </ViewLayout>
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
