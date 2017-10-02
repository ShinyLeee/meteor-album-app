import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'material-ui/Button';
import ListSubheader from 'material-ui/List/ListSubheader';
import Divider from 'material-ui/Divider';
import Menu, { MenuItem } from 'material-ui/Menu';
import List, { ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import TextField from 'material-ui/TextField';
import grey from 'material-ui/colors/grey';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import { CircleLoader } from '/imports/ui/components/Loader';

const grey400 = grey['400'];

export default class EmailsPage extends Component {
  static propTypes = {
    // Below Pass from React-Router
    User: PropTypes.object.isRequired,
    // Below Pass from Redux
    snackBarOpen: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      processMsg: '',
      email: '',
    };
  }

  _handleEmailValueChange = (e) => {
    e.preventDefault();
    this.setState({ email: e.target.value });
  }

  _handleSentVerifyEmail = (e) => {
    e.preventDefault();
    this.setState({ isProcessing: true, processMsg: '发送邮件中' });
    Meteor.callPromise('Accounts.sendVerifyEmail')
    .then(() => {
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen('发送成功');
    })
    .catch((err) => {
      console.log(err);
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(err.reason || '发送失败');
    });
  }
    /**
     * Return the new gloabl counter and group state, when select or cancel one photo
     * @param {object}  e - onClick event Object
     * @param {string} email - the email address in Menu item wait for remove
     */
  _handleRemoveEmail = (e, email) => {
    e.preventDefault();
    this.setState({ isProcessing: true, processMsg: '解除绑定邮箱中' });
    Meteor.callPromise('Accounts.removeEmail', { email })
    .then(() => {
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen('解除绑定邮箱成功');
    })
    .catch((err) => {
      console.log(err);
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(err.reason || '解除邮箱绑定失败');
    });
  }

  _handleAddEmail = (e) => {
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
      console.log(err);
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(err.reason || '更换邮箱失败');
    });
  }

  _handleLoaderTimeout = () => {
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
            <Menu iconButtonElement={<IconButton><MoreVertIcon color={grey400} /></IconButton>}>
              { !email.verified && <MenuItem onClick={this._handleSentVerifyEmail}>重新发送验证邮件</MenuItem> }
              <MenuItem onClick={(e) => this._handleRemoveEmail(e, email.address)}>解除绑定</MenuItem>
            </Menu>
          }
          disabled
        />
      );
    });
  }

  render() {
    return (
      <div className="container">
        <SecondaryNavHeader title="我的邮箱" />
        <main className="content">
          <CircleLoader
            open={this.state.isProcessing}
            message={this.state.processMsg}
            onTimeout={this._handleLoaderTimeout}
          />
          <div className="content__settingEmails">
            <section className="settingEmails__current">
              <List>
                <ListSubheader><span>邮箱列表</span></ListSubheader>
                { this.renderEmailList() }
              </List>
            </section>
            <Divider />
            <section className="settingEmails__new">
              <ListSubheader>添加邮箱</ListSubheader>
              <TextField
                name="newEmail"
                style={{ padding: '0 16px' }}
                hintText="邮箱地址"
                underlineShow={false}
                value={this.state.email}
                onChange={this._handleEmailValueChange}
              />
            </section>
            <Divider />
            <section className="settingEmails__action">
              <p style={{ padding: '0 16px', fontSize: '12px' }}>邮箱用于登陆及修改密码等安全性操作，如若尚未绑定邮箱或仍未完成验证，请即刻完成邮箱绑定或验证，以保护账号安全。</p>
              <div style={{ margin: '18px 24px 0 0', textAlign: 'right' }}>
                <Button label="下一步" onClick={this._handleAddEmail} raised />
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

}
