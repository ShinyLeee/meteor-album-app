import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import CircleLoader from '/imports/ui/components/Loader/CircleLoader';
import LinearLoader from '/imports/ui/components/Loader/LinearLoader';

class ContentLayout extends PureComponent {
  static propTypes = {
    deep: PropTypes.bool,
    loading: PropTypes.bool,
    loadingStyle: PropTypes.object,
    loadingType: PropTypes.oneOf(['Circle', 'Linear']),
    delay: PropTypes.bool,
    content: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
      PropTypes.element,
    ]),
    alignCenter: PropTypes.bool, // 是否垂直居中
    fullScreen: PropTypes.bool,
    topbarHeight: PropTypes.number,
    children: PropTypes.any,
    device: PropTypes.object.isRequired,
  }

  static defaultProps = {
    deep: false,
    loading: false,
    loadingStyle: null,
    loadingType: 'Linear',
    delay: false,
    content: false,
    alignCenter: false,
    fullScreen: false,
    topbarHeight: 64,
  }

  componentDidMount() {
    this.setRootBackgroundColor(this.props.deep);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.deep !== nextProps.deep) {
      this.setRootBackgroundColor(nextProps.deep);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  setRootBackgroundColor(deep) {
    document.body.className = deep ? 'deep' : '';
  }

  renderLoader() {
    // TODO add delay option
    const { loading, loadingStyle, loadingType } = this.props;
    if (loading) {
      return loadingType === 'Linear'
        ? <LinearLoader style={loadingStyle} />
        : <div className="text-center"><CircleLoader style={loadingStyle} /></div>;
    }
    return null;
  }

  render() {
    const {
      deep,
      loading,
      delay,
      content,
      alignCenter,
      fullScreen,
      topbarHeight,
      children,
      device,
    } = this.props;
    return (
      <main
        className={classNames('content', { deep })}
        style={{
          height: fullScreen ? device.height : 'auto',
          paddingTop: topbarHeight,
          justifyContent: alignCenter ? 'center' : 'inhreit',
        }}
      >
        { this.renderLoader() }
        {
          delay
          ? !loading && (content || children)
          : (content || children)
        }
      </main>
    );
  }
}

const mapStateToProps = ({ device }) => ({
  device,
});

export default connect(mapStateToProps)(ContentLayout);
