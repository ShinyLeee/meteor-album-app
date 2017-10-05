import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { Component } from 'react';
import { vHeight } from '/imports/utils/responsive';
import { PrimaryNavHeader } from '/imports/ui/components/NavHeader';
import { LinearLoader } from '/imports/ui/components/Loader';

export default class RootLayout extends Component {
  static propTypes = {
    deep: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    children: PropTypes.any,
    Topbar: PropTypes.element,
  }

  static defaultProps = {
    deep: false,
    loading: true,
  }

  render() {
    const { deep, loading, children, Topbar } = this.props;
    return (
      <div className="container">
        {
          loading ? <PrimaryNavHeader /> : Topbar
        }
        <main
          className={classNames('content', { deep })}
          style={{ minHeight: vHeight - 64 }}
        >
          { children }
          {
            loading && <LinearLoader />
          }
        </main>
      </div>
    );
  }
}
