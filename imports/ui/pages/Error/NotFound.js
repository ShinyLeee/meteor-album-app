import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import settings from '/imports/utils/settings';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import { PrimaryNavHeader } from '../../components/NavHeader';

const { sourceDomain } = settings;

export default class NotFound extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  render() {
    const { location } = this.props;
    return (
      <ViewLayout Topbar={<PrimaryNavHeader />}>
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
      </ViewLayout>
    );
  }
}
