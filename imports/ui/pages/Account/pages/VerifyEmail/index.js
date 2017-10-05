import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import RootLayout from '/imports/ui/layouts/RootLayout';
import { PrimaryNavHeader } from '/imports/ui/components/NavHeader';

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

  autoRedirect = () => {
    this.props.history.replace('/');
  }

  render() {
    return (
      <RootLayout
        loading={false}
        Topbar={<PrimaryNavHeader />}
      >
        <div className="content__verifyEmail">
          <h2>邮箱验证成功</h2>
          <p>本页面将在2秒后自动跳转返回首页</p>
          <p>若无反应请点击此<Link to="/">链接</Link>进行手动跳转</p>
        </div>
      </RootLayout>
    );
  }
}

export default withRouter(VerifyEmailPage);
