import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import AppBar from 'material-ui/AppBar';

export default class VerifyEmailPage extends Component {
  constructor(props) {
    super(props);
    this.autoRedirect = this.autoRedirect.bind(this);
  }

  componentDidMount() {
    setTimeout(this.autoRedirect, 2000);
  }

  componentWillUnmount() {
    clearTimeout(this.autoRedirect);
  }

  autoRedirect() {
    browserHistory.replace('/');
  }

  render() {
    return (
      <div className="container">
        <AppBar title="GalleryPlus" />
        <div className="content">
          <div className="content__verifyEmail">
            <h2>邮箱验证成功</h2>
            <p>本页面将在2秒后自动跳转返回首页</p>
            <p>若无反应请点击此<Link to="/">链接</Link>进行手动跳转</p>
          </div>
        </div>
      </div>
    );
  }
}

VerifyEmailPage.displayName = 'VerifyEmailPage';
