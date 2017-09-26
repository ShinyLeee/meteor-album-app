import React, { Component, PropTypes } from 'react';
import { withRouter, Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';

class VerifyEmailPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  componentDidMount() {
    setTimeout(this.autoRedirect, 2000);
  }

  componentWillUnmount() {
    clearTimeout(this.autoRedirect);
  }

  autoRedirect() {
    this.props.history.replace('/');
  }

  render() {
    return (
      <div className="container">
        <AppBar title="GalleryPlus" />
        <main className="content">
          <div className="content__verifyEmail">
            <h2>邮箱验证成功</h2>
            <p>本页面将在2秒后自动跳转返回首页</p>
            <p>若无反应请点击此<Link to="/">链接</Link>进行手动跳转</p>
          </div>
        </main>
      </div>
    );
  }
}

export default withRouter(VerifyEmailPage);
