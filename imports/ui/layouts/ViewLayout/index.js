import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import GlobalLoader from './Loader';

class ViewLayout extends PureComponent {
  static propTypes = {
    loadingStyle: PropTypes.object,
    loadingType: PropTypes.oneOf(['Circle', 'Linear']),
    Topbar: PropTypes.element.isRequired,
    deep: PropTypes.bool,
    alignCenter: PropTypes.bool, // 是否垂直居中
    fullScreen: PropTypes.bool,
    topbarHeight: PropTypes.number,
    children: PropTypes.any,
    isFetchingAuth: PropTypes.bool.isRequired,
    isFetchingData: PropTypes.bool.isRequired,
    device: PropTypes.object.isRequired,
  }

  static defaultProps = {
    deep: false,
    alignCenter: false,
    fullScreen: false,
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
      loadingStyle,
      loadingType,
      Topbar,
      deep,
      alignCenter,
      fullScreen,
      topbarHeight,
      children,
      device,
      isFetchingAuth,
      isFetchingData,
    } = this.props;
    const isContentReady = !isFetchingAuth && !isFetchingData;
    const loaderStyle = topbarHeight === 64
      ? loadingStyle
      : Object.assign({}, loadingStyle, { top: topbarHeight });
    return [
      React.cloneElement(Topbar, { key: 'topbar' }),
      <main
        key="content"
        className={classNames('content', { deep })}
        style={{
          height: fullScreen ? device.height : 'auto',
          paddingTop: topbarHeight,
          justifyContent: alignCenter ? 'center' : 'inhreit',
        }}
      >
        <GlobalLoader
          loadingStyle={loaderStyle}
          loadingType={loadingType}
        />
        {
          isFetchingAuth
          ? isContentReady && children
          : children
        }
      </main>,
    ];
  }
}

const mapStateToProps = ({ sessions, device }) => ({
  isFetchingAuth: sessions.auth.isFetching,
  isFetchingData: sessions.isFetchingData,
  device,
});

export default connect(mapStateToProps)(ViewLayout);
