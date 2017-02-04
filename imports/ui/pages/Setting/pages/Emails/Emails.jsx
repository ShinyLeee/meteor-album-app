import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import { blue500 } from 'material-ui/styles/colors';

import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import Loader from '/imports/ui/components/Loader/Loader.jsx';
import Label from '/imports/ui/components/Label/Label.jsx';

export default class EmailsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      processMsg: '',
      email: '',
    };
    this.handleEmailValueChange = this.handleEmailValueChange.bind(this);
    this.handleSentVerifyEmail = this.handleSentVerifyEmail.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleTimeout = this.handleTimeout.bind(this);
  }

  handleEmailValueChange(e) {
    e.preventDefault();
    this.setState({ email: e.target.value });
  }

  handleSentVerifyEmail(e) {
    e.preventDefault();
    this.setState({ isProcessing: true, processMsg: '发送邮件中' });
    Meteor.callPromise('Accounts.sendVerifyEmail')
    .then(() => {
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen('发送成功');
    })
    .catch((err) => {
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(err.reason || '发送失败');
      console.log(err); // eslint-disable-line no-console
      throw new Meteor.Error(err);
    });
  }

  handleEmailChange(e) {
    e.preventDefault();
    if (!this.state.email) {
      this.props.snackBarOpen('请输入新邮箱地址');
      return;
    }
    this.setState({ isProcessing: true, processMsg: '发送验证邮件中' });
    Meteor.callPromise('Accounts.addEmail', { email: this.state.email })
    .then(() => {
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen('添加成功，请前往邮箱进行验证');
    })
    .catch((err) => {
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(err.reason || '更换邮箱失败');
      console.log(err); // eslint-disable-line no-console
      throw new Meteor.Error(err);
    });
  }

  handleTimeout() {
    this.setState({ isProcessing: false, processMsg: '' });
    this.props.snackBarOpen('发送邮件失败');
  }

  renderContent() {
    const { User } = this.props;

    let labelType = 'default';
    let emailStatus;

    if (!User.emails) {
      labelType = 'warning';
      emailStatus = '尚未绑定邮箱';
    } else if (!User.emails[0].verified) {
      labelType = 'primary';
      emailStatus = '等待验证中';
    } else if (User.emails[0].verified) {
      labelType = 'success';
      emailStatus = '验证通过';
    }

    return (
      <div className="content__settingEmails">
        <div className="settingEmails__holder">
          <div className="settingEmails__current">
            <Subheader>
              <span>当前邮箱</span>
              <Label text={emailStatus} type={labelType} />
            </Subheader>
            <TextField
              name="curEmail"
              style={{ padding: '0 16px' }}
              defaultValue={(User.emails && User.emails[0].address) || '您还尚未绑定邮箱'}
              underlineShow={false}
              disabled
            />
          </div>
          <div className="settingEmails__info" style={{ margin: '18px 24px 0 0', textAlign: 'right' }}>
            {
              emailStatus === '等待验证中' && (
                <RaisedButton
                  label="重新发送"
                  onTouchTap={this.handleSentVerifyEmail}
                  primary
                />
              )
            }
          </div>
          <div className="settingEmails__new">
            <Subheader>更换邮箱</Subheader>
            <TextField
              name="newEmail"
              style={{ padding: '0 16px' }}
              hintText="邮箱地址"
              value={this.state.email}
              onChange={this.handleEmailValueChange}
            />
          </div>
          <p
            className="settingEmails__info"
            style={{ padding: '0 16px', fontSize: '12px' }}
          >邮箱地址用于登陆以及修改密码等安全性操作，如若尚未绑定邮箱或仍未完成验证，请即刻完成邮箱绑定或验证，以保护账号安全。
          </p>
          <div
            className="settingEmails__actions"
            style={{ margin: '18px 24px 0 0', textAlign: 'right' }}
          >
            <RaisedButton label="下一步" onTouchTap={this.handleEmailChange} />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <NavHeader
          title="我的邮箱"
          style={{ backgroundColor: blue500 }}
          secondary
        />
        <div className="content">
          <Loader
            open={this.state.isProcessing}
            message={this.state.processMsg}
            onTimeout={this.handleTimeout}
          />
          { this.props.User && this.renderContent() }
        </div>
      </div>
    );
  }

}

EmailsPage.displayName = 'EmailsPage';

EmailsPage.propTypes = {
  User: PropTypes.object.isRequired,
  // Below Pass from Redux
  snackBarOpen: PropTypes.func.isRequired,
};
