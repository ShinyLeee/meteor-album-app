import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import PrimaryNavHeader from '../../components/NavHeader/Primary/Primary.jsx';

const Construction = ({ User, sourceDomain }) => (
  <div className="container">
    <PrimaryNavHeader User={User} />
    <main className="content">
      <div className="content__error">
        <div className="error__container">
          <h2 className="error__status">This Page is Under Construction</h2>
          <img
            className="error__logo"
            src={`${sourceDomain}/GalleryPlus/Error/Construction.png`}
            alt="Under Construction"
          />
          <p className="error__info">该页面正在紧张的开发中</p>
          <p className="error__info">
            请检查地址是否输入正确&nbsp;
            <Link to="/">返回首页</Link>，或向管理员汇报这个问题
          </p>
        </div>
      </div>
    </main>
  </div>
);

Construction.displayName = 'Construction';

Construction.defaultProps = {
  sourceDomain: Meteor.settings.public.sourceDomain,
};

Construction.propTypes = {
  User: PropTypes.object,
  sourceDomain: PropTypes.string.isRequired,
};

export default Construction;
