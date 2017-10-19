import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import settings from '/imports/utils/settings';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import PrimaryNavHeader from '/imports/ui/components/NavHeader/Primary';

const { sourceDomain } = settings;

export default class Construction extends Component {
  render() {
    return (
      <ViewLayout Topbar={<PrimaryNavHeader />}>
        <ContentLayout>
          <div className="content__error">
            <div className="error__container">
              <h2 className="error__status">This Page is Under Construction</h2>
              <div className="error__logo">
                <img
                  className="error__logo"
                  src={`${sourceDomain}/GalleryPlus/Error/Construction.png`}
                  alt="Under Construction"
                />
              </div>
              <p className="error__info">该页面正在紧张的开发中</p>
              <p className="error__info">
                请检查地址是否输入正确&nbsp;
                <Link to="/">返回首页</Link>，或向管理员汇报这个问题
              </p>
            </div>
          </div>
        </ContentLayout>
      </ViewLayout>
    );
  }
}
