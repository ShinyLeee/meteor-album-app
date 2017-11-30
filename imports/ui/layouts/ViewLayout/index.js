import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import GlobalLoader from './Loader';

class ViewLayout extends PureComponent {
  static propTypes = {
    deep: PropTypes.bool,
    loadingStyle: PropTypes.object,
    loadingType: PropTypes.oneOf(['Circle', 'Linear']),
    topbarHeight: PropTypes.number,
    Topbar: PropTypes.element.isRequired,
    children: PropTypes.any,
    isFetchingAuth: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    deep: false,
    topbarHeight: 64,
  }

  static setRootBackgroundColor(deep) {
    const className = document.body.className;
    if (className !== 'deep' && deep) {
      document.body.className = 'deep';
    }
    if (className === 'deep' && !deep) {
      document.body.className = '';
    }
  }

  componentDidMount() {
    ViewLayout.setRootBackgroundColor(this.props.deep);
  }

  componentWillReceiveProps(nextProps) {
    const { deep } = nextProps;
    if (this.props.deep !== deep) {
      ViewLayout.setRootBackgroundColor(nextProps.deep);
    }
  }

  render() {
    const {
      deep,
      loadingStyle,
      loadingType,
      topbarHeight,
      Topbar,
      children,
      isFetchingAuth,
    } = this.props;
    const loaderStyle = topbarHeight === 64
      ? loadingStyle
      : Object.assign({}, loadingStyle, { top: topbarHeight });
    return [
      React.cloneElement(Topbar, { key: 'topbar', height: topbarHeight }),
      <main
        key="content"
        className={classNames('content', { deep })}
      >
        <GlobalLoader
          loadingStyle={loaderStyle}
          loadingType={loadingType}
        />
        { !isFetchingAuth && children }
      </main>,
    ];
  }
}

const mapStateToProps = ({ sessions }) => ({
  isFetchingAuth: sessions.auth.isFetching,
});

export default connect(mapStateToProps)(ViewLayout);
