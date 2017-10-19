import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import ModalLoader from '/imports/ui/components/Modal/Common/ModalLoader';

export default class PasswordContent extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
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

    this.renderLoadModal('修改密码中');

    const changePassword = Meteor.wrapPromise(Accounts.changePassword);
    const logout = Meteor.wrapPromise(Meteor.logout);

    changePassword(oldPwd, newPwd)
      .then(() => logout())
      .then(() => {
        this.props.modalClose();
        this.props.snackBarOpen('修改密码成功，请重新登录');
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
      </ContentLayout>
    );
  }
}
