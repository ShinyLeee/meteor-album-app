import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import settings from '/imports/utils/settings';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import PrimaryNavHeader from '/imports/ui/components/NavHeader/Primary';

const { sourceDomain } = settings;

export default class Forbidden extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  render() {
    const { location } = this.props;
    return (
      <ViewLayout Topbar={<PrimaryNavHeader />}>
        <ContentLayout>
          <div className="content__error">
            <div className="error__container">
              <h2 className="error__status">Error: 403 Access Denied</h2>
              <div className="error__logo">
                <img
                  className="error__logo"
                  src={`${sourceDomain}/GalleryPlus/Error/403.png`}
                  alt="403 Access Denied"
                />
              </div>
              <p className="error__info">您没有权限访问该页面</p>
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
        </ContentLayout>
      </ViewLayout>
    );
  }
}
