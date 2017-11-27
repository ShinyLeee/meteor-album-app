import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadingData, loadedData } from '/imports/ui/redux/actions';

const defaultOps = {
  delay: true, // 是否等到数据加载完毕后再显示
  loose: true, // 是否移除data相关props
};

const withDataReadyHandler = (ops) => (WrappedComponent) => {
  const options = Object.assign({}, defaultOps, ops);
  class C extends PureComponent {
    static displayName = `withDataReadyHandler(${WrappedComponent.displayName || WrappedComponent.name})`

    static propTypes = {
      isDataReady: PropTypes.bool.isRequired,
      loadingData: PropTypes.func.isRequired,
      loadedData: PropTypes.func.isRequired,
    }

    componentWillMount() {
      if (!this.props.isDataReady) {
        this.props.loadingData();
      }
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.isDataReady !== nextProps.isDataReady) {
        if (nextProps.isDataReady) {
          this.props.loadedData();
        } else {
          this.props.loadingData();
        }
      }
    }

    componentWillUnmount() {
      if (!this.props.isDataReady) {
        this.props.loadedData();
      }
    }

    render() {
      const { delay, loose } = options;
      const {
        isDataReady,
        loadingData, // eslint-disable-line no-shadow
        loadedData, // eslint-disable-line no-shadow
        ...rest
      } = this.props;
      const remainedProps = loose ? rest : this.props;
      return delay
        ? isDataReady && <WrappedComponent {...remainedProps} />
        : <WrappedComponent {...remainedProps} />;
    }
  }

  const mapDispatchToProps = (dispatch) => bindActionCreators({
    loadingData,
    loadedData,
  }, dispatch);

  return connect(null, mapDispatchToProps)(C);
};

export default withDataReadyHandler;
