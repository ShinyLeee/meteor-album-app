import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import settings from '/imports/utils/settings';
import RootLayout from '/imports/ui/layouts/RootLayout';
import { PrimaryNavHeader } from '../../components/NavHeader';

const { sourceDomain } = settings;

export default class InternalError extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  render() {
    const { location } = this.props;
    return (
      <RootLayout
        loading={false}
        Topbar={<PrimaryNavHeader />}
      >
        <div className="content__error">
          <div className="error__container">
            <h2 className="error__status">Error: 500 Unexpected Error</h2>
            <img
              className="error__logo"
              src={`${sourceDomain}/GalleryPlus/Error/500.png`}
              alt="500 Unexpected Error"
            />
            <p className="error__info">服务器内部发生错误</p>
            {
              (location.state && location.state.message)
              ? <p className="error__info">{location.state.message}</p>
              : (
                <p className="error__info">
                  请检查地址是否输入正确&nbsp;
                  <Link to="/">返回首页</Link>，或向管理员汇报这个问题
                </p>
              )
            }
          </div>
        </div>
      </RootLayout>
    );
  }
}
