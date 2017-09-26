import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import PrimaryNavHeader from '../../components/NavHeader/Primary/Primary.jsx';

const sourceDomain = Meteor.settings.public.sourceDomain;

const InternalError = () => (
  <div className="container">
    <PrimaryNavHeader />
    <main className="content">
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

export default InternalError;
