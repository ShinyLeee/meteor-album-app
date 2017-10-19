import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import ModalLoader from '/imports/ui/components/Modal/Common/ModalLoader';

export default class ResetPasswordContent extends Component {
  static propTypes = {
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
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

    this.renderLoadModal('修改密码中');


    const resetPassword = Meteor.wrapPromise(Accounts.resetPassword);

    resetPassword(token, newPwd)
      .then(() => {
        this.props.modalClose();
        this.props.history.replace('/login');
        this.props.snackBarOpen('修改密码成功');
      })
      .catch((err) => {
        console.log(err);
        this.props.modalClose();
        this.props.snackBarOpen(`修改密码失败 ${err.reason}`);
      });
  }

  renderLoadModal = (message, errMsg = '请求超时') => {
    this.props.modalOpen({
      content: <ModalLoader message={message} errMsg={errMsg} />,
      ops: { ignoreBackdropClick: true },
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <ContentLayout loading={false}>
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
      </ContentLayout>
    );
  }
}
