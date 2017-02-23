import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TextField from 'material-ui/TextField';
import { blue500, grey400 } from 'material-ui/styles/colors';

import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import Loader from '/imports/ui/components/Loader/Loader.jsx';

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
    this.handleAddEmail = this.handleAddEmail.bind(this);
    this.handleLoaderTimeout = this.handleLoaderTimeout.bind(this);
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
    /**
     * Return the new gloabl counter and group state, when select or cancel one photo
     * @param {object}  e - onTouchTap event Object
     * @param {string} email - the email address in Menu item wait for remove
     */
  handleRemoveEmail(e, email) {
    e.preventDefault();
    this.setState({ isProcessing: true, processMsg: '解除绑定邮箱中' });
    Meteor.callPromise('Accounts.removeEmail', { email })
    .then(() => {
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen('解除绑定邮箱成功');
    })
    .catch((err) => {
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(err.reason || '解除邮箱绑定失败');
      console.log(err); // eslint-disable-line no-console
      throw new Meteor.Error(err);
    });
  }

  handleAddEmail(e) {
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

  handleLoaderTimeout() {
    this.setState({ isProcessing: false, processMsg: '' });
    this.props.snackBarOpen('发送邮件失败');
  }

  renderEmailList() {
    const { User } = this.props;

    if (!User.emails || User.emails.length === 0) {
      return (
        <ListItem
          primaryText="暂无邮箱"
          secondaryText="请即刻通过下方区域添加邮箱"
          disabled
        />);
    }
    return User.emails.map((email, i) => {
      let emailStatus;

      if (email.verified) emailStatus = '验证通过';
      else emailStatus = '等待验证中';

      return (
        <ListItem
          key={i}
          primaryText={email.address}
          secondaryText={emailStatus}
          rightIconButton={
            <IconMenu iconButtonElement={<IconButton><MoreVertIcon color={grey400} /></IconButton>}>
              { !email.verified && <MenuItem onTouchTap={this.handleSentVerifyEmail}>重新发送验证邮件</MenuItem> }
              <MenuItem onTouchTap={(e) => this.handleRemoveEmail(e, email.address)}>解除绑定</MenuItem>
            </IconMenu>
          }
          disabled
        />
      );
    });
  }

  render() {
    return (
      <div className="container">
        <NavHeader
          title="我的邮箱"
          style={{ backgroundColor: blue500 }}
          secondary
        />
        <main className="content">
          <Loader
            open={this.state.isProcessing}
            message={this.state.processMsg}
            onTimeout={this.handleLoaderTimeout}
          />
          <div className="content__settingEmails">
            <section className="settingEmails__current">
              <List>
                <Subheader>
                  <span>邮箱列表</span>
                </Subheader>
                { this.renderEmailList() }
              </List>
            </section>
            <Divider />
            <section className="settingEmails__new">
              <Subheader>添加邮箱</Subheader>
              <TextField
                name="newEmail"
                style={{ padding: '0 16px' }}
                hintText="邮箱地址"
                underlineShow={false}
                value={this.state.email}
                onChange={this.handleEmailValueChange}
              />
            </section>
            <Divider />
            <section className="settingEmails__action">
              <p style={{ padding: '0 16px', fontSize: '12px' }}>邮箱用于登陆及修改密码等安全性操作，如若尚未绑定邮箱或仍未完成验证，请即刻完成邮箱绑定或验证，以保护账号安全。</p>
              <div style={{ margin: '18px 24px 0 0', textAlign: 'right' }}>
                <RaisedButton label="下一步" onTouchTap={this.handleAddEmail} />
              </div>
            </section>
          </div>
        </main>
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
