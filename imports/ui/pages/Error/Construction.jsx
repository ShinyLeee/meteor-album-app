import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import errorHOC from '../../containers/Error/index.jsx';
import NavHeader from '../../components/NavHeader/NavHeader.jsx';

const Construction = ({ User, sourceDomain, noteNum, snackBarOpen }) => (
  <div className="container">
    <NavHeader
      User={User}
      noteNum={noteNum}
      snackBarOpen={snackBarOpen}
      primary
    />
    <div className="content Error">
      <div className="Error__container">
        <h2 className="Error__status">This Page is Under Construction</h2>
        <img
          className="Error__logo"
          src={`${sourceDomain}/GalleryPlus/Error/Construction.png`}
          alt="Under Construction"
        />
        <p className="Error__info">该页面正在紧张的开发中</p>
        <p className="Error__info">
          请检查地址是否输入正确&nbsp;
          <Link to="/">返回首页</Link>，或向管理员汇报这个问题
        </p>
      </div>
    </div>
  </div>
);

Construction.displayName = 'Construction';

Construction.defaultProps = {
  sourceDomain: Meteor.settings.public.sourceDomain,
};

Construction.propTypes = {
  User: PropTypes.object,
  sourceDomain: PropTypes.string.isRequired,
  noteNum: PropTypes.number.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
};

export default errorHOC(Construction);
