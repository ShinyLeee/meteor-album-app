import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import errorHOC from './errorHOC';
import NavHeader from '../../components/NavHeader/NavHeader.jsx';

const InternalError = ({ User, sourceDomain, noteNum, snackBarOpen }) => (
  <div className="container">
    <NavHeader
      User={User}
      noteNum={noteNum}
      snackBarOpen={snackBarOpen}
      primary
    />
    <div className="content">
      <div className="content__error">
        <div className="error__container">
          <h2 className="error__status">Error: 500 Unexpected Error</h2>
          <img
            className="error__logo"
            src={`${sourceDomain}/GalleryPlus/Error/500.png`}
            alt="500 Unexpected Error"
          />
          <p className="error__info">服务器内部发生错误</p>
          <p className="error__info">
            请检查地址是否输入正确&nbsp;
            <Link to="/">返回首页</Link>，或向管理员汇报这个问题
          </p>
        </div>
      </div>
    </div>
  </div>
);

InternalError.displayName = 'InternalError';

InternalError.defaultProps = {
  sourceDomain: Meteor.settings.public.sourceDomain,
};

InternalError.propTypes = {
  User: PropTypes.object,
  sourceDomain: PropTypes.string.isRequired,
  noteNum: PropTypes.number.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
};

export default errorHOC(InternalError);
