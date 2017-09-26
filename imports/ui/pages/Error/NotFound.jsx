import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import PrimaryNavHeader from '../../components/NavHeader/Primary/Primary.jsx';

const sourceDomain = Meteor.settings.public.sourceDomain;

const NotFound = () => (
  <div className="container">
    <PrimaryNavHeader />
    <main className="content">
      <div className="content__error">
        <div className="error__container">
          <h2 className="error__status">Error: 404 Page Not Found</h2>
          <img
            className="error__logo"
            src={`${sourceDomain}/GalleryPlus/Error/404.png`}
            alt="404 Not Found"
          />
          <p className="error__info">您访问的这个页面不存在</p>
          {
            (location.state && location.state.message)
            ? (<p className="error__info">{location.state.message}</p>)
            : (
              <p className="error__info">
                请检查地址是否输入正确&nbsp;
                <Link to="/">返回首页</Link>，或向管理员汇报这个问题
              </p>
            )
          }
        </div>
      </div>
    </main>
  </div>
);

export default NotFound;
