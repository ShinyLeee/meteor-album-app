import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import PrimaryNavHeader from '/imports/ui/components/NavHeader/Primary';
import { Content } from './styles';

export default class VerifyEmailPage extends Component {
  static propTypes = {
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
      <ViewLayout
        Topbar={<PrimaryNavHeader />}
        alignCenter
        fullScreen
      >
        <Content>
          <h2>邮箱验证成功</h2>
          <p>本页面将在2秒后自动跳转返回首页</p>
          <p>若无反应请点击此<Link to="/">链接</Link>进行手动跳转</p>
        </Content>
      </ViewLayout>
    );
  }
}
